const cloudinary = require('cloudinary').v2;
const fs = require("fs");

// Load Cloudinary config from environment
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary = async (filepath) => {
  try {
    const uploadResult = await cloudinary.uploader.upload(filepath);

    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }

    return uploadResult.secure_url;
  } catch (error) {
    console.error("Cloudinary error:", error);

    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }

    throw new Error("Cloudinary upload failed");
  }
};

module.exports = { uploadOnCloudinary };
