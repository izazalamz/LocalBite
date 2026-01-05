const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

router.get("/", orderController.getAllOrders);
router.get("/foodie/:foodieId", orderController.getOrdersByFoodie);
router.get("/cook/:cookId", orderController.getOrdersByCook);
router.post("/", orderController.createOrder);
router.get("/:id", orderController.getOrderById);

router.post("/:id/cook/confirm", orderController.cookConfirm);
router.post("/:id/cook/cancel", orderController.cookCancel);

router.post("/:id/foodie/confirm", orderController.foodieConfirm);
router.post("/:id/foodie/cancel", orderController.foodieCancel);

router.post("/:id/complete", orderController.completeOrder);

module.exports = router;
