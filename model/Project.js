const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
    projectName: String,
    projectDescription: String,
    users: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ]

}, { timestamps: true });

const Project = mongoose.model("project", projectSchema);

module.exports = Project;