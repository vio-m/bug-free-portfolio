const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
    count: {
        type: Number,
        default: 0,
    },
    timestamp: Date
});

const Counter = mongoose.model('Counter', counterSchema);

module.exports = Counter