const project_routes = require("express").Router();
const {verifyJWT, restrict} = require("../middleware/validation");
const {createProject, addUserToProject, showAssignedProject} = require("../controller/projectController")


project_routes.use(verifyJWT);

project_routes.get("/showAssignedProject", showAssignedProject);

project_routes.use(restrict('admin'));

project_routes.get("/", (req, res)=>{
    res.status(200).json({message: "Hello to the project!!"});
});

project_routes.post("/createProject", createProject);

project_routes.post("/addUsertoproject", addUserToProject);


module.exports = project_routes;
