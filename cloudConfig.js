// Require the Cloudinary library
const cloudinary = require('cloudinary').v2
const {CloudinaryStorage} = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
})
// cloud_name, api_key and api_secret are provided by the cloudinary website. It has to be as it is.

// taken from multer-storage-cloudinary documentation
// edit it according to your requirements:

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'Airbnb_DEV', // The name of the folder in cloudinary where the image will be stored.
      allowedformat: async (req, file) => ["png", "jpg", "jpeg"], // supports promises as well
    },
  });

module.exports = {
    cloudinary,
    storage
};