// server/seedMenu.js
const mongoose = require('mongoose');
const MenuItem = require('./models/MenuItem');
const connectDB = require('./config/database');

const menuItems = [
  { name: "Margherita Pizza", price: 149, category: "pizza", image: "/pngegg.png", },
  { name: "Pepperoni Pizza", price: 199, category: "pizza", image: "/pngegg.png", },
  { name: "Veggie Supreme", price: 249, category: "pizza", image: "/pngegg.png", },
  { name: "BBQ Chicken Pizza", price: 299, category: "pizza", image: "/pngegg.png", },
  { name: "Classic Fries", price: 99, category: "fries", image: "/pngegg.png", },
  { name: "Cheesy Fries", price: 129, category: "fries", image: "/pngegg.png", },
  { name: "Cheeseburger", price: 179, category: "burger", image: "/pngegg.png", },
  { name: "Chicken Burger", price: 199, category: "burger", image: "/pngegg.png", },
  { name: "Veg Maggie", price: 79, category: "maggie", image: "/pngegg.png" },
  { name: "Butter Maggie", price: 99, category: "maggie", image: "/pngegg.png", },
  { name: "White Pasta", price: 169, category: "pasta", image: "/pngegg.png", },
  { name: "Red Pasta", price: 179, category: "pasta", image: "/pngegg.png", },
  { name: "Caesar Salad", price: 149, category: "salad", image: "/pngegg.png", },
  { name: "Greek Salad", price: 159, category: "salad", image: "/pngegg.png", },
  { name: "Club Sandwich", price: 189, category: "sandwich", image: "/pngegg.png", },
  { name: "Grilled Cheese", price: 139, category: "sandwich", image: "/pngegg.png", }
];

const seedDatabase = async () => {
  try {
    await connectDB();
    
    // Clear existing menu items
    await MenuItem.deleteMany({});
    
    // Insert new menu items
    await MenuItem.insertMany(menuItems);
    
    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();