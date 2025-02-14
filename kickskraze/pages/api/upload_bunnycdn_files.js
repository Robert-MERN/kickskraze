import formidable from 'formidable';
import axios from 'axios';
import path from 'path';
import fs from 'fs/promises';
import { nanoid } from 'nanoid';
import ffmpeg from 'fluent-ffmpeg';
import fsSync from 'fs';


// ffmpeg.setFfmpegPath("C:/Users/muhammad talha/Downloads/ffmpeg/bin/ffmpeg.exe");
ffmpeg.setFfmpegPath("/usr/bin/ffmpeg");

const BUNNY_STORAGE_ZONE = process.env.BUNNY_STORAGE_ZONE;
const BUNNY_ACCESS_KEY = process.env.BUNNY_ACCESS_KEY;
const BUNNY_PULL_ZONE = "https://kickskraze.b-cdn.net";

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


// Video compression function using fluent-ffmpeg
const compressVideo = async (inputPath, outputPath) => {
    // Ensure the uploads directory exists
    const uploadsDir = path.dirname(outputPath);
    if (!fsSync.existsSync(uploadsDir)) {
        fsSync.mkdirSync(uploadsDir, { recursive: true });
    }
    return new Promise((resolve, reject) => {
        ffmpeg(inputPath)
            .outputOptions([
                '-c:v libx264',   // Use H.264 codec for maximum compatibility
                '-preset veryfast',   // Faster encoding
                '-crf 23',        // Balanced quality & file size
                '-c:a aac',       // Use AAC for audio
                '-b:a 128k',      // Set audio bitrate
                '-movflags +faststart' // Optimize for web streaming
            ]) // Correctly split options
            .on('start', (cmd) => console.log('Started:', cmd))
            .on('progress', (progress) =>
                console.log("Progress:", progress)
            )
            .on('error', (err) => reject(err))
            .on('end', () => resolve(outputPath))
            .save(outputPath);
    });
};


// Function to remove the compressed videos folder
const removeCompressedVideosFolder = async () => {
    const folderPath = path.resolve(process.cwd(), 'public/compressed_videos');
    try {
        if (fsSync.existsSync(folderPath)) {
            await fs.rm(folderPath, { recursive: true, force: true });
            console.log("✅ Compressed videos folder removed.");
        }
    } catch (error) {
        console.error("❌ Error removing compressed videos folder:", error);
    }
};


// Upload to BunnyCDN function
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
    if (req.method === 'POST') {
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
            const media = _media.length ? _media.filter(e => e !== "undefined") : [];

            const images = formData.files.images;
            const imageThumbnailFlags = Array.isArray(formData.fields.imageThumbnailFlags)
                ? formData.fields.imageThumbnailFlags
                : [formData.fields.imageThumbnailFlags];

            if (images && images.length) {
                for (const [index, image] of (Array.isArray(images) ? images : [images]).entries()) {

                    const filename = `${nanoid(10)}${path.basename(image.newFilename)}.webp`;
                    const newUrl = await uploadToBunnyCDN(image.filepath, filename, res);
                    const isThumbnail = imageThumbnailFlags[index] === "true";
                    if (newUrl) {
                        media.push({ type: "image", url: newUrl, thumbnail: isThumbnail, recent: true });
                    }

                }
            }

            const videos = formData.files.videos;
            const videoThumbnailFlags = Array.isArray(formData.fields.videoThumbnailFlags)
                ? formData.fields.videoThumbnailFlags
                : [formData.fields.videoThumbnailFlags];

            if (videos && videos.length) {
                try {
                    for (const [index, video] of (Array.isArray(videos) ? videos : [videos]).entries()) {

                        const filename = `${nanoid(10)}${path.basename(video.newFilename)}.mp4`;
                        const compressedPath = path.resolve(process.cwd(), 'public/compressed_videos', filename);

                        await compressVideo(video.filepath, compressedPath);

                        const newUrl = await uploadToBunnyCDN(compressedPath, filename, res);
                        const isThumbnail = videoThumbnailFlags[index] === "true";
                        if (newUrl) {
                            media.push({ type: "video", url: newUrl, thumbnail: isThumbnail, recent: true });
                        }
                    }
                } finally {
                    await removeCompressedVideosFolder();
                }
            }



            return res.status(200).json({ ...data, media });

        } catch (err) {
            console.log(err);
            res.status(500).json({ success: false, message: err.message });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}

export const config = {
    api: {
        bodyParser: false,
    },
};
