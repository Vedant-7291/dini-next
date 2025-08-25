// server/routes/menu.js
const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload'); // Import the upload middleware
const {
  getMenuItems,
  getMenuItem,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  toggleAvailability
} = require('../controllers/menuController');

// Error handling middleware for multer
const handleMulterError = (error, req, res, next) => {
  if (error) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large. Maximum size is 5MB.' });
    }
    if (error.message === 'Only image files are allowed') {
      return res.status(400).json({ message: 'Only image files are allowed' });
    }
  }
  next(error);
};

router.get('/', getMenuItems);
router.get('/:id', getMenuItem);
router.post('/', upload.single('image'), handleMulterError, createMenuItem);
router.put('/:id', upload.single('image'), handleMulterError, updateMenuItem);
router.delete('/:id', deleteMenuItem);
router.patch('/:id/availability', toggleAvailability);

module.exports = router;