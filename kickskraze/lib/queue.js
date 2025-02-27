import { Queue, Worker } from "bullmq";
import Redis from "ioredis";
import fs from "fs-extra";
import { pipeline } from "stream/promises";
import * as fastCsv from "fast-csv";
import Products from "@/models/product_model"; // Import your Mongoose model
import { select_thumbnail_from_media } from "@/utils/functions/produc_fn";
import path from "path";

// ✅ Ensure Redis is properly configured
const redisConnection = new Redis({
    host: "127.0.0.1", // or your Redis host
    port: 6379,
    maxRetriesPerRequest: null, // ✅ Required for BullMQ
});

// ✅ Properly create the queue
export const csvQueue = new Queue("csvQueue", { connection: redisConnection });

// ✅ Create a worker
new Worker(
    "csvQueue",
    async () => {
        console.log("Generating CSV...");
        await generateCSV();
    },
    { connection: redisConnection }
);

const fb_product_category = {
    unisex: "clothing & accessories > shoes & footwear",
    men: "clothing & accessories > shoes & footwear > men's shoes",
    women: "clothing & accessories > shoes & footwear > women's shoes",
    kids: "clothing & accessories > shoes & footwear > kids' shoes",
};

const gender = {
    men: "male",
    women: "female",
    unisex: "unisex",
    kids: "unisex",
};

async function generateCSV() {
    try {
        const products = await Products.find({ isDeleted: false }).sort({ createdAt: -1 }); // Fetch all products

        // Define directory and file path
        const dirPath = path.join(process.cwd(), "public/catalog_products");
        const filePath = path.join(dirPath, "products.csv");

        // Ensure directory exists
        fs.ensureDirSync(dirPath);

        const ws = fs.createWriteStream(filePath);
        const csvStream = fastCsv.format({ headers: true });

        csvStream.pipe(ws);
        products.forEach((item) => {
            const product = {
                id: item._id,
                title: item.title,
                description: item.shoes_desc || "All products are guaranteed to be 100% authentic and genuine and not a fake, first copy, or replica.",
                availability: item.stock ? "in stock" : "out of stock",
                condition: item.condition === "premium +" ? "new" : "used",
                price: `${item.price.toFixed(2)} PKR`,
                link: `https://kickskraze.shop/product?product_id=${item._id}`,
                image_link: select_thumbnail_from_media(item.media),
                brand: item.brand,
                google_product_category: "Apparel & Accessories > Shoes",
                fb_product_category: fb_product_category[item.category] || "",
                quantity_to_sell_on_facebook: item.stock,
                gender: gender[item.category] || "unisex",
                age_group: item.category === "kids" ? "kids" : "all ages",
            };
            csvStream.write(product);
        });
        csvStream.end();

        return new Promise((resolve, reject) => {
            ws.on("finish", () => {
                console.log("CSV updated successfully at:", filePath);
                resolve();
            });
            ws.on("error", (err) => {
                console.error("Error writing CSV:", err);
                reject(err);
            });
        });
    } catch (error) {
        console.error("Error in generateCSV:", error);
    }
}