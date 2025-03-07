import axios from 'axios';

const BUNNY_STORAGE_ZONE = process.env.BUNNY_STORAGE_ZONE;
const BUNNY_ACCESS_KEY = process.env.BUNNY_ACCESS_KEY;

// Function to extract the file name from the BunnyCDN URL
const extractFileName = (url) => {
    const parts = url.split('/');
    return parts[parts.length - 1];  // Get the last part of the URL, which is the file name
};

export const deleteFiles = async (images, { req, res }) => {
    try {
        for (const url of images) {

            // Extract the file name from the BunnyCDN URL
            const fileName = extractFileName(url);

            // Construct the full URL for the file in the BunnyCDN storage zone
            const fileUrl = `https://${BUNNY_STORAGE_ZONE}/${fileName}`;

            // Delete the file using BunnyCDN API (via HTTP DELETE)
            await axios.delete(fileUrl, {
                headers: {
                    'AccessKey': BUNNY_ACCESS_KEY,
                },
            });
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

export const deleteFile = async (image, { req, res }) => {
    try {
        const url = image;
        // Extract the file name from the BunnyCDN URL
        const fileName = extractFileName(url);

        // Construct the full URL for the file in the BunnyCDN storage zone
        const fileUrl = `https://${BUNNY_STORAGE_ZONE}/${fileName}`;

        // Delete the file using BunnyCDN API (via HTTP DELETE)
        await axios.delete(fileUrl, {
            headers: {
                'AccessKey': BUNNY_ACCESS_KEY,
            },
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
