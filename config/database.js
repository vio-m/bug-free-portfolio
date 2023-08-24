require('dotenv').config({path: "./.env"});
const mongoose = require('mongoose');

const mongoURI = process.env.MONGODB_URI;

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('>>> Connected to MongoDB');
}).catch((error) => {
    console.log('>>>', process.env.MONGODB_URI);
    console.error('Error connecting to MongoDB:', error);
});