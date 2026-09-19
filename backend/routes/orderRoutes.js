const express = require("express");

const {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus
} = require("../controllers/orderController");

const {
  protect,
  ownerOnly
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/",
  protect,
  createOrder
);

router.get(
  "/my",
  protect,
  getMyOrders
);

router.get(
  "/",
  protect,
  ownerOnly,
  getAllOrders
);

router.put(
  "/:id/status",
  protect,
  ownerOnly,
  updateOrderStatus
);

module.exports = router;