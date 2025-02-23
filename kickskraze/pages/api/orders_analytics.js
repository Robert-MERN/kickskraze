import Orders from "@/models/order_model";
import connect_mongo from "@/utils/functions/connect_mongo";


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
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth(); // Get current month (0-11)
        const firstDayOfMonth = new Date(currentYear, currentMonth, 1); // First day of current month
        const firstDayOfYear = new Date(`${currentYear}-01-01`);

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
        const getSalesAggregation = async (storeName) => {
            return await Orders.aggregate([
                { $match: storeName ? { store_name: storeName, createdAt: { $gte: firstDayOfMonth } } : { createdAt: { $gte: firstDayOfMonth } } },
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
        const getRevenueAggregation = async (storeName) => {
            return await Orders.aggregate([
                { $match: storeName ? { store_name: storeName, createdAt: { $gte: firstDayOfYear } } : { createdAt: { $gte: firstDayOfYear } } },
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


        // Get Total Order Numbers
        const getTotalOrdersSum = async (storeName, fromDate) => {
            const result = await Orders.aggregate([
                {
                    $match: storeName ? { store_name: storeName, createdAt: { $gte: fromDate } } : { createdAt: { $gte: fromDate } }
                },
                {
                    $count: "totalOrders"
                }
            ]);

            return result.length > 0 ? result[0].totalOrders : 0;
        };

        // Get Sale Report
        const getSalesSum = async (storeName, fromDate) => {
            const result = await Orders.aggregate([
                { $match: storeName ? { store_name: storeName, createdAt: { $gte: fromDate } } : { createdAt: { $gte: fromDate } } },
                { $unwind: "$purchase" },
                { $group: { _id: null, totalSales: { $sum: "$purchase.quantity" } } }
            ]);
            return result.length > 0 ? result[0].totalSales : 0;
        };


        // Get Gross Revenue Report
        const getRevenueSum = async (storeName, fromDate) => {
            const result = await Orders.aggregate([
                { $match: storeName ? { store_name: storeName, createdAt: { $gte: fromDate } } : { createdAt: { $gte: fromDate } } },
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
        const getNetRevenueSum = async (storeName, fromDate) => {
            const result = await Orders.aggregate([
                { $match: storeName ? { store_name: storeName, createdAt: { $gte: fromDate } } : { createdAt: { $gte: fromDate } } },
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


            const salesAggregation = await getSalesAggregation(store);
            const revenueAggregation = await getRevenueAggregation(store);


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
                salesReport: {
                    currentYear: await getSalesSum(store, firstDayOfYear),
                    allYears: await getSalesSum(store, new Date(0))
                },
                revenueReport: {
                    currentYear: await getRevenueSum(store, firstDayOfYear),
                    allYears: await getRevenueSum(store, new Date(0))
                },
                netRevenueReport: {
                    currentYear: await getNetRevenueSum(store, firstDayOfYear),
                    allYears: await getNetRevenueSum(store, new Date(0))
                },
                ordersReport: {
                    currentYear: await getTotalOrdersSum(store, firstDayOfYear),
                    allYears: await getTotalOrdersSum(store, new Date(0))
                }

            };

            salesAggregation.forEach(({ _id, totalItems }) => {
                analytics[storeKey].salesData.daily.push({ x: _id.day, y: totalItems });
                analytics[storeKey].salesData.monthly[_id.month] = (analytics[storeKey].salesData.monthly[_id.month] || 0) + totalItems;
                analytics[storeKey].salesData.yearly[_id.year] = (analytics[storeKey].salesData.yearly[_id.year] || 0) + totalItems;
            });

            analytics[storeKey].salesData.daily.sort((a, b) => a.x.localeCompare(b.x));
            analytics[storeKey].salesData.monthly = Object.entries(analytics[storeKey].salesData.monthly).map(([x, y]) => ({ x, y })).sort((a, b) => a.x.localeCompare(b.x));
            analytics[storeKey].salesData.yearly = Object.entries(analytics[storeKey].salesData.yearly).map(([x, y]) => ({ x, y })).sort((a, b) => a.x.localeCompare(b.x));

            revenueAggregation.forEach(({ _id, totalRevenue }) => {
                analytics[storeKey].revenueData.daily.push({ x: _id.day, y: totalRevenue });
                analytics[storeKey].revenueData.monthly[_id.month] = (analytics[storeKey].revenueData.monthly[_id.month] || 0) + totalRevenue;
                analytics[storeKey].revenueData.yearly[_id.year] = (analytics[storeKey].revenueData.yearly[_id.year] || 0) + totalRevenue;
            });

            analytics[storeKey].revenueData.daily.sort((a, b) => a.x.localeCompare(b.x));
            analytics[storeKey].revenueData.monthly = Object.entries(analytics[storeKey].revenueData.monthly).map(([x, y]) => ({ x, y })).sort((a, b) => a.x.localeCompare(b.x));
            analytics[storeKey].revenueData.yearly = Object.entries(analytics[storeKey].revenueData.yearly).map(([x, y]) => ({ x, y })).sort((a, b) => a.x.localeCompare(b.x));
        }

        return res.status(200).json(analytics);
    } catch (error) {
        console.error("Error fetching analytics:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}