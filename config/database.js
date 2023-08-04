require('dotenv').config();
const mongoose = require('mongoose');

const mongoURL = process.env.MONGODB_URL;

mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('>>> Connected to MongoDB');
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});