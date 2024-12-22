// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
/**
 * 
 * @param {import('next').NextApiRequest} req 
 * @param {import('next').NextApiResponse} res 
 */

import { get_mongo_sort_object } from '@/utils/functions/filter_function';


export default async function handler(req, res) {


  try {
    // Extract query parameters
    const { size, condition, brand, price, sort_by } = req.query;

    // Initialize a query object
    const query = {};
    let sort = { createdAt: -1 };

    // Handle 'size' filter (ensure numbers)
    if (size) {
      query.size = { $in: Array.isArray(size) ? size.map(Number) : [Number(size)] };
    }

    // Handle 'condition' filter
    if (condition) {
      query.condition = { $in: Array.isArray(condition) ? condition : [condition] };
    }

    // Handle 'brand' filter
    if (brand) {
      query.brand = { $in: Array.isArray(brand) ? brand : [brand] };
    }

    // Handle 'price' filter (optional range logic)
    if (price) {
      const [min, max] = price.split("-").map(Number);
      if (!isNaN(min) && !isNaN(max)) {
        query.price = { $gte: min, $lte: max }; // Filter by price range
      }
    }

    // Handle 'price' filter (optional range logic)
    if (sort_by) {
      sort = get_mongo_sort_object(sort_by);
    }

    return res.status(200).json(query);

  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}
