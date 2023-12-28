const mongoose = require("mongoose");

const projectTaskSchema = new mongoose.Schema({
    project_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Project'
    },
    taskName: {
        type: String,
        required: true
    },
    taskDescription: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    assign_user: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
        ref: 'User'
    }

}, { timestamps: true });

const ProjectTask = mongoose.model("ProjectTask", projectTaskSchema);

module.exports = ProjectTask;