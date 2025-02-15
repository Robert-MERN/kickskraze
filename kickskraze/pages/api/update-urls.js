import Products from "@/models/product_model";
import connect_mongo from "@/utils/functions/connect_mongo";

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    console.log("Connecting with DB");
    await connect_mongo();
    console.log("Successfully connected with DB");

    try {
        const products = await Products.find({});
        let totalMediaCount = 0;

        for (const product of products) {
            totalMediaCount += product.media.length;
        }

        res.status(200).json({ message: "Total media count retrieved successfully", totalMediaCount });
    } catch (error) {
        console.error("Count Error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}
