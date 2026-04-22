const express = require('express');
const router = express.Router();
const Entry = require('../models/Entry');
const auth = require('../middleware/authMiddleware');

// Get all entries for the logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const entries = await Entry.find({ user: req.user }).sort({ createdAt: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Create a new entry
router.post('/', auth, async (req, res) => {
  try {
    const { text, mood } = req.body;
    const newEntry = new Entry({ user: req.user, text, mood });
    const savedEntry = await newEntry.save();
    res.status(201).json(savedEntry);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Update an entry
router.put('/:id', auth, async (req, res) => {
  try {
    const { text, mood } = req.body;
    // Find by ID AND User to ensure they own it
    const entry = await Entry.findOneAndUpdate(
      { _id: req.params.id, user: req.user },
      { text, mood },
      { new: true } // Returns the updated document
    );
    
    if (!entry) return res.status(404).json({ message: 'Entry not found' });
    res.json(entry);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Delete an entry
router.delete('/:id', auth, async (req, res) => {
  try {
    const entry = await Entry.findOneAndDelete({ _id: req.params.id, user: req.user });
    if (!entry) return res.status(404).json({ message: 'Entry not found' });
    res.json({ message: 'Entry deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;