const Order = require("../models/Order");
const MenuItem = require("../models/MenuItem");

const createOrder = async (req, res) => {
  try {
    const {
      items,
      paymentMethod
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        message: "Cart is empty"
      });
    }

    if (paymentMethod !== "COD") {
      return res.status(400).json({
        message: "Only Cash on Delivery is available"
      });
    }

    let totalAmount = 0;

    const validatedItems = [];

    for (const cartItem of items) {
      const menuItem =
        await MenuItem.findById(
          cartItem.menuItemId
        );

      if (!menuItem) {
        return res.status(400).json({
          message: "Menu item not found"
        });
      }

      if (!menuItem.isAvailable) {
        return res.status(400).json({
          message: `${menuItem.name} is unavailable`
        });
      }

      const quantity =
        Number(cartItem.quantity);

      if (!quantity || quantity < 1) {
        return res.status(400).json({
          message: "Invalid item quantity"
        });
      }

      totalAmount +=
        menuItem.price * quantity;

      validatedItems.push({
        menuItemId: menuItem._id,
        quantity
      });
    }

    const order = await Order.create({
      userId: req.user._id,
      items: validatedItems,
      totalAmount,
      paymentMethod: "COD",
      paymentStatus: "Pending",
      status: "Pending"
    });

    const populatedOrder =
      await Order.findById(order._id)
        .populate("userId", "name email")
        .populate("items.menuItemId");

    res.status(201).json(
      populatedOrder
    );
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


const getMyOrders = async (req, res) => {
  try {
        const orders = await Order.find({
    userId: req.user._id
    })
    .populate("userId", "name email")
    .populate("items.menuItemId")
    .sort({
        createdAt: -1
    });

    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


const getAllOrders = async (req, res) => {
  try {
    const {
      search
    } = req.query;

    let query = {};

    if (search && search.trim()) {
      const searchValue =
        search.trim();

      if (
        /^[a-fA-F0-9]{24}$/.test(
          searchValue
        )
      ) {
        query._id = searchValue;
      } else {
        return res.json([]);
      }
    }

    const orders =
      await Order.find(query)
        .populate(
          "userId",
          "name email"
        )
        .populate(
          "items.menuItemId"
        )
        .sort({
          createdAt: -1
        });

    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


const updateOrderStatus = async (
  req,
  res
) => {
  try {
    const allowedStatuses = [
      "Pending",
      "Preparing",
      "Ready",
      "Delivered"
    ];

    const {
      status
    } = req.body;

    if (
      !allowedStatuses.includes(status)
    ) {
      return res.status(400).json({
        message: "Invalid order status"
      });
    }

    const updateData = {
      status
    };

    /*
      COD payment simulation:

      When the owner marks the order
      as Delivered, we simulate
      receiving cash.
    */
    if (status === "Delivered") {
      updateData.paymentStatus =
        "Paid";
    }

    const order =
      await Order.findByIdAndUpdate(
        req.params.id,
        updateData,
        {
          new: true
        }
      )
        .populate(
          "userId",
          "name email"
        )
        .populate(
          "items.menuItemId"
        );

    if (!order) {
      return res.status(404).json({
        message: "Order not found"
      });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


module.exports = {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus
};