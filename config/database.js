require('dotenv').config({path: "./.env"});
const mongoose = require('mongoose');

const mongoURI = process.env.MONGODB_URI;

mongoose.connect(mongoURI).then(() => {
    console.log('>>> Connected to MongoDB');
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});