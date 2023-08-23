const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    image: String,
    title: String,
    description: String,
    technologies: String,
    github: String,
    demo: String
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;