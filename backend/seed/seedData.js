const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

const connectDB = require("../config/db");

const User = require("../models/User");
const MenuItem = require("../models/MenuItem");
const Category = require("../models/Category");

dotenv.config();

const categories = [
  "Starters",
  "Main Course",
  "Desserts",
  "Drinks"
];

const menuItems = [
  {
    name: "Paneer Tikka",
    price: 220,
    description: "Grilled cottage cheese with Indian spices.",
    image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8",
    category: "Starters",
    isVeg: true,
    isAvailable: true
  },
  {
    name: "Veg Spring Rolls",
    price: 160,
    description: "Crispy rolls stuffed with fresh vegetables.",
    image: "https://www.cilantroandcitronella.com/vegetable-egg-rolls/",
    category: "Starters",
    isVeg: true,
    isAvailable: true
  },
  {
    name: "Chicken Tikka",
    price: 280,
    description: "Juicy grilled chicken marinated with spices.",
    image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0",
    category: "Starters",
    isVeg: false,
    isAvailable: true
  },
  {
    name: "Crispy Corn",
    price: 180,
    description: "Crispy fried corn tossed with herbs and spices.",
    image: "https://images.unsplash.com/photo-1551754655-cd27e38d2076",
    category: "Starters",
    isVeg: true,
    isAvailable: true
  },
  {
    name: "Veg Biryani",
    price: 240,
    description: "Aromatic basmati rice cooked with vegetables.",
    image: "https://images.unsplash.com/photo-1563379091339-03246963d96c",
    category: "Main Course",
    isVeg: true,
    isAvailable: true
  },
  {
    name: "Chicken Biryani",
    price: 320,
    description: "Traditional chicken biryani with aromatic spices.",
    image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0",
    category: "Main Course",
    isVeg: false,
    isAvailable: true
  },
  {
    name: "Butter Chicken",
    price: 350,
    description: "Creamy tomato-based chicken curry.",
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398",
    category: "Main Course",
    isVeg: false,
    isAvailable: true
  },
  {
    name: "Paneer Butter Masala",
    price: 290,
    description: "Soft paneer cooked in rich tomato gravy.",
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7",
    category: "Main Course",
    isVeg: true,
    isAvailable: true
  },
  {
    name: "Masala Dosa",
    price: 140,
    description: "Crispy dosa served with potato masala.",
    image: "https://images.unsplash.com/photo-1630383249896-424e482df921",
    category: "Main Course",
    isVeg: true,
    isAvailable: true
  },
  {
    name: "Gulab Jamun",
    price: 100,
    description: "Soft milk-solid dumplings soaked in sugar syrup.",
    image: "https://images.unsplash.com/photo-1605196560547-1cdbf7a7b0e3",
    category: "Desserts",
    isVeg: true,
    isAvailable: true
  },
  {
    name: "Chocolate Brownie",
    price: 160,
    description: "Warm chocolate brownie with rich cocoa flavor.",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c",
    category: "Desserts",
    isVeg: true,
    isAvailable: true
  },
  {
    name: "Ice Cream",
    price: 120,
    description: "Creamy vanilla ice cream.",
    image: "https://images.unsplash.com/photo-1501443762994-82bd5dace89a",
    category: "Desserts",
    isVeg: true,
    isAvailable: true
  },
  {
    name: "Fresh Lime Soda",
    price: 90,
    description: "Refreshing lime drink served chilled.",
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd",
    category: "Drinks",
    isVeg: true,
    isAvailable: true
  },
  {
    name: "Mango Lassi",
    price: 130,
    description: "Creamy yogurt drink blended with mango.",
    image: "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4",
    category: "Drinks",
    isVeg: true,
    isAvailable: true
  },
  {
    name: "Cold Coffee",
    price: 150,
    description: "Chilled creamy coffee topped with foam.",
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735",
    category: "Drinks",
    isVeg: true,
    isAvailable: true
  }
];

const seedData = async () => {
  try {
    await connectDB();

    await User.deleteMany();
    await MenuItem.deleteMany();
    await Category.deleteMany();

    const ownerPassword = await bcrypt.hash(
      "owner123",
      10
    );

    const customerPassword = await bcrypt.hash(
      "customer123",
      10
    );

    await User.create([
      {
        name: "Restaurant Owner",
        email: "owner@restaurant.com",
        password: ownerPassword,
        role: "Owner"
      },
      {
        name: "Demo Customer",
        email: "customer@restaurant.com",
        password: customerPassword,
        role: "Customer"
      }
    ]);

    await Category.insertMany(
      categories.map((name) => ({ name }))
    );

    await MenuItem.insertMany(menuItems);

    console.log("Seed data inserted successfully");
    console.log("");
    console.log("OWNER LOGIN");
    console.log("Email: owner@restaurant.com");
    console.log("Password: owner123");
    console.log("");
    console.log("CUSTOMER LOGIN");
    console.log("Email: customer@restaurant.com");
    console.log("Password: customer123");

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedData();