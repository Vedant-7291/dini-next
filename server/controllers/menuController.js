// server/controllers/menuController.js
const MenuItem = require('../models/MenuItem');
const fs = require('fs');
const path = require('path');

// Helper to build full URL for images
const getImageUrl = (req, filename) => {
  return `${req.protocol}://${req.get('host')}/uploads/${filename}`;
};

// Get all menu items
exports.getMenuItems = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const menuItems = await MenuItem.find(filter).sort({ name: 1 });
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single menu item
exports.getMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    res.json(menuItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create menu item
exports.createMenuItem = async (req, res) => {
  try {
    const { name, price, category, preparationTime } = req.body;

    let imagePath = `${req.protocol}://${req.get('host')}/pngegg.png`; // default image
    if (req.file) {
      imagePath = getImageUrl(req, req.file.filename);
    }

    const menuItem = new MenuItem({
      name,
      price: parseFloat(price),
      category,
      image: imagePath,
      preparationTime: parseInt(preparationTime) || 10
    });

    const savedItem = await menuItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update menu item
exports.updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, category, preparationTime, isAvailable } = req.body;

    const currentItem = await MenuItem.findById(id);
    if (!currentItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    let imagePath = currentItem.image;

    if (req.file) {
      imagePath = getImageUrl(req, req.file.filename);

      // Delete old image file if not default
      if (currentItem.image && !currentItem.image.endsWith('/pngegg.png')) {
        const oldImagePath = path.join(__dirname, '..', 'uploads', path.basename(currentItem.image));
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
    }

    const menuItem = await MenuItem.findByIdAndUpdate(
      id,
      {
        name,
        price: parseFloat(price),
        category,
        image: imagePath,
        preparationTime: parseInt(preparationTime) || 10,
        isAvailable
      },
      { new: true, runValidators: true }
    );

    res.json(menuItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete menu item
exports.deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const menuItem = await MenuItem.findById(id);

    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    if (menuItem.image && !menuItem.image.endsWith('/pngegg.png')) {
      const imagePath = path.join(__dirname, '..', 'uploads', path.basename(menuItem.image));
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await MenuItem.findByIdAndDelete(id);
    res.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Toggle availability
exports.toggleAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const menuItem = await MenuItem.findById(id);

    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    menuItem.isAvailable = !menuItem.isAvailable;
    const updatedItem = await menuItem.save();

    res.json(updatedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
