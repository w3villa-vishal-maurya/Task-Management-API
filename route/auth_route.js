const auth_routes = require("express").Router();
const { loginReq, logOutReq} = require("../controller/userController");
const { loginValidator } = require("../middleware/validation");
const {showTask, createTask, taskWithId, updateTask, deleteTask} = require("../controller/taskControlller");

auth_routes.post("/login",
    loginValidator,
    loginReq
);

auth_routes.get("/auth/profile", (req, res) => {
    // console.log(req.user);
    return res.status(200).send(req.user);
})

auth_routes.get("/auth/showtask", showTask);

auth_routes.get("/auth/task/:id", taskWithId);

auth_routes.put("/auth/update/:id", updateTask);

auth_routes.post("/auth/createtask", createTask);

auth_routes.get("/auth/logout", logOutReq);

auth_routes.delete("/auth/delete/:id", deleteTask);




module.exports = auth_routes;