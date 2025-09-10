import Orders from "@/models/order_model";
import connect_mongo from "@/utils/functions/connect_mongo";
import { DateTime } from "luxon";

const order_status = {
    booked: { value: "Booked", color: "#60a5fa" },
    in_transit: { value: "In Transit", color: "#d946ef" },
    delivered: { value: "Delivered", color: "#5be49b" },
    rcp: { value: "RCP", color: "#FFC107" },
    returned: { value: "Returned", color: "#ef4444" },
};

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ message: "Method not allowed" });
    }



    console.log("Connecting with DB");
    try {
        await connect_mongo();
        console.log("Successfully connected with DB");

        const stores = ["Barefoot", "Kickskraze"];
        const timezone = "Asia/Karachi";
        const defaultTime = { hour: 5, minute: 0, second: 0, millisecond: 0 };
        const currentYear = DateTime.now().setZone(timezone).year;
        const currentMonth = DateTime.now().setZone(timezone).month;
        const firstDayOfMonth = DateTime.now().setZone(timezone).set({ year: currentYear, month: currentMonth, day: 1, ...defaultTime }).toJSDate();
        const firstDayOfYear = DateTime.now().setZone(timezone).set({ year: currentYear, month: 1, day: 1, ...defaultTime }).toJSDate();


        // Fetch all data in a single query
        const fetchAllData = async (storeName, fromDate) => {
            const matchCondition = storeName ? { store_name: { $in: [storeName, "Barefoot & Kickskraze"] }, createdAt: { $gte: fromDate } } : { createdAt: { $gte: fromDate } };

            const result = await Orders.aggregate([
                { $match: matchCondition },
                {
                    $facet: {
                        orderStatus: [
                            { $group: { _id: "$status", count: { $sum: 1 } } },
                        ],
                        salesData: [
                             { $match: { status: { $ne: "returned" } } },
                            { $unwind: "$purchase" },
                            {
                                $lookup: {
                                    from: "products",
                                    let: { productId: { $toObjectId: "$purchase._id" } },
                                    pipeline: [{ $match: { $expr: { $eq: ["$_id", "$$productId"] } } }],
                                    as: "productDetails"
                                }
                            },
                            { $unwind: "$productDetails" },
                            { $match: Boolean(storeName) ? { "productDetails.store_name": storeName } : {} },
                            {
                                $group: {
                                    _id: {
                                        day: { $dateToString: { format: "%d-%b", date: "$createdAt", timezone: "Asia/Karachi" } },
                                        month: { $dateToString: { format: "%b", date: "$createdAt", timezone: "Asia/Karachi" } },
                                        year: { $dateToString: { format: "%Y", date: "$createdAt", timezone: "Asia/Karachi" } },
                                    },
                                    totalItems: { $sum: "$purchase.quantity" },
                                },
                            },
                        ],
                        ordersData: [
                             { $match: { status: { $ne: "returned" } } },
                            { $unwind: "$purchase" },
                            {
                                $lookup: {
                                    from: "products",
                                    let: { productId: { $toObjectId: "$purchase._id" } },
                                    pipeline: [{ $match: { $expr: { $eq: ["$_id", "$$productId"] } } }],
                                    as: "productDetails"
                                }
                            },
                            { $unwind: "$productDetails" },
                            { $match: Boolean(storeName) ? { "productDetails.store_name": storeName } : {} },
                            {
                                $group: {
                                    _id: {
                                        day: { $dateToString: { format: "%d-%b", date: "$createdAt", timezone: "Asia/Karachi" } },
                                        month: { $dateToString: { format: "%b", date: "$createdAt", timezone: "Asia/Karachi" } },
                                        year: { $dateToString: { format: "%Y", date: "$createdAt", timezone: "Asia/Karachi" } },
                                    },
                                    totalItems: { $sum: 1 },
                                },
                            },
                        ],
                        revenueData: [                           
                            { $match: { status: { $ne: "returned" } } },
                            { $unwind: "$purchase" },

                            {
                                $lookup: {
                                             from: "products",
                                             let: { productId: { $toObjectId: "$purchase._id" } },
                                             pipeline: [{ $match: { $expr: { $eq: ["$_id", "$$productId"] } } }],
                                             as: "productDetails"
                                         }
                            },
                            { $unwind: "$productDetails" },
                            { $match: Boolean(storeName) ? { "productDetails.store_name": storeName } : {} },

                            // 1) Collapse back to one doc per order (_id), summing the *line totals* only.
                            {
                                $group: {
                                            _id: "$_id",
                                            createdAt: { $first: "$createdAt" },
                                            lineTotal: {
                                                           $sum: {
                                                                     $multiply: [
                                                                                  { $ifNull: ["$productDetails.price", 0] },
                                                                                  "$purchase.quantity"
                                                                                ]
                                                                 }
                                                        },
                                            delivery_charges: { $first: "$delivery_charges" } // << add once
                                        }
                            },

                            // 2) Now group by day and add delivery once per order
                            {
                                $group: {
                                           _id: {
                                                    day:   { $dateToString: { format: "%d-%b", date: "$createdAt", timezone: "Asia/Karachi" } },
                                                    month: { $dateToString: { format: "%b", date: "$createdAt", timezone: "Asia/Karachi" } },
                                                    year:  { $dateToString: { format: "%Y", date: "$createdAt", timezone: "Asia/Karachi" } }
                                                 },
                                           totalRevenue: { $sum: { $add: ["$lineTotal", { $ifNull: ["$delivery_charges", 0] }] } }
                                        }
                            },

                            // (optional) keep shape identical to your current code
                            { $project: { totalRevenue: 1 } }
                        ],
                        netRevenueData: [
                             { $match: { status: { $ne: "returned" } } },
                             { $unwind: "$purchase" },

                             {
                                $lookup: {
                                            from: "products",
                                            let: { productId: { $toObjectId: "$purchase._id" } },
                                            pipeline: [
                                                        { $match: { $expr: { $eq: ["$_id", "$$productId"] } } }
                                                      ],
                                            as: "productDetails"
                                         }
                             },
                             { $unwind: "$productDetails" },
                             { $match: Boolean(storeName) ? { "productDetails.store_name": storeName } : {} },

                             // 1) Collapse back to one doc per order (_id), summing the *profit margins* only
                             {
                                $group: {
                                           _id: "$_id",
                                           createdAt: { $first: "$createdAt" },
                                           netLineTotal: {
                                           $sum: {
                                           $multiply: [
                                                        { 
                                                            $subtract: [
                                                                          { $ifNull: ["$productDetails.price", 0] },
                                                                          { $ifNull: ["$productDetails.cost_price", 0] }
                                                                       ]
                                                        },
                                                        "$purchase.quantity"
                                                      ]
                                                 }
                                                        }
                                        }
                            },

                            // 2) Group by day (net revenue only, no delivery)
                            {
                               $group: {
                                         _id: {
                                                 day:   { $dateToString: { format: "%d-%b", date: "$createdAt", timezone: "Asia/Karachi" } },
                                                 month: { $dateToString: { format: "%b", date: "$createdAt", timezone: "Asia/Karachi" } },
                                                 year:  { $dateToString: { format: "%Y", date: "$createdAt", timezone: "Asia/Karachi" } }
                                              },
                                         totalNetRevenue: { $sum: "$netLineTotal" }
                                       }
                           },

                           { $project: { totalNetRevenue: 1 } }
                        ],
                        ordersByCity: [
                            { $group: { _id: "$city", count: { $sum: 1 } } },
                        ],
                        totalOrdersCount: [
                            { $group: { _id: null, count: { $sum: 1 } } } // Counts total number of orders
                        ],
                        rawOrders: [
                             { $match: matchCondition },
                             { $unwind: "$purchase" },
                             {
                                 $lookup: {
                                             from: "products",
                                             let: { productId: { $toObjectId: "$purchase._id" } },
                                             pipeline: [{ $match: { $expr: { $eq: ["$_id", "$$productId"] } } }],
                                             as: "productDetails"
                                          }
                             },
                             { $match: Boolean(storeName) ? { "productDetails.store_name": storeName } : {} },
                             { $unwind: "$productDetails" },
                             {
                                $project: {
                                             _id: 1,                // << add this!
                                             status: 1,
                                             purchase: 1,
                                             productDetails: 1,
                                             delivery_charges: 1,
                                             createdAt: 1
                                          }
                             },
                         ],
                    },
                },
            ]);

            return result[0]; // $facet returns an array with a single object
        };

        // Helper function to calculate sums
        const calculateSums = (data, statusArg) => {
             const filteredData = data.filter(order => {
             if (statusArg === "delivered") return order.status === "delivered";
             if (statusArg === "undelivered") return order.status !== "delivered" && order.status !== "returned";
             return order.status !== "returned";
             });

             const totalOrders = new Set(filteredData.map(o => String(o._id))).size;
             const totalSales  = filteredData.reduce((s, o) => s + (o.purchase?.quantity || 0), 0);

             // Revenue from items (price * qty), line-level is OK:
             const itemsRevenue = filteredData.reduce((s, o) =>
                 s + ((o.productDetails?.price || 0) * (o.purchase?.quantity || 0))
             , 0);

             // Delivery charges: add once per unique order id
             const seen = new Set();
             const deliveryOnce = filteredData.reduce((s, o) => {
             const id = String(o._id);
             if (!seen.has(id)) {
                 seen.add(id);
                 return s + (o.delivery_charges || 0);
              }
              return s;
             }, 0);

              const totalRevenue = itemsRevenue + deliveryOnce;

              const totalNetRevenue = filteredData.reduce((s, o) =>
              s + (((o.productDetails?.price || 0) - (o.productDetails?.cost_price || 0)) * (o.purchase?.quantity || 0))
              , 0); // delivery not part of net revenue/profit per your current logic

          return { totalOrders, totalSales, totalRevenue, totalNetRevenue };
        };
            
        const analytics = {};

        // Fetch analytics for each store and total
        for (const store of [null, ...stores]) {
            const storeKey = store || "Total";

            const [monthlyData, yearlyData, allTimeData] = await Promise.all([
                fetchAllData(store, firstDayOfMonth),
                fetchAllData(store, firstDayOfYear),
                fetchAllData(store, new Date(0)),
            ]);


            // Sort salesData.daily by date
            monthlyData.salesData.sort((a, b) => a._id.day.localeCompare(b._id.day));
            yearlyData.salesData.sort((a, b) => a._id.day.localeCompare(b._id.day));

            // Populate salesData.monthly and salesData.yearly
            const SALES_MONTHS = [
                { x: "Jan", y: 0 },
                { x: "Feb", y: 0 },
                { x: "Mar", y: 0 },
                { x: "Apr", y: 0 },
                { x: "May", y: 0 },
                { x: "Jun", y: 0 },
                { x: "Jul", y: 0 },
                { x: "Aug", y: 0 },
                { x: "Sep", y: 0 },
                { x: "Oct", y: 0 },
                { x: "Nov", y: 0 },
                { x: "Dec", y: 0 },
            ];

            const monthlySales = {};
            yearlyData.salesData.forEach(({ _id, totalItems }) => {
                monthlySales[_id.month] = (monthlySales[_id.month] || 0) + totalItems;
            });

            SALES_MONTHS.forEach((month) => {
                if (monthlySales[month.x]) {
                    month.y = monthlySales[month.x];
                }
            });

            const yearlySales = {};
            yearlyData.salesData.forEach(({ _id, totalItems }) => {
                yearlySales[_id.year] = (yearlySales[_id.year] || 0) + totalItems;
            });

            const yearlySalesArray = Object.entries(yearlySales).map(([x, y]) => ({ x, y })).sort((a, b) => a.x.localeCompare(b.x));


            // Sort revenueData.daily by date
            monthlyData.revenueData.sort((a, b) => a._id.day.localeCompare(b._id.day));
            yearlyData.revenueData.sort((a, b) => a._id.day.localeCompare(b._id.day));

            // Populate revenueData.monthly and revenueData.yearly
            const REVENUE_MONTHS = [
                { x: "Jan", y: 0 },
                { x: "Feb", y: 0 },
                { x: "Mar", y: 0 },
                { x: "Apr", y: 0 },
                { x: "May", y: 0 },
                { x: "Jun", y: 0 },
                { x: "Jul", y: 0 },
                { x: "Aug", y: 0 },
                { x: "Sep", y: 0 },
                { x: "Oct", y: 0 },
                { x: "Nov", y: 0 },
                { x: "Dec", y: 0 },
            ];

            const monthlyRevenue = {};
            yearlyData.revenueData.forEach(({ _id, totalRevenue }) => {
                monthlyRevenue[_id.month] = (monthlyRevenue[_id.month] || 0) + totalRevenue;
            });

            REVENUE_MONTHS.forEach((month) => {
                if (monthlyRevenue[month.x]) {
                    month.y = monthlyRevenue[month.x];
                }
            });

            const yearlyRevenue = {};
            yearlyData.revenueData.forEach(({ _id, totalRevenue }) => {
                yearlyRevenue[_id.year] = (yearlyRevenue[_id.year] || 0) + totalRevenue;
            });

            const yearlyRevenueArray = Object.entries(yearlyRevenue).map(([x, y]) => ({ x, y })).sort((a, b) => a.x.localeCompare(b.x));

            analytics[storeKey] = {
                orderStatus: {
                    currentMonth: monthlyData.orderStatus.map(item => ({
                        id: item._id,
                        value: item.count,
                        label: order_status[item._id].value,
                        color: order_status[item._id].color,
                    })),
                    currentYear: yearlyData.orderStatus.map(item => ({
                        id: item._id,
                        value: item.count,
                        label: order_status[item._id].value,
                        color: order_status[item._id].color,
                    })),
                    allYears: allTimeData.orderStatus.map(item => ({
                        id: item._id,
                        value: item.count,
                        label: order_status[item._id].value,
                        color: order_status[item._id].color,
                    })),
                },
                salesData: {
                    daily: monthlyData.salesData.map(item => ({ x: item._id.day, y: item.totalItems })),
                    monthly: SALES_MONTHS,
                    yearly: yearlySalesArray,
                },
                revenueData: {
                    daily: monthlyData.revenueData.map(item => ({ x: item._id.day, y: item.totalRevenue })),
                    monthly: REVENUE_MONTHS,
                    yearly: yearlyRevenueArray,
                },
                ordersByCity: {
                    currentMonth: monthlyData.ordersByCity.map(item => ({ x: item._id, y: item.count })),
                    currentYear: yearlyData.ordersByCity.map(item => ({ x: item._id, y: item.count })),
                    allYears: allTimeData.ordersByCity.map(item => ({ x: item._id, y: item.count })),
                },
                salesReport: {
                    currentYear: calculateSums(yearlyData.rawOrders, null).totalSales,
                    allYears: calculateSums(allTimeData.rawOrders, null).totalSales,
                    currentYearDelivered: calculateSums(yearlyData.rawOrders, "delivered").totalSales,
                    allYearsDelivered: calculateSums(allTimeData.rawOrders, "delivered").totalSales,
                    currentYearUndelivered: calculateSums(yearlyData.rawOrders, "undelivered").totalSales,
                    allYearsUndelivered: calculateSums(allTimeData.rawOrders, "undelivered").totalSales,
                },
                revenueReport: {
                    currentYear: calculateSums(yearlyData.rawOrders, null).totalRevenue,
                    allYears: calculateSums(allTimeData.rawOrders, null).totalRevenue,
                    currentYearDelivered: calculateSums(yearlyData.rawOrders, "delivered").totalRevenue,
                    allYearsDelivered: calculateSums(allTimeData.rawOrders, "delivered").totalRevenue,
                    currentYearUndelivered: calculateSums(yearlyData.rawOrders, "undelivered").totalRevenue,
                    allYearsUndelivered: calculateSums(allTimeData.rawOrders, "undelivered").totalRevenue,
                },
                netRevenueReport: {
                    currentYear: calculateSums(yearlyData.rawOrders, null).totalNetRevenue,
                    allYears: calculateSums(allTimeData.rawOrders, null).totalNetRevenue,
                    currentYearDelivered: calculateSums(yearlyData.rawOrders, "delivered").totalNetRevenue,
                    allYearsDelivered: calculateSums(allTimeData.rawOrders, "delivered").totalNetRevenue,
                    currentYearUndelivered: calculateSums(yearlyData.rawOrders, "undelivered").totalNetRevenue,
                    allYearsUndelivered: calculateSums(allTimeData.rawOrders, "undelivered").totalNetRevenue,
                },
                ordersReport: {
                    currentYear: yearlyData.totalOrdersCount?.[0]?.count || 0,
                    allYears: allTimeData.totalOrdersCount?.[0]?.count || 0,
                    currentYearDelivered: yearlyData.orderStatus.find(s => s._id === "delivered")?.count || 0,
                    allYearsDelivered: allTimeData.orderStatus.find(s => s._id === "delivered")?.count || 0,
                    currentYearUndelivered: yearlyData.totalOrdersCount?.[0]?.count - (yearlyData.orderStatus.find(s => s._id === "delivered")?.count || 0),
                    allYearsUndelivered: allTimeData.totalOrdersCount?.[0]?.count - (allTimeData.orderStatus.find(s => s._id === "delivered")?.count || 0),
                },
            };
        }

        return res.status(200).json(analytics);
    } catch (error) {
        console.error("Error fetching analytics:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}