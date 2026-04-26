const cloudinary = require('cloudinary').v2;
const multer= require("multer");
const CloudinaryStorage= require('cloudinary-multer');


//To integrate backend with CLOUDINARY
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'wanderlust_DEV',
    allowed_formats: ['jpg', 'jpeg', 'png'],
  },
});

module.exports= {
    cloudinary,
    storage
};