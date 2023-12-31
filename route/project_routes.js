const project_routes = require("express").Router();
const { verifyJWT, restrict } = require("../middleware/validation");
const { createProject,
    addUserToProject,
    showAssignedProject,
    createProjectTask,
    selectProjectTask,
    getProjectById,
    showAllUsers
} = require("../controller/projectController")


project_routes.use(verifyJWT);

project_routes.get("/show-assigned-project", showAssignedProject);

project_routes.post("/show-users", showAllUsers);

project_routes.get("/:projectId", getProjectById);

project_routes.post("/select-project-task", selectProjectTask);

// Middlewere for admin routes
project_routes.use(restrict('admin'));
// Below all the routes for admin **


project_routes.get("/", (req, res) => {
    res.status(200).json({ message: "Hello to the project!!" });
});

project_routes.post("/create-project", createProject);

project_routes.post("/create-project-task", createProjectTask);

project_routes.post("/add-user-to-project", addUserToProject);

module.exports = project_routes;
