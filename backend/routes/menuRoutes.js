const express = require("express");

const {
  getMenu,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
} = require("../controllers/menuController");

const {
  protect,
  ownerOnly
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getMenu);

router.post(
  "/",
  protect,
  ownerOnly,
  createMenuItem
);

router.put(
  "/:id",
  protect,
  ownerOnly,
  updateMenuItem
);

router.delete(
  "/:id",
  protect,
  ownerOnly,
  deleteMenuItem
);

router.get(
  "/categories/all",
  getCategories
);

router.post(
  "/categories",
  protect,
  ownerOnly,
  createCategory
);

router.put(
  "/categories/:id",
  protect,
  ownerOnly,
  updateCategory
);

router.delete(
  "/categories/:id",
  protect,
  ownerOnly,
  deleteCategory
);

module.exports = router;