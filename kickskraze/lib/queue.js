import { Queue, Worker } from "bullmq";
import Redis from "ioredis";
import fs from "fs-extra";
import * as fastCsv from "fast-csv";
import Products from "@/models/product_model";
import { select_thumbnail_from_media, generateSKU, generateGTIN, generateMPN } from "@/utils/functions/produc_fn";
import path from "path";
import { getFacebookCategory, getGoogleCategory } from "@/utils/product_info_list";

const redisConnection = new Redis({ host: "127.0.0.1", port: 6379, db: 0, maxRetriesPerRequest: null });

export const csvQueue = new Queue("csvQueue", { connection: redisConnection });
export const newsletterQueue = new Queue("newsletterQueue", { connection: redisConnection });

new Worker("csvQueue", async (job) => job.name === "updateCSV" && generateCSV(), { connection: redisConnection });
new Worker("newsletterQueue", async (job) => job.name === "sendNewsletter" && console.log("Sending Newsletter…"), { connection: redisConnection });

/* ───────────────── ❤ HELPERS ───────────────── */

const genderMap = { unisex: "unisex", men: "male", women: "female", kids: "unisex", "kids-boys": "male", "kids-girls": "female" };
const storeNameFormat = s => String(s || "").replace(/[\s-]+/g, "_").toLowerCase();
const baseCondition = c => ["premium +", "brand new"].includes((c || "").toLowerCase()) ? "new" : "used";
const desc = p => p.shoes_desc || p.product_desc || "100% authentic original product — not replica, fake or first copy.";
const thumb = p => select_thumbnail_from_media(p.media);

/* 🔥 Shared field builder (base + variant both use this) */
const buildCommon = (p, price, stock, size, color, variantId = null) => ({
    id: variantId ? `${p._id}_${variantId}` : String(p._id),
    item_group_id: String(p._id),
    sku: generateSKU(p, variantId),
    gtin: generateGTIN(p, variantId),
    mpn: generateMPN(p, variantId),
    title: p.title,
    description: desc(p),
    availability: stock > 0 ? "in stock" : "out of stock",
    condition: baseCondition(p.condition),
    price: `${price.toFixed(2)} PKR`,
    link: `https://kicks-kraze.com/product?product_id=${p._id}`,
    image_link: thumb(p),
    brand: p.brand || "KIC",
    google_product_category: getGoogleCategory(p.store_name, p.type),
    fb_product_category: getFacebookCategory(p.store_name, p.category, p.type),
    quantity_to_sell_on_facebook: stock,
    gender: genderMap[p.category] || "unisex",
    age_group: p.category === "kids" ? "kids" : "all ages",
    color: Array.isArray(color) ? color.join(", ") : color || "",
    size: Array.isArray(size) ? size.join(", ") : size || "",
});

/* 🔥 Converts product → 1 row (no variants) or multiple rows (variants) */
const buildProductRows = p =>
    (p.has_variants && Array.isArray(p.variants) && p.variants.length)
        ? p.variants.map(v =>
            buildCommon(
                p,
                v.price || p.price,
                v.stock || 0,
                v.options?.size ?? p.size,
                v.options?.color ?? p.color,
                v.variant_id
            )
        )
        : [buildCommon(p, p.price, p.stock, p.size, p.color)];

/* 🔥 Universal CSV writer */
const writeCSV = async (filePath, products) => {
    const ws = fs.createWriteStream(filePath);
    const csv = fastCsv.format({ headers: true });
    csv.pipe(ws);
    products.forEach(p => buildProductRows(p).forEach(r => csv.write(r)));
    csv.end();
    return new Promise(res => ws.on("finish", res));
};

/* ───────────────── CSV MAIN ───────────────── */

async function generateCSV() {
    try {
        const products = await Products.find({ isDeleted: false }).sort({ createdAt: -1 });
        const dir = path.join(process.cwd(), "public/catalog_products");
        fs.ensureDirSync(dir);

        // 🔹 All CSVs currently in folder
        const existingFiles = fs.readdirSync(dir).filter(f => f.endsWith(".csv"));

        // 🔹 We will track which files SHOULD exist after this run
        const expectedFiles = new Set();
        expectedFiles.add("products.csv"); // global file is always expected

        // 🔥 STORES TO MERGE AS ONE → combined file = sandals_products.csv
        const MERGE_SANDALS = ["sm-sandals", "areeba-sandals"];

        const stores = [...new Set(products.map(p => p.store_name))].filter(Boolean);

        // 1️⃣ Global CSV
        await writeCSV(path.join(dir, "products.csv"), products);

        // 2️⃣ Store-wise + sandals merged
        let sandalsCollection = [];

        for (const store of stores) {
            const items = products.filter(p => p.store_name === store);
            if (!items.length) continue;

            const normalizedStore = store.toLowerCase();

            // 👉 Merged sandals group
            if (MERGE_SANDALS.includes(normalizedStore)) {
                sandalsCollection.push(...items);
                continue; // don't write individual SM/Areeba files
            }

            // 👉 Normal per-store file
            const fileName = `${storeNameFormat(store)}_products.csv`;
            expectedFiles.add(fileName);
            await writeCSV(path.join(dir, fileName), items);
        }

        // 3️⃣ Write merged SANDALS file if there are any sandals products
        if (sandalsCollection.length > 0) {
            const sandalsFile = "sandals_products.csv";
            expectedFiles.add(sandalsFile);
            await writeCSV(path.join(dir, sandalsFile), sandalsCollection);
        }

        // 4️⃣ Delete any CSV that is NOT expected anymore
        for (const file of existingFiles) {
            if (!expectedFiles.has(file)) {
                fs.unlinkSync(path.join(dir, file));
                console.log(`🗑 Removed stale CSV → ${file}`);
            }
        }

        console.log("✔ CSV rebuilt (global + per-store + merged sandals) & cleaned");

    } catch (e) {
        console.error("❌ CSV ERROR →", e);
    }
}

export { generateCSV };
