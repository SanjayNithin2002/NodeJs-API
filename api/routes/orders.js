const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/checkAuth");
const OrdersController = require("../controllers/orders");

router.get("/", checkAuth, OrdersController.ordersGetAll);
router.post("/", checkAuth, OrdersController.ordersPost);
router.get("/:id", checkAuth, OrdersController.ordersGetById);
router.delete("/:id", checkAuth, OrdersController.orderDelete);

module.exports = router;


