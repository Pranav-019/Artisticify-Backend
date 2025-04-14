const express = require("express");
const router = express.Router();
const Counter = require("../Models/counter");

// @desc    Get all counter data
router.get("/get", async (req, res) => {
  try {
    const counters = await Counter.find();
    res.status(200).json({ success: true, data: counters });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Create a counter
router.post("/create", async (req, res) => {
  try {
    const newCounter = new Counter(req.body);
    await newCounter.save();
    res.status(201).json({ success: true, data: newCounter });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @desc    Update a counter
router.put("/update/:id", async (req, res) => {
  try {
    const updatedCounter = await Counter.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json({ success: true, data: updatedCounter });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @desc    Delete a counter
router.delete("/delete/:id", async (req, res) => {
  try {
    await Counter.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Counter deleted" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;