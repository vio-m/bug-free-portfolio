const mongoose = require('mongoose');


const visitorSchema = new mongoose.Schema({
    v_id: String,
    ip: String,
    method: String,
    url: String,
    userAgent: String,
    referer: String,
    timestamp: Date
});


const Visitor = mongoose.model('Visitor', visitorSchema);

module.exports = Visitor



