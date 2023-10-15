const cloudinary = require("cloudinary").v2;

cloudinary.config({ 
  cloud_name: 'dkshtxckl', 
  api_key: '298112697966819', 
  api_secret: '9Tgt6J0WCvQyNQZWcTYPHKjowPQ' 
});

module.exports = cloudinary;
          
