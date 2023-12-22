const Project = require("../model/Project");
const logger = require("../logger/logger");
const User = require("../model/User");
const ProjectTask = require("../model/ProjectTask");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../error");
const mongodb = require("mongodb");



async function createProject(req, res, next) {
    try {
        const project = new Project({
            ...req.body,
            users: [req.user._id]
        })

        await project.save();

        return res.status(StatusCodes.CREATED).json({ message: "Admin Successfully created new projects!!" });
    }
    catch (error) {
        logger.error(error.message);
        return next(error);
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
                    // logger.info("Record successfully has been updated!");
                    res.status(StatusCodes.CREATED).json({ "message": "Project has been successfully added!" });
                }
            }
            else {
                throw new BadRequestError(
                    "Project has already assignd to this user!!"
                );
            }
        }
        else if (!user.length) {
            // logger.info("Project does not exists!");
            throw new NotFoundError(
                "User does not exists!"
            );
        }
        else {
            throw new NotFoundError(
                "This project does not exists!"
            );
        }
    }
    catch (error) {
        logger.error(error.message);
        return next(error);
    }
}

async function createProjectTask(req, res, next) {
    try {

        const { projectId, description } = req.body;
        const project = await Project.findOne({ _id: new mongodb.ObjectId(projectId) });

        if (project) {
            const newProjectTask = await ProjectTask.create({ project_id: projectId, description: description })

            return res.status(StatusCodes.CREATED).json({ message: "New project task has been declared !" });
        }
        else {
            throw new NotFoundError(
                "Project not found At this Id!"
            );
        }

    }
    catch (err) {
        return next(err);
    }
}

async function showAssignedProject(req, res, next) {
    try {
        const user_id = req.user._id
        const project = await Project.find({
            users: { $elemMatch: { $eq: user_id } }
        })

        if (project.length) {
            res.status(StatusCodes.OK).json({ Projects: project });
        }
        else {
            res.status(StatusCodes.OK).json({ message: "No any project assigned to you!" });
        }
    }
    catch (err) {
        return next(err);
    }
}

async function selectProjectTask(req, res, next) {
    try {

        // project_id ---- req.body
        // user_id --- req.user
        // projectTask_id ----- req.body

        const user_id = req.user._id
        const project_id = req.body.projectId;
        const projectTask_id = req.body.projectTaskId;

        const project = await Project.aggregate([
            // Stage 1: Only find documents that have more than 1 project
            {
                $match: { _id: { $eq: new mongodb.ObjectId(project_id) } }
            },
            // Stage 2: Group documents by included perticular requsted user
            {
                $match: { users: { $elemMatch: { $eq: new mongodb.ObjectId(user_id) } } }
            }
        ])


        // console.log({ "your projects": project });

        if (project.length) {
            const projectTask = await ProjectTask.findOne({
                _id: new mongodb.ObjectId(projectTask_id), project_id: new mongodb.ObjectId(project_id)
            });


            if (projectTask) {
                if (projectTask.assign_user === null) {
                    const filter = { _id: new mongodb.ObjectId(projectTask._id) };
                    const update = { $set: { assign_user: user_id } };

                    const result = await ProjectTask.updateOne(filter, update);
                    return res.status(StatusCodes.OK).json({ message: "You have selected the project task!" });
                }
                else {
                    throw new BadRequestError(
                        "Task already assigned to other!"
                    );
                }
            }
            else {
                throw new NotFoundError(
                    "Task is undefined!"
                )
            }
        }
        else {
            res.status(StatusCodes.OK).json({ message: "No any project assigned to you!" });
        }
    }
    catch (err) {
        return next(err);
    }
}

async function getProjectById(req, res, next) {
    try {
        const projectId = req.params.projectId;
        const user_id = req.user._id;

        const project = await Project.findOne({ _id: new mongodb.ObjectId(projectId) });
        if (project) {
            const projectTask = await ProjectTask.find({
                project_id: new mongodb.ObjectId(projectId)
            });

            const userList = project?.users;


            const projectUser = await User.find({ "_id": { "$in": userList } }).select('_id name').lean();

            res.status(StatusCodes.OK).json({ project: project, projectTask: projectTask, projectUser: projectUser });
        }
        else {
            throw new NotFoundError(
                "No any project exixts with this Id!"
            )
        }
    }
    catch (err) {
        return next(err);
    }
}






module.exports = {
    createProject,
    addUserToProject,
    createProjectTask,
    showAssignedProject,
    selectProjectTask,
    getProjectById
}