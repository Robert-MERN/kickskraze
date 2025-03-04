import Orders from "@/models/order_model";
import connect_mongo from "@/utils/functions/connect_mongo";
import { DateTime } from "luxon";

const order_status = {
    booked: { value: "Booked", color: "#60a5fa" }, // text-blue
    in_transit: { value: "In Transit", color: "#d946ef" }, // text-fuchsia
    delivered: { value: "Delivered", color: "#5be49b" }, // text-green
    rcp: { value: "RCP", color: "#FFC107" }, // text-amber-500
    returned: { value: "Returned", color: "#ef4444" }, // text-red-500
}





export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ message: "Method not allowed" });
    }
    console.log("Connecting with DB");
    try {
        // Connect to MongoDB
        await connect_mongo();
        console.log("Successfully connected with DB");

        const stores = ["Barefoot", "Kickskraze", "Barefoot & Kickskraze"];

        const timezone = "Asia/Karachi"; // Time Zone
        const defaultTime = { hour: 5, minute: 0, second: 0, millisecond: 0 }
        const currentYear = DateTime.now().setZone(timezone).year; // Year
        const currentMonth = DateTime.now().setZone(timezone).month; // Month
        const firstDayOfMonth = DateTime.now().setZone(timezone).set({ year: currentYear, month: currentMonth, day: 1, ...defaultTime }).toJSDate();
        const firstDayOfYear = DateTime.now().setZone(timezone).set({ year: currentYear, month: 1, day: 1, ...defaultTime }).toJSDate();


        // Function to get order status aggregation per store
        const getOrderStatusAggregation = async (storeName, fromDate) => {
            // Aggregation for current month
            const orderStatusAggregation = await Orders.aggregate([
                { $match: storeName ? { store_name: storeName, createdAt: { $gte: fromDate } } : { createdAt: { $gte: fromDate } } },
                {
                    $group: {
                        _id: "$status",
                        count: { $sum: 1 }
                    }
                }
            ]);

            return orderStatusAggregation.map(item => ({ id: item._id, value: item.count, label: order_status[item._id].value, color: order_status[item._id].color, }));

        };

        // Function to get sales aggregation per store
        const getSalesAggregation = async (storeName, fromDate) => {
            return await Orders.aggregate([
                { $match: storeName ? { store_name: storeName, createdAt: { $gte: fromDate } } : { createdAt: { $gte: fromDate } } },
                { $unwind: "$purchase" },
                {
                    $group: {
                        _id: {
                            day: { $dateToString: { format: "%d-%b", date: "$createdAt" } },
                            month: { $dateToString: { format: "%b", date: "$createdAt" } },
                            year: { $dateToString: { format: "%Y", date: "$createdAt" } }
                        },
                        totalItems: { $sum: "$purchase.quantity" }
                    }
                }
            ]);
        };


        // Function to get revenue aggregation per store
        const getRevenueAggregation = async (storeName, fromDate) => {
            return await Orders.aggregate([
                { $match: storeName ? { store_name: storeName, status: { $ne: "returned" }, createdAt: { $gte: fromDate } } : { status: { $ne: "returned" }, createdAt: { $gte: fromDate } } },
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
                { $unwind: { path: "$productDetails", preserveNullAndEmptyArrays: true } },
                {
                    $group: {
                        _id: {
                            day: { $dateToString: { format: "%d-%b", date: "$createdAt" } },
                            month: { $dateToString: { format: "%b", date: "$createdAt" } },
                            year: { $dateToString: { format: "%Y", date: "$createdAt" } }
                        },
                        totalRevenue: {
                            $sum: {
                                $multiply: [
                                    { $ifNull: ["$productDetails.price", 0] },
                                    "$purchase.quantity"
                                ]
                            }
                        },
                        deliveryCharges: { $sum: "$delivery_charges" }
                    }
                },
                {
                    $group: {
                        _id: {
                            day: "$_id.day",
                            month: "$_id.month",
                            year: "$_id.year"
                        },
                        totalRevenue: { $sum: { $add: ["$totalRevenue", "$deliveryCharges"] } }
                    }
                }
            ]);
        };

        // Function to get orders by cities aggregation per store
        const getOrderByCitiesAggregation = async (storeName, fromDate) => {
            // Aggregation for current month
            const orderByCitiesAggregation = await Orders.aggregate([
                { $match: storeName ? { store_name: storeName, createdAt: { $gte: fromDate } } : { createdAt: { $gte: fromDate } } },
                {
                    $group: {
                        _id: "$city",
                        count: { $sum: 1 }
                    }
                }
            ]);

            return orderByCitiesAggregation.map(({ _id, count }) => ({ x: _id, y: count }));

        };


        // Get Total Order Numbers Report
        const getTotalOrdersSum = async (storeName, fromDate, statusArg) => {


            let matchCondition = { createdAt: { $gte: fromDate } };

            if (storeName) {
                matchCondition.store_name = storeName;
            }

            if (statusArg === "delivered") {
                matchCondition.status = "delivered";
            } else if (statusArg === "undelivered") {
                matchCondition.status = { $ne: "delivered" };
            }


            const result = await Orders.aggregate([
                { $match: matchCondition },
                { $count: "totalOrders" }
            ]);

            return result.length > 0 ? result[0].totalOrders : 0;
        };

        // Get Sale Report
        const getSalesSum = async (storeName, fromDate, statusArg) => {


            let status = { $ne: "returned" } // Default

            if (statusArg === "delivered") {
                status = "delivered"
            } else if (statusArg === "undelivered") {
                status = { $nin: ["returned", "delivered"] };
            }

            const result = await Orders.aggregate([
                { $match: storeName ? { store_name: storeName, status, createdAt: { $gte: fromDate } } : { status, createdAt: { $gte: fromDate } } },
                { $unwind: "$purchase" },
                { $group: { _id: null, totalSales: { $sum: "$purchase.quantity" } } }
            ]);
            return result.length > 0 ? result[0].totalSales : 0;
        };


        // Get Gross Revenue Report
        const getRevenueSum = async (storeName, fromDate, statusArg) => {

            let status = { $ne: "returned" } // Default

            if (statusArg === "delivered") {
                status = "delivered"
            } else if (statusArg === "undelivered") {
                status = { $nin: ["returned", "delivered"] };
            }


            const result = await Orders.aggregate([
                { $match: storeName ? { store_name: storeName, status, createdAt: { $gte: fromDate } } : { status, createdAt: { $gte: fromDate } } },
                { $unwind: "$purchase" },
                {
                    $lookup: {
                        from: "products",
                        let: { productId: { $toObjectId: "$purchase._id" } },
                        pipeline: [{ $match: { $expr: { $eq: ["$_id", "$$productId"] } } }],
                        as: "productDetails"
                    }
                },
                { $unwind: { path: "$productDetails", preserveNullAndEmptyArrays: true } },
                {
                    $group: {
                        _id: null,
                        totalRevenue: {
                            $sum: {
                                $multiply: [
                                    { $ifNull: ["$productDetails.price", 0] },
                                    "$purchase.quantity"
                                ]
                            }
                        },
                        deliveryCharges: { $sum: "$delivery_charges" }
                    }
                },
                {
                    $project: {
                        totalRevenue: { $add: ["$totalRevenue", "$deliveryCharges"] }
                    }
                }
            ]);
            return result.length > 0 ? result[0].totalRevenue : 0;
        };


        // Get Net Revenue Report
        const getNetRevenueSum = async (storeName, fromDate, statusArg) => {

            let status = { $ne: "returned" } // Default

            if (statusArg === "delivered") {
                status = "delivered"
            } else if (statusArg === "undelivered") {
                status = { $nin: ["returned", "delivered"] };
            }

            const result = await Orders.aggregate([
                { $match: storeName ? { store_name: storeName, status, createdAt: { $gte: fromDate } } : { status, createdAt: { $gte: fromDate } } },
                { $unwind: "$purchase" },
                {
                    $lookup: {
                        from: "products",
                        let: { productId: { $toObjectId: "$purchase._id" } },
                        pipeline: [{ $match: { $expr: { $eq: ["$_id", "$$productId"] } } }],
                        as: "productDetails"
                    }
                },
                { $unwind: { path: "$productDetails", preserveNullAndEmptyArrays: true } },
                {
                    $group: {
                        _id: null,
                        totalNetRevenue: {
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
                        },
                    }
                },
            ]);
            return result.length > 0 ? result[0].totalNetRevenue : 0;
        };




        const analytics = {};

        // Fetch analytics for each store and total
        for (const store of [null, ...stores]) {
            const storeKey = store || "Total";

            const salesAggregationDaily = await getSalesAggregation(store, firstDayOfMonth);
            const salesAggregation = await getSalesAggregation(store, firstDayOfYear);
            const revenueAggregationDaily = await getRevenueAggregation(store, firstDayOfMonth);
            const revenueAggregation = await getRevenueAggregation(store, firstDayOfYear);


            analytics[storeKey] = {
                orderStatus: {
                    currentMonth: await getOrderStatusAggregation(store, firstDayOfMonth),
                    currentYear: await getOrderStatusAggregation(store, firstDayOfYear),
                    allYears: await getOrderStatusAggregation(store, new Date(0)),
                },
                salesData: {
                    daily: [],
                    monthly: {},
                    yearly: {}
                },
                revenueData: {
                    daily: [],
                    monthly: {},
                    yearly: {}
                },
                ordersByCity: {
                    currentMonth: await getOrderByCitiesAggregation(store, firstDayOfMonth),
                    currentYear: await getOrderByCitiesAggregation(store, firstDayOfYear),
                    allYears: await getOrderByCitiesAggregation(store, new Date(0)),
                },
                salesReport: {
                    currentYear: await getSalesSum(store, firstDayOfYear),
                    allYears: await getSalesSum(store, new Date(0)),
                    currentYearDelivered: await getSalesSum(store, firstDayOfYear, "delivered"),
                    allYearsDelivered: await getSalesSum(store, new Date(0), "delivered"),
                    currentYearUndelivered: await getSalesSum(store, firstDayOfYear, "undelivered"),
                    allYearsUndelivered: await getSalesSum(store, new Date(0), "undelivered"),
                },
                revenueReport: {
                    currentYear: await getRevenueSum(store, firstDayOfYear),
                    allYears: await getRevenueSum(store, new Date(0)),
                    currentYearDelivered: await getRevenueSum(store, firstDayOfYear, "delivered"),
                    allYearsDelivered: await getRevenueSum(store, new Date(0), "delivered"),
                    currentYearUndelivered: await getRevenueSum(store, firstDayOfYear, "undelivered"),
                    allYearsUndelivered: await getRevenueSum(store, new Date(0), "undelivered"),
                },
                netRevenueReport: {
                    currentYear: await getNetRevenueSum(store, firstDayOfYear),
                    allYears: await getNetRevenueSum(store, new Date(0)),
                    currentYearDelivered: await getNetRevenueSum(store, firstDayOfYear, "delivered"),
                    allYearsDelivered: await getNetRevenueSum(store, new Date(0), "delivered"),
                    currentYearUndelivered: await getNetRevenueSum(store, firstDayOfYear, "undelivered"),
                    allYearsUndelivered: await getNetRevenueSum(store, new Date(0), "undelivered"),
                },
                ordersReport: {
                    currentYear: await getTotalOrdersSum(store, firstDayOfYear),
                    allYears: await getTotalOrdersSum(store, new Date(0)),
                    currentYearDelivered: await getTotalOrdersSum(store, firstDayOfYear, "delivered"),
                    allYearsDelivered: await getTotalOrdersSum(store, new Date(0), "delivered"),
                    currentYearUndelivered: await getTotalOrdersSum(store, firstDayOfYear, "undelivered"),
                    allYearsUndelivered: await getTotalOrdersSum(store, new Date(0), "undelivered"),
                },
            };


            // Constructing Sales Data according to MUI Charts
            salesAggregationDaily.forEach(({ _id, totalItems }) => {
                analytics[storeKey].salesData.daily.push({ x: _id.day, y: totalItems });
            });
            salesAggregation.forEach(({ _id, totalItems }) => {
                analytics[storeKey].salesData.monthly[_id.month] = (analytics[storeKey].salesData.monthly[_id.month] || 0) + totalItems;
                analytics[storeKey].salesData.yearly[_id.year] = (analytics[storeKey].salesData.yearly[_id.year] || 0) + totalItems;
            });


            // Sorting Sales Daily
            analytics[storeKey].salesData.daily.sort((a, b) => a.x.localeCompare(b.x));

            // Sorting Sales Monthly
            const SALES_MONTHS = [
                {
                    "x": "Jan",
                    "y": 0
                },
                {
                    "x": "Feb",
                    "y": 0
                },
                {
                    "x": "Mar",
                    "y": 0
                },
                {
                    "x": "Apr",
                    "y": 0
                },
                {
                    "x": "May",
                    "y": 0
                },
                {
                    "x": "Jun",
                    "y": 0
                },
                {
                    "x": "Jul",
                    "y": 0
                },
                {
                    "x": "Aug",
                    "y": 0
                },
                {
                    "x": "Sep",
                    "y": 0
                },
                {
                    "x": "Oct",
                    "y": 0
                },
                {
                    "x": "Nov",
                    "y": 0
                },
                {
                    "x": "Dec",
                    "y": 0
                },
            ];
            analytics[storeKey].salesData.monthly = Object.entries(analytics[storeKey].salesData.monthly).map(([x, y]) => ({ x, y }));
            analytics[storeKey].salesData.monthly.forEach(({ x, y }) => {
                const monthIndex = SALES_MONTHS.findIndex(m => m.x === x);
                if (monthIndex !== -1) SALES_MONTHS.splice(monthIndex, 1, { x, y });
            });
            analytics[storeKey].salesData.monthly = SALES_MONTHS;

            // Sorting Sales Yearly
            analytics[storeKey].salesData.yearly = Object.entries(analytics[storeKey].salesData.yearly).map(([x, y]) => ({ x, y })).sort((a, b) => a.x.localeCompare(b.x));





            // Constructing Revenue Data according to MUI Charts
            revenueAggregationDaily.forEach(({ _id, totalRevenue }) => {
                analytics[storeKey].revenueData.daily.push({ x: _id.day, y: totalRevenue });
            })
            revenueAggregation.forEach(({ _id, totalRevenue }) => {
                analytics[storeKey].revenueData.monthly[_id.month] = (analytics[storeKey].revenueData.monthly[_id.month] || 0) + totalRevenue;
                analytics[storeKey].revenueData.yearly[_id.year] = (analytics[storeKey].revenueData.yearly[_id.year] || 0) + totalRevenue;
            });


            // Sorting Revenue Daily
            analytics[storeKey].revenueData.daily.sort((a, b) => a.x.localeCompare(b.x));

            // Sorting Revenue Monthly
            const REVENUE_MONTHS = [
                {
                    "x": "Jan",
                    "y": 0
                },
                {
                    "x": "Feb",
                    "y": 0
                },
                {
                    "x": "Mar",
                    "y": 0
                },
                {
                    "x": "Apr",
                    "y": 0
                },
                {
                    "x": "May",
                    "y": 0
                },
                {
                    "x": "Jun",
                    "y": 0
                },
                {
                    "x": "Jul",
                    "y": 0
                },
                {
                    "x": "Aug",
                    "y": 0
                },
                {
                    "x": "Sep",
                    "y": 0
                },
                {
                    "x": "Oct",
                    "y": 0
                },
                {
                    "x": "Nov",
                    "y": 0
                },
                {
                    "x": "Dec",
                    "y": 0
                },
            ];
            analytics[storeKey].revenueData.monthly = Object.entries(analytics[storeKey].revenueData.monthly).map(([x, y]) => ({ x, y }));
            analytics[storeKey].revenueData.monthly.forEach(({ x, y }) => {
                const monthIndex = REVENUE_MONTHS.findIndex(m => m.x === x);
                if (monthIndex !== -1) REVENUE_MONTHS.splice(monthIndex, 1, { x, y });
            });
            analytics[storeKey].revenueData.monthly = REVENUE_MONTHS;

            // Sorting Revenue Yearly
            analytics[storeKey].revenueData.yearly = Object.entries(analytics[storeKey].revenueData.yearly).map(([x, y]) => ({ x, y })).sort((a, b) => a.x.localeCompare(b.x));
        }

        return res.status(200).json(analytics);
    } catch (error) {
        console.error("Error fetching analytics:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}