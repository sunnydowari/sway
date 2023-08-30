const mongoose = require('mongoose');
require('dotenv').config()
mongoose.connect(process.env.MONGO_URL)

const db = mongoose.connection;


db.on('connected', () =>{
    console.log('mongo DB connection Successful');
})

db.on('error', (err) => {
    console.log('mongo DB connection failed');
})

module.exports = db;