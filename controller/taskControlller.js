const Task = require("../model/Task")
const mongodb = require("mongodb");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError} = require("../error");
// const client = require("../redis/client");
const logger = require("../logger/logger");

async function showTask(req, res, next) {
    try {
        const user_id = req.user._id;
        const allTask = await Task.find({ user_id: user_id});

        if (allTask.length > 0) {

            // Cache data to redis...
            // client.set(`${user_id}alltask`, JSON.stringify(allTask));

            logger.info("All task have been responded!");
            return res.status(StatusCodes.OK).send({ "Task": allTask });
        }
        else {
            logger.info("You have no any current Task!");
            return res.status(StatusCodes.OK).send({ "Update": "You have no any current Task!" });
        }
    }
    catch (err) {
        logger.error(err.message);
        return next(err);
    }
}

async function createTask(req, res, next) {
    /*  #swagger.auto = false

           #swagger.path = 'auth/createtask'
           #swagger.method = 'put'
           #swagger.description = 'Endpoint added manually.'
           #swagger.produces = ["application/json"]
           #swagger.consumes = ["application/json"]
       */

    /*  #swagger.parameters['body'] = {
            in: 'body',
            description: 'Task description',
            required: true,
            schema: {
                description: "any",
                completed: false
            }
        }
    */

    try {
        const task = new Task({
            ...req.body,
            user_id: req.user._id
        })

        await task.save();

        logger.info("Successfully created you task!");
        return res.status(StatusCodes.CREATED).send({ message: "Successful created you task!" });
    }
    catch (err) {
        logger.error(err.message);
        return next(err);
    }
}

async function taskWithId(req, res, next) {
    try {
        const id = req.params.id;
        const user_id = req.user._id;

        const result = await Task.find({ _id: new mongodb.ObjectId(id), user_id: user_id });
        if (result.length > 0) {

            // Cache data to redis...
            // client.set(`${user_id}taskWithId`, JSON.stringify(result));

            return res.status(StatusCodes.OK).send({ "Task": result });
        }
        else {
            throw new NotFoundError(
                "Invalid id, Record not found!"
            );
        }
    }
    catch (error) {
        logger.error(error.message);
        return next(err);
    }
}

async function updateTask(req, res, next) {
    /*  #swagger.auto = false

            #swagger.path = 'auth/update/{id}'
            #swagger.method = 'patch'
            #swagger.description = 'Endpoint added manually.'
            #swagger.produces = ["application/json"]
            #swagger.consumes = ["application/json"]
        */

    /*  #swagger.parameters['id'] = {
            in: 'path',
            description: 'Task Id',
            required: true
        }
    */

    /*  #swagger.parameters['body'] = {
            in: 'body',
            description: 'Task description',
            required: true,
            schema: {
                description: "any",
                completed: false
            }
        }
    */

    try {
        const id = req.params.id;

        const filter = { _id: new mongodb.ObjectId(id) };
        const update = { ...req.body };

        const result = await Task.findByIdAndUpdate(filter, update);
        if (result) {
            logger.info("Recored successfully has been updated!");

            return res.status(StatusCodes.CREATED).send({ message: "Successful updated you task!" });
        }
        else {

            throw new NotFoundError(
                "Record does not exists!"
            );
        }
    }
    catch (err) {
        logger.error(err.message);
        err.message = "Id is not valid!";

        return next(err);
    }
}


async function deleteTask(req, res, next) {
    try {
        const id = req.params.id;

        const result = await Task.deleteOne({ _id: new mongodb.ObjectId(id) });
        if (result.deletedCount != 0) {
            logger.info("Task has been deleted from database!");
            return res.status(StatusCodes.OK).send({ title: "Successfull", message: "Task has been removed!" });
        }
        else {
            throw new BadRequestError(
                { title: "Successfull", message: "Task not found!" }
            );
        }
    }
    catch (err) {
        logger.error(err.message);
        return next(err);
    }
}

async function getPendingTask(req, res, next) {
    try {
        const user_id = req.user._id;

        const allTask = await Task.find({ user_id });


        if (allTask) {
            const pendingTask = allTask.filter((task) => {
                if (!task.completed) {
                    return true;
                }

                return false;
            })

            // Cache data to redis...
            // client.set(`${user_id}pendingtask`, JSON.stringify(pendingTask));

            return res.status(StatusCodes.OK).send({ "pendingTask": pendingTask });
        }
        else {
            return res.status(StatusCodes.OK).send({ "pendingTask": "{}" });
        }

    }
    catch (err) {
        return next(err);
    }
}


async function getCompletedTask(req, res, next) {
    try {
        const user_id = req.user._id;

        const allTask = await Task.find({ user_id: user_id });

        if (allTask) {
            const completedTask = allTask.filter((task) => {
                if (task.completed) {
                    return true;
                }

                return false;
            })

            // Cache data to redis...
            // client.set(`${user_id}completedtask`, JSON.stringify(completedTask));

            return res.status(StatusCodes.OK).send({ "completedTask": completedTask });
        }
        else {
            return res.status(StatusCodes.OK).send({ "completedTask": "{}" });
        }

    }
    catch (err) {
        return next(err);
    }
}


module.exports = {
    showTask,
    createTask,
    taskWithId,
    updateTask,
    deleteTask,
    getPendingTask,
    getCompletedTask
}