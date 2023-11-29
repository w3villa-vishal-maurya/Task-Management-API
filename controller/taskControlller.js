const Task = require("../model/Task")
const mongodb = require("mongodb");
const client = require("../redis/client");

async function showTask(req, res) {
    try {
        const user_id = req.user._id;
        const allTask = await Task.find({ user_id });

        if (allTask.length > 0) {

            // Cache data to redis...
            client.set("allTask", JSON.stringify(allTask));

            return res.status(200).send({ "Task": allTask });
        }
        else {
            return res.status(400).send({ "Update": "You have no any current Task!" });
        }
    }
    catch (err) {
        return res.status(400).send({ message: err.message });
    }
}

async function createTask(req, res) {
    try {
        const task = new Task({
            ...req.body,
            user_id: req.user._id
        })

        await task.save();

        return res.status(201).send({ message: "Seccussful created you task!" });
    }
    catch (err) {
        return res.status(400).send({ error: err.message });
    }
}

async function taskWithId(req, res) {
    try {
        const id = req.params.id;

        const result = await Task.findById({ _id: new mongodb.ObjectId(id) });
        if (result) {

            // Cache data to redis...
            client.set("taskWithId", JSON.stringify(result));

            return res.status(200).send({ "Task": result });
        }
        else {
            return res.status(404).send({ "error": "Record not found!" });

        }
    }
    catch (error) {
        return res.status(400).send({ error: error.message });
    }
}

async function updateTask(req, res) {
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

    /*  #swagger.parameters['description'] = {
            in: 'query',
            description: 'Task new Description.',
            required: true, 
            type: 'string'
        }
    */

    try {
        const id = req.params.id;

        const filter = { _id: new mongodb.ObjectId(id) };
        const update = { ...req.body };

        const result = await Task.findByIdAndUpdate(filter, update);
        if (result) {
            res.writeHead(201, { "Content-Type": "Application/json" });
            res.end();
        }
        else {
            res.statusCode = 404;
            res.write(
                JSON.stringify({ title: "Not found", message: "Record does not exists!" })
            );
            res.end();
        }
    }
    catch (err) {
        console.log(err);
        res.writeHead(400, { "Content-Type": "Application/json" });
        res.end(
            JSON.stringify({
                title: "Validation Failed",
                message: "Id is not valid!"
            })
        );
    }
}


async function deleteTask(req, res) {
    try {
        const id = req.params.id;

        const result = await Task.deleteOne({ _id: new mongodb.ObjectId(id) });
        if (result.deletedCount != 0) {
            res.statusCode = 200;
            res.write(JSON.stringify({ title: "Successfull", mesage: "Task has been removed!" }));
            res.end();
        }
        else {
            res.statusCode = 400;
            res.write(JSON.stringify({ title: "Successfull", mesage: "Task not found!" }));
            res.end();
        }
    }
    catch (err) {
        console.log(err);
        res.writeHead(400, { "Content-Type": "Application/json" });
        res.end(
            JSON.stringify({
                title: "Validation Failed",
                message: "Id is not valid!"
            })
        );
    }
}

async function getPendingTask(req, res) {
    try {
        const user_id = req.user._id;

        const allTask = await Task.find({ user_id: user_id });

        if (allTask) {
            const pendingTask = allTask.filter((task) => {
                if (task.createdAt === task.updatedAt && !task.completed) {
                    return true;
                }

                return false;
            })

            // Cache data to redis...
            client.set("pendingTask", JSON.stringify(pendingTask));

            return res.status(200).send({ "pendingTask": pendingTask });
        }
        else {
            return res.status(200).send({ "pendingTask": "{}" });
        }

    }
    catch (err) {
        return res.status(200).send({ error: err.message });
    }
}


async function getCompletedTask(req, res) {
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
            client.set("completedTask", JSON.stringify(completedTask));

            return res.status(200).send({ "completedTask": completedTask });
        }
        else {
            return res.status(200).send({ "completedTask": "{}" });
        }

    }
    catch (err) {
        return res.status(200).send({ error: err.message });
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