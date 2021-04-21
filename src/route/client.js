const express = require("express");
const controller = require("../controller/client");

const router = express();

router.get("/:client_id/:code", controller.confirm_client);
router.post("/", controller.create_client);
router.delete("/:client_id", controller.delete_client);

module.exports = (app) => app.use("/clients", router);
