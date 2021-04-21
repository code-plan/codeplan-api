const express = require("express");
const controller = require("../controller/user");
const authorization_middleware = require("../middleware/auth");

const router = express();
router.post("/", controller.create_user);
router.get("/:user_id/:code", controller.confirm_user);

router.use(authorization_middleware);

router.get("/", controller.get_users);
router.get("/:user_id", controller.get_user);
router.put("/", controller.update_user);
router.delete("/:user_id", controller.delete_user);

module.exports = (app) => app.use("/users", router);
