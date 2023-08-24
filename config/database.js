require('dotenv').config();
const mongoose = require('mongoose');

const mongoURI = process.env.MONGODB_URI;

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('>>> Connected to MongoDB');
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});