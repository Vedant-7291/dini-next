const express = require('express');
const router = express.Router();
const {
  getUPIs,
  createUPI,
  updateUPI,
  activateUPI,
  deleteUPI
} = require('../controllers/upiController');

router.get('/', getUPIs);
router.post('/', createUPI);
router.put('/:id', updateUPI);
router.patch('/:id/activate', activateUPI);
router.delete('/:id', deleteUPI);

module.exports = router;