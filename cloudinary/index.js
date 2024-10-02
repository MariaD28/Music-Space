const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
 
cloudinary.config({ // Configuration for cloudinary
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
 
})
 
 
const storage = new CloudinaryStorage({ // Configuration for multer-storage-cloudinary
    cloudinary,
    params: {
    folder: 'MusicSpace', // Name of folder in cloudinary
    allowedFormats: ['jpeg', 'png' , 'jpg', 'gif']
    }
 
})
 
module.exports = {
    cloudinary,
    storage
}