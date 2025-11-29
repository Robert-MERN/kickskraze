import path from "path";
import fs from "fs";

export default function handler(req, res) {
    const { file } = req.query;
    const filePath = path.join(process.cwd(), "public/catalog_products", file);

    if (!fs.existsSync(filePath)) {
        return res.status(404).send("File not found");
    }

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename="${file}"`);
    fs.createReadStream(filePath).pipe(res);
}
