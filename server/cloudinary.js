const cloudinary = require("cloudinary").v2;

import {v2 as cloudinary} from 'cloudinary';
          
cloudinary.config({ 
  cloud_name: 'sunnysway', 
  api_key: '298112697966819', 
  api_secret: '9Tgt6J0WCvQyNQZWcTYPHKjowPQ' 
});

module.exports = cloudinary;
