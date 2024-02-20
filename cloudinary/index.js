const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret : process.env.CLOUDINARY_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary,
    params: {   folder : 'Medion',
    allowedFormats : ['pdf', 'jpeg' ,'png' ,'jpg' ,'zip']
}
});
 

module.exports = {
    cloudinary,
    storage
}