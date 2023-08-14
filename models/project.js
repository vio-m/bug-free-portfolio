const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    image: String,
    title: String,
    description: String,
    // Add other fields you need for the project
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;