const express = require('express');
const router = express.Router();
const Counter = require('../Models/counter');

// GET all counters
router.get('/', async (req, res) => {
  try {
    const counters = await Counter.find();
    res.json(counters);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new counter
router.post('/', async (req, res) => {
  const counter = new Counter({
    boxNo: req.body.boxNo,
    title: req.body.title,
    description: req.body.description,
    count: req.body.count,
  });

  try {
    const newCounter = await counter.save();
    res.status(201).json(newCounter);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update a counter
router.put('/:id', async (req, res) => {
  try {
    const updatedCounter = await Counter.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedCounter);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a counter
router.delete('/:id', async (req, res) => {
  try {
    await Counter.findByIdAndDelete(req.params.id);
    res.json({ message: 'Counter deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
