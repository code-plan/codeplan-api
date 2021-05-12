const express = require("express");
const controller = require("../controller/customer");
const authorization_middleware = require("../middleware/auth");

const router = express();

router.use(authorization_middleware);

router.get("/:project_id", controller.get_customer);

module.exports = (app) => app.use("/projects", router);
