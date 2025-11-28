import Products from '@/models/product_model';
import connect_mongo from '@/utils/functions/connect_mongo';

/**
 * 
 * @param {import('next').NextApiRequest} req 
 * @param {import('next').NextApiResponse} res 
 */

export default async function handler(req, res) {

    console.log("Connecting with DB")
    try {

        // connecting with monogDB
        await connect_mongo();
        console.log("Successfuly conneted with DB");


        // Getting filter value with pipeline
        const filter_values = await Products.aggregate([
            {
                $match: { isDeleted: false }
            },

            // Normalize size field → always convert to array
            {
                $addFields: {
                    size: {
                        $cond: [
                            { $isArray: "$size" },
                            "$size",
                            ["$size"] // convert single value → array
                        ]
                    }
                }
            },

            // Normalize color field
            {
                $addFields: {
                    color: {
                        $cond: [
                            { $isArray: "$color" },
                            "$color",
                            ["$color"]
                        ]
                    }
                }
            },

            // Unwind them so no nested arrays happen
            { $unwind: "$size" },
            { $unwind: "$color" },

            {
                $group: {
                    _id: null,
                    sizes: { $addToSet: "$size" },
                    colors: { $addToSet: "$color" },
                    brands: { $addToSet: "$brand" },
                    conditions: { $addToSet: "$condition" },
                    store_names: {
                        $addToSet: {
                            $cond: [
                                { $in: ["$store_name", ["Areeba-sandals", "SM-sandals"]] },
                                "$type",
                                "$store_name"
                            ]
                        }
                    },
                    price_lte: { $max: "$price" }
                }
            },

            {
                $project: {
                    sizes: 1,
                    colors: 1,
                    brands: 1,
                    conditions: 1,
                    store_names: 1,
                    price_gte: { $literal: 0 },
                    price_lte: 1,
                    sort_by: "created-descending",
                    _id: 0
                }
            },

            {
                $addFields: {
                    sizes: { $sortArray: { input: "$sizes", sortBy: 1 } },
                    colors: { $sortArray: { input: "$colors", sortBy: 1 } },
                    brands: { $sortArray: { input: "$brands", sortBy: 1 } }
                }
            }
        ]);


        // sending success response to client
        return res.status(200).json(filter_values[0]);

    } catch (err) {

        // if server catches any error
        return res.status(501).json({ success: false, message: err.message });
    }

}









// import Products from '@/models/product_model';
// import connect_mongo from '@/utils/functions/connect_mongo';

// /**
//  * 
//  * @param {import('next').NextApiRequest} req 
//  * @param {import('next').NextApiResponse} res 
//  */

// export default async function handler(req, res) {
//   console.log("Connecting with DB");
//   try {
//     await connect_mongo();
//     console.log("Successfully connected with DB");

//     const { store_name } = req.query;

//     // Build the base match query
//     const matchQuery = { isDeleted: false };
//     if (store_name) {
//       matchQuery.store_name = store_name.charAt(0).toUpperCase() + store_name.slice(1);
//     }

//     // Aggregate pipeline
//     const result = await Products.aggregate([
//       { $match: matchQuery },
//       {
//         $group: {
//           _id: null,
//           sizes: { $addToSet: "$size" },
//           brands: { $addToSet: "$brand" },
//           conditions: { $addToSet: "$condition" },
//           price_lte: { $max: "$price" },
//         },
//       },
//       {
//         $project: {
//           sizes: 1,
//           brands: 1,
//           conditions: 1,
//           price_gte: { $literal: 0 },
//           price_lte: 1,
//           sort_by: "created-descending",
//           _id: 0,
//         },
//       },
//     ]);

//     if (!result.length) {
//       return res.status(200).json({});
//     }

//     const filters = result[0];

//     // ---- Sorting logic ----
//     if (store_name === "Apparel") {
//       // Sort alphabetically by order (S > M > L > XL > XXL)
//       const sizeOrder = ["XS", "S", "M", "L", "XL", "XXL", "3XL"];
//       filters.sizes = (filters.sizes || [])
//         .flat() // Handle array-of-arrays
//         .filter(Boolean)
//         .sort((a, b) => sizeOrder.indexOf(a) - sizeOrder.indexOf(b))
//         .filter(s => sizeOrder.includes(s));
//     } else {
//       // Sort numerically for Barefoot, Kickskraze, Jewelry
//       filters.sizes = (filters.sizes || [])
//         .flat()
//         .filter(s => !isNaN(s))
//         .sort((a, b) => a - b);
//     }

//     // Remove empty or invalid fields
//     for (const key of ["brands", "conditions", "sizes"]) {
//       if (!filters[key] || !filters[key].length || filters[key].every(v => !v)) {
//         delete filters[key];
//       }
//     }

//     return res.status(200).json(filters);
//   } catch (err) {
//     console.error(err);
//     return res.status(501).json({ success: false, message: err.message });
//   }
// }
