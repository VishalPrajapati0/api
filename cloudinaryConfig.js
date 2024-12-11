const cloudinary = require('cloudinary').v2;

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,  // Cloudinary cloud name (from Cloudinary dashboard)
  api_key: process.env.CLOUDINARY_API_KEY,        // Cloudinary API key (from Cloudinary dashboard)
  api_secret: process.env.CLOUDINARY_API_SECRET,  // Cloudinary API secret (from Cloudinary dashboard)
});

module.exports = cloudinary;
