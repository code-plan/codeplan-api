const express = require("express");
const controller = require("../controller/customer");
const authorization_middleware = require("../middleware/auth");

const router = express();

router.use(authorization_middleware);

router.get("/:customer_id", controller.get_customer);
router.get("/", controller.get_customers);
router.post("/", controller.create_customer);
router.delete("/:customer_id", controller.delete_customer);
router.put("/:customer_id", controller.update_customer);

module.exports = (app) => app.use("/customers", router);
