const UPI = require('../models/UPI');

// Get all UPI IDs
exports.getUPIs = async (req, res) => {
  try {
    const upis = await UPI.find().sort({ createdAt: -1 });
    res.json(upis);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create UPI ID
exports.createUPI = async (req, res) => {
  try {
    const { upiId, businessName } = req.body;
    
    // Check if UPI ID already exists
    const existingUPI = await UPI.findOne({ upiId });
    if (existingUPI) {
      return res.status(400).json({ message: 'UPI ID already exists' });
    }

    const upi = new UPI({ upiId, businessName });
    const savedUPI = await upi.save();
    res.status(201).json(savedUPI);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update UPI ID
exports.updateUPI = async (req, res) => {
  try {
    const { id } = req.params;
    const upi = await UPI.findByIdAndUpdate(id, req.body, { new: true });
    
    if (!upi) {
      return res.status(404).json({ message: 'UPI ID not found' });
    }

    res.json(upi);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Activate UPI ID
exports.activateUPI = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Deactivate all other UPIs
    await UPI.updateMany({ _id: { $ne: id } }, { status: 'inactive' });
    
    // Activate the selected UPI
    const upi = await UPI.findByIdAndUpdate(
      id, 
      { status: 'active' }, 
      { new: true }
    );
    
    if (!upi) {
      return res.status(404).json({ message: 'UPI ID not found' });
    }

    res.json(upi);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete UPI ID
exports.deleteUPI = async (req, res) => {
  try {
    const { id } = req.params;
    const upi = await UPI.findByIdAndDelete(id);
    
    if (!upi) {
      return res.status(404).json({ message: 'UPI ID not found' });
    }

    res.json({ message: 'UPI ID deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};