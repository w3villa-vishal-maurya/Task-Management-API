const Task = require("../model/Task")
const mongodb = require("mongodb");

async function showTask(req, res) {
    try {
        const user_id = req.user._id;
        const allTask = await Task.find({ user_id });

        if (allTask.length > 0) {
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
            return res.status(200).send({ "Task": result });
        }
        else {
            return res.status(404).send({ "error": "Record not found!" });

        }
    }
    catch (error) {
        return res.status(400).send({ error: "Invalid Id" });
    }
}

async function updateTask(req, res) {
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


module.exports = {
    showTask,
    createTask,
    taskWithId,
    updateTask,
    deleteTask
}