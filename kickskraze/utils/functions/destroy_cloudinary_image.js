import cloudinary from 'cloudinary';

cloudinary.v2.config({
    cloud_name: 'dceqyrfhu',
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


export const deleteImages = async (images, { req, res }) => {
    try {
        for (const url of images) {
            console.log(url)
            // Extract the public_id from the URL
            const publicId = url
                .split('/upload/f_auto,q_auto/')[1] // Get everything after "upload/"
                .replace(/^v\d+\//, '') // Remove version identifiers like "v1735781118/"
                .split('.')[0] // Remove the file extension
                .replace(/%20/g, ' '); // Decode any URL-encoded spaces

            // Determine resource type based on URL
            const resourceType = url.includes('/video/') ? 'video' : 'image';

            // Call the Cloudinary API to delete the media
            await cloudinary.v2.uploader.destroy(publicId, { resource_type: resourceType })
        }

    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

export const deleteImage = async (image, { req, res }) => {
    try {
        const url = image;

        // Extract the public_id from the URL
        const publicId = url
            .split('/upload/')[1] // Get everything after "upload/"
            .replace(/^v\d+\//, '') // Remove version identifiers like "v1735781118/"
            .split('.')[0] // Remove the file extension
            .replace(/%20/g, ' '); // Decode any URL-encoded spaces

        // Call the Cloudinary API to delete the image
        await cloudinary.v2.uploader.destroy(publicId);

    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};