const auth_routes = require("express").Router();
const { loginReq, logOutReq } = require("../controller/userController");
const { loginValidator, taskValidator } = require("../middleware/validation");


const {
    showTaskCache,
    taskWithIdCache,
    getPendingTaskCache,
    getCompletedTaskCache
} = require("../middleware/redisCache");

const {
    showTask,
    createTask,
    taskWithId,
    updateTask,
    deleteTask,
    getPendingTask,
    getCompletedTask
} = require("../controller/taskControlller");



// ##### User Credentials Routes #############
auth_routes.get("/auth/profile", (req, res) => {
    return res.status(200).send(req.user);
})

auth_routes.post("/login",
    loginValidator,
    loginReq
);


auth_routes.get("/auth/logout", logOutReq);

// ##### Task Routes #############

auth_routes.get("/auth/showtask",
    showTaskCache,
    showTask);

auth_routes.post("/auth/createtask",
    taskValidator,
    createTask
);

auth_routes.get("/auth/task/:id",
    taskWithIdCache,
    taskWithId);


auth_routes.get("/auth/pendingtask",
    getPendingTaskCache,
    getPendingTask);

auth_routes.get("/auth/completedtask",
    getCompletedTaskCache,
    getCompletedTask);

auth_routes.put("/auth/update/:id",
    taskValidator,
    updateTask
);


auth_routes.delete("/auth/delete/:id", deleteTask);


module.exports = auth_routes;