import formidable from 'formidable';
import ffmpeg from 'fluent-ffmpeg';
import cloudinary from 'cloudinary';
import path from 'path';
import fs from 'fs/promises';
import fsSync from 'fs';
import { nanoid } from 'nanoid';

ffmpeg.setFfmpegPath("C:/Users/muhammad talha/Downloads/ffmpeg/bin/ffmpeg.exe");
// ffmpeg.setFfmpegPath("/usr/bin/ffmpeg");

cloudinary.v2.config({
    cloud_name: 'dceqyrfhu',
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


/**
 * 
 * @param {import('next').NextApiRequest} req 
 * @param {import('next').NextApiResponse} res 
 */


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
}




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



// Upload to Cloudinary function
const settings = {
    resource_type: 'auto',
    folder: 'KicksKraze',
    eager: [
        { fetch_format: 'auto', quality: 'auto' } // Eager transformation
    ]
}
const uploadToCloudinary = async (filePath) => {
    return new Promise((resolve, reject) => {
        cloudinary.v2.uploader.upload(
            filePath,
            settings,
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );
    });
};

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            // Parse incoming form data (multipart/form-data)
            const formData = await new Promise((resolve, reject) => {
                const form = formidable({ multiples: true });
                form.parse(req, (err, fields, files) => {
                    if (err) reject(err);
                    else resolve({ fields, files });
                });
            });

            const data = object_mapping(formData.fields); // Other data should be under `fields` key

            // Array to store all Cloudinary URLs
            const _media = (data.media && data.media.length) ? data.media.map(item => (JSON.parse(item))) : []
            const media = _media.length ? _media.filter(e => e !== "undefined") : [];


            const images = formData.files.images // Image Files should be under `images` key
            const imageThumbnailFlags = Array.isArray(data.imageThumbnailFlags)
                ? data.imageThumbnailFlags
                : [data.imageThumbnailFlags];


            // Handle multiple images files concurrently
            if (images && images.length) {
                for (const [index, image] of (Array.isArray(images) ? images : [images]).entries()) {
                    const uploadResult = await uploadToCloudinary(image.filepath);
                    const isThumbnail = imageThumbnailFlags[index] === "true";
                    media.push({
                        type: "image",
                        url: uploadResult.eager[0].secure_url,
                        thumbnail: isThumbnail,
                        recent: true,
                    });
                }
            }

            const videos = formData.files.videos; // Video Files should be under `videos` key
            const videoThumbnailFlags = Array.isArray(formData.fields.videoThumbnailFlags)
                ? formData.fields.videoThumbnailFlags
                : [formData.fields.videoThumbnailFlags];

            // Handle multiple video files concurrently
            if (videos && videos.length) {
                for (const [index, video] of (Array.isArray(videos) ? videos : [videos]).entries()) {
                    const compressedPath = path.resolve('./uploads', `${nanoid()}_compressed.mp4`);
                    await compressVideo(video.filepath, compressedPath);

                    const uploadResult = await uploadToCloudinary(compressedPath);
                    const isThumbnail = videoThumbnailFlags[index] === "true";
                    media.push({
                        type: "video",
                        url: uploadResult.eager[0].secure_url,
                        thumbnail: isThumbnail,
                        recent: true,
                    });

                    // Clean up temporary compressed video
                    await fs.unlink(compressedPath);
                }
            }


            // sending success response to client
            return res.status(200).json({ ...data, media });


        } catch (err) {
            console.log(err)
            res.status(500).json({ success: false, message: err.message, });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}


// Disable Next.js body parsing for this route
export const config = {
    api: {
        bodyParser: false,
    },
};



