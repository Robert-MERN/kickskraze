import formidable from 'formidable';
import axios from 'axios';
import path from 'path';
import fs from 'fs/promises';
import { nanoid } from 'nanoid';
import ffmpeg from 'fluent-ffmpeg';
import fsSync from 'fs';
import sharp from 'sharp';
import { deleteFiles } from '@/utils/functions/delete_bunnycdn_files_fn';

// ffmpeg.setFfmpegPath("C:/Users/AL-RAHEEM TECH/Downloads/ffmpeg/ffmpeg/bin/ffmpeg.exe");
// ffmpeg.setFfmpegPath("C:/Users/muhammad talha/Downloads/ffmpeg/bin/ffmpeg.exe");
ffmpeg.setFfmpegPath("/usr/bin/ffmpeg");

const BUNNY_STORAGE_ZONE = process.env.BUNNY_STORAGE_ZONE;
const BUNNY_ACCESS_KEY = process.env.BUNNY_ACCESS_KEY;
const BUNNY_PULL_ZONE = "https://kickskraze.b-cdn.net/kickskraze";

const object_mapping = (obj) => {
    let _obj = {};
    const keys = Object.keys(obj)
    for (const key of keys) {
        if (key === "media") {
            _obj[key] = obj[key];
        } else if (key === "imageThumbnailFlags" || key === "videoThumbnailFlags") {
            // Do nothing
        } else {
            _obj[key] = obj[key][0];
        }
    }
    return _obj;
};

// 🔹 Helper to create a unique temp folder
const createTempFolder = (baseFolder) => {
    const uniqueDir = path.resolve(process.cwd(), baseFolder, nanoid(10));
    fsSync.mkdirSync(uniqueDir, { recursive: true });
    return uniqueDir;
};

// 🔹 Image Compression Function (Sharp)
const compressImage = async (inputPath, baseFolder) => {
    try {
        const tempDir = createTempFolder(baseFolder);
        const filename = `${nanoid(10)}.webp`;
        const outputPath = path.join(tempDir, filename);

        await sharp(inputPath)
            .rotate()
            .resize(800) // Resize to 800px width like Cloudinary w_800
            .webp({ quality: 80 }) // Convert to WebP with 80% quality (q_auto equivalent)
            .toFile(outputPath);

        return { outputPath, tempDir, filename };
    } catch (error) {
        console.error("❌ Image Compression Error:", error);
        throw new Error("Image compression failed");
    }
};

// 🔹 Video compression function using fluent-ffmpeg
const compressVideo = async (inputPath, baseFolder) => {
    const tempDir = createTempFolder(baseFolder);
    const filename = `${nanoid(10)}.mp4`;
    const outputPath = path.join(tempDir, filename);

    return new Promise((resolve, reject) => {
        ffmpeg(inputPath)
            .outputOptions([
                '-c:v libx264',       // Use H.264 codec
                '-preset superfast',  // Faster encoding
                '-crf 30',            // Slightly lower quality for speed
                '-vf scale=1080:1920', // Scale to 1920p
                '-an',                // Mute audio (remove audio stream)
                '-movflags +faststart', // Optimize for web streaming
                '-threads 2'          // Limit to 2 threads (matches your 2 vCPU cores)
            ])
            .on('start', (cmd) => console.log('Started:', cmd))
            .on('progress', (progress) =>
                console.log("Progress:", progress)
            )
            .on('error', (err) => reject(err))
            .on('end', () => resolve({ outputPath, tempDir, filename }))
            .save(outputPath);
    });
};

// 🔹 Upload to BunnyCDN function
const uploadToBunnyCDN = async (filePath, filename, res) => {
    const fileData = await fs.readFile(filePath);
    const uploadUrl = `https://${BUNNY_STORAGE_ZONE}/${filename}`;
    try {
        await axios.put(uploadUrl, fileData, {
            headers: {
                AccessKey: BUNNY_ACCESS_KEY,
                "Content-Type": "application/octet-stream",
            },
        });
        return `${BUNNY_PULL_ZONE}/${filename}`;
    } catch (error) {
        console.error("BunnyCDN Upload Error:", error.response?.data || error.message);
        return res.status(error.response?.data?.HttpCode || 501).json({ success: false, messgae: `"BunnyCDN Upload Error:" ${error.response?.data?.message || error.message}` });
    }
};

export default async function handler(req, res) {
    let media = [];

    try {
        const formData = await new Promise((resolve, reject) => {
            const form = formidable({ multiples: true });
            form.parse(req, (err, fields, files) => {
                if (err) reject(err);
                else resolve({ fields, files });
            });
        });

        const data = object_mapping(formData.fields);
        const _media = (data.media && data.media.length) ? data.media.map(item => (JSON.parse(item))) : [];
        media = _media.length ? _media.filter(e => e !== "undefined") : [];

        const images = formData.files.images;
        const imageThumbnailFlags = Array.isArray(formData.fields.imageThumbnailFlags)
            ? formData.fields.imageThumbnailFlags
            : [formData.fields.imageThumbnailFlags];

        if (images && images.length) {
            const imagesArray = Array.isArray(images) ? images : [images];
            for (const [index, image] of imagesArray.entries()) {
                const { outputPath, tempDir, filename } = await compressImage(image.filepath, "public/compressed_images");
                const newUrl = await uploadToBunnyCDN(outputPath, filename, res);
                const isThumbnail = imageThumbnailFlags[index] === "true";
                if (newUrl) {
                    media.push({ type: "image", url: newUrl, thumbnail: isThumbnail, recent: true });
                }
                await fs.rm(tempDir, { recursive: true, force: true });
            }
        }

        const videos = formData.files.videos;
        const videoThumbnailFlags = Array.isArray(formData.fields.videoThumbnailFlags)
            ? formData.fields.videoThumbnailFlags
            : [formData.fields.videoThumbnailFlags];

        if (videos && videos.length) {
            const videosArray = Array.isArray(videos) ? videos : [videos];
            for (const [index, video] of videosArray.entries()) {
                const { outputPath, tempDir, filename } = await compressVideo(video.filepath, "public/compressed_videos");
                const newUrl = await uploadToBunnyCDN(outputPath, filename, res);
                const isThumbnail = videoThumbnailFlags[index] === "true";
                if (newUrl) {
                    media.push({ type: "video", url: newUrl, thumbnail: isThumbnail, recent: true });
                }
                await fs.rm(tempDir, { recursive: true, force: true });
            }
        }

        return res.status(200).json({ ...data, media });

    } catch (err) {
        if (media.length) {
            const recent_media = media.filter(e => e.recent);
            if (recent_media.length) await deleteFiles(recent_media.map(e => e.url), { req, res });
        }
        console.log(err);
        res.status(500).json({ success: false, message: err.message });
    }
}

export const config = {
    api: {
        bodyParser: false,
    },
};