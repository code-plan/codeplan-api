const express = require("express");
const controller = require("../controller/authorization");

const router = express();

router.get("/", controller.get_token);

module.exports = (app) => app.use("/authorization", router);
