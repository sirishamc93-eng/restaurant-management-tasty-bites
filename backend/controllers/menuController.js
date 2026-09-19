const MenuItem = require("../models/MenuItem");
const Category = require("../models/Category");

const getMenu = async (req, res) => {
  try {
    const items = await MenuItem.find()
      .sort({ category: 1, name: 1 });

    res.json(items);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const createMenuItem = async (req, res) => {
  try {
    const {
      name,
      price,
      description,
      image,
      category,
      isVeg,
      isAvailable
    } = req.body;

    const item = await MenuItem.create({
      name,
      price,
      description,
      image,
      category,
      isVeg,
      isAvailable
    });

    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};

const updateMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!item) {
      return res.status(404).json({
        message: "Menu item not found"
      });
    }

    res.json(item);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};

const deleteMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndDelete(
      req.params.id
    );

    if (!item) {
      return res.status(404).json({
        message: "Menu item not found"
      });
    }

    res.json({
      message: "Menu item deleted"
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find()
      .sort({ name: 1 });

    res.json(categories);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    const category = await Category.create({
      name
    });

    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({
      message: error.code === 11000
        ? "Category already exists"
        : error.message
    });
  }
};

const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      {
        new: true,
        runValidators: true
      }
    );

    if (!category) {
      return res.status(404).json({
        message: "Category not found"
      });
    }

    await MenuItem.updateMany(
      { category: req.body.oldName },
      { category: req.body.name }
    );

    res.json(category);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(
      req.params.id
    );

    if (!category) {
      return res.status(404).json({
        message: "Category not found"
      });
    }

    res.json({
      message: "Category deleted"
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  getMenu,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
};