import Products from '@/models/product_model';
import connect_mongo from '@/utils/functions/connect_mongo';
import { get_mongo_sort_object } from '@/utils/functions/filter_function';


// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
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

    // Extract query parameters
    const { size, condition, brand, hide_brand, price_gte, price_lte, sort_by, featured, category, search, store_name, limit, page } = req.query;

    // Initialize a query object
    const query = { isDeleted: false };

    let sort = { createdAt: -1, };

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

    // Handle 'hide_brand' filter
    if (hide_brand && !query.brand) {
      query.brand = { $nin: Array.isArray(hide_brand) ? hide_brand : [hide_brand] };
    }


    // Handle 'price' filter (optional range logic)
    if (!isNaN(Number(price_gte)) && !isNaN(Number(price_lte))) {
      query.price = { $gte: price_gte, $lte: price_lte }; // Filter by price range
    }


    // Handle "Featured" filter
    if (featured === "true") {
      query.featured = true;
    }

    // Handle "Search" filter
    if (typeof search === "string") {
      if (search === "") {
        query.title = "";
      };
      if (search) {
        query.title = { $regex: search, $options: 'i' };
      }
    }

    if (store_name) {
      query.store_name = store_name.charAt(0).toUpperCase() + store_name.slice(1);
    }

    // Handle "Category" filter
    if (category) {
      // Ensure `category` is an array
      const categoryArray = Array.isArray(category) ? category : [category];

      // If "men" or "women" is present and "unisex" is not, add "unisex"
      if ((categoryArray.includes("men") || categoryArray.includes("women")) && !categoryArray.includes("unisex")) {
        categoryArray.push("unisex");
      }

      query.category = { $in: categoryArray };
    }

    // Handle sorting
    if (sort_by) {
      sort = get_mongo_sort_object(sort_by);
    }


    // Pagination logic
    const pageNumber = Number(page) || 1; // Default to page 1
    const pageSize = Number(limit) || 52; // Default to 50 items per page
    const skip = (pageNumber - 1) * pageSize;

    // Fetch total count of filtered documents
    const filteredCount = await Products.countDocuments(query); // Total count after filters

    // Step 1: Count total in-stock products
    const inStockCount = await Products.countDocuments({ ...query, stock: { $gt: 0 } });

    let products = [];

    if (skip < inStockCount) {
      // Step 2: Fetch in-stock products for the requested page
      products = await Products.find({ ...query, stock: { $gt: 0 } })
        .sort(sort)
        .skip(skip)
        .limit(pageSize)
        .lean();


      if (products.length < pageSize) {
        let _products = await Products.find({ ...query, stock: 0 })
          .sort(sort)
          .limit(pageSize - products.length)
          .lean();

        products = [...products, ..._products];
      }
    } else {
      // Step 3: Fetch sold-out products after in-stock pages are exhausted
      const soldOutSkip = skip - inStockCount; // Adjust skip for sold-out products
      const soldOutPageSize = pageSize - inStockCount; // Adjust PageSize for sold-out products
      products = await Products.find({ ...query, stock: 0 })
        .sort(sort)
        .skip(soldOutSkip)
        .limit(soldOutPageSize)
        .lean();
    }


    // Determine whether more items are available
    const hasMore = pageNumber * pageSize < filteredCount;


    return res.status(200).json({
      success: true,
      products,
      meta: {
        filteredCount, // Total count after filters are applied
        pageSize,
        currentPage: pageNumber,
        hasMore, // Whether there are more products to fetch
      },
    });

  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}