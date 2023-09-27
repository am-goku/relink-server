import { v2 as cloudinary } from "cloudinary";

const cloudinaryConfig = ()=>{
    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.CLOUD_API_KEY,
      api_secret: process.env.CLOUD_KEY_SECRET,
      secure: true,
    });
}

export default cloudinaryConfig;