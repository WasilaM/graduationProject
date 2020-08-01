const config = require('../config/cloudConfig');
const cloudinary = require('cloudinary');
cloudinary.config(config.cloudinary);
const image = {}
    // Convert Local Upload To Cloudinary Url
image.toImgUrl = async function toImgUrl(multerObject) {
    try {
        let result = await cloudinary.v2.uploader.upload(multerObject.path);

        console.log('imgUrl: ', result.secure_url);
        return result.secure_url;
    } catch (err) {
        console.log('sdvsvdsvsdvdsv')
        console.log('Cloudinary Error: ', err);

    }
}

module.exports = image;