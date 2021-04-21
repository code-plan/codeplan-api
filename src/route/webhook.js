const express = require("express");
const controller = require("../controller/webhook");

const router = express();
router.post(
  "/deployment/:project_id/:channel/:profile_id",
  controller.deployment
);

module.exports = (app) => app.use("/webhooks", router);
