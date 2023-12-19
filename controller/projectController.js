const Project = require("../model/Project");
const { validationResult } = require('express-validator');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const randomstring = require("randomstring");
const nodemailer = require("nodemailer");
const logger = require("../logger/logger");
const env = require("dotenv").config();
const User = require("../model/User");
const mongodb = require("mongodb");
const { error } = require("winston");



async function createProject(req, res) {
    try {
        console.log(req.body);
        const project = new Project({
            ...req.body,
            users: [req.user._id]
        })

        await project.save();

        return res.status(201).json({ message: "Admin Successfully created new projects!!" });
    }
    catch (error) {
        logger.error(error.message);
        return res.status(500).json({ error: error.message });
    }
}

async function addUserToProject(req, res) {
    try {
        const projectId = req.body.projectId;
        const user_id = req.body.user_id;

        const project = await Project.find({ _id: new mongodb.ObjectId(projectId) });
        const user = await User.find({ _id: new mongodb.ObjectId(user_id) });

        if (project.length && user.length) {

            if (!project[0].users.includes(user_id)) {
                project[0].users.push(user_id);

                const update = { ...project[0] }
                const filter = { _id: new mongodb.ObjectId(projectId) };

                const result = await Project.findByIdAndUpdate(filter, update);

                if (result) {
                    // logger.info("Recored successfully has been updated!");
                    res.status(201).json({ "message": "Project has been successfully added!" });
                }
            }
            else {
                res.status(201).json({ "message": "Project has already assignd to this user!!" });
            }
        }
        else if (!user.length) {
            res.statusCode = 404;
            // logger.info("Project does not exists!");
            res.write(
                JSON.stringify({ title: "Not found", message: "User does not exists!" })
            );
            res.end();
        }
        else {
            res.statusCode = 404;
            // logger.info("Project does not exists!");
            res.write(
                JSON.stringify({ title: "Not found", message: "This project does not exists!" })
            );
            res.end();
        }


    }
    catch (error) {
        logger.error(error.message);
        return res.status(500).json({ error: error.message });
    }
}


async function createTask(req, res) {

}


async function showAssignedProject(req, res) {

    try {
        const user_id = req.user._id
        const project = await Project.find({
            users: { $elemMatch: {$eq: user_id} }
        })
        
        if (project.length) {
            res.status(200).json({ Projects: project });
        }
        else{
            res.status(200).json({message: "No any project assigned to you!"});
        }
    }
    catch (err) {
        res.status(400).json({message: err.message});
    }
}

module.exports = {
    createProject,
    addUserToProject,
    createTask,
    showAssignedProject
}