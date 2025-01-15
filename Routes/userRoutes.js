const express = require("express");
const User = require("../Models/userModel");
const { generateRandomPassword } = require("../utils");

const router = express.Router();

// Create a new user
router.post("/createUser", async (req, res) => {
  const { role } = req.body;

  if (!role || !["CRM", "ADMIN", "WEB", "UI/UX", "SEO", "SOCIAL MEDIA"].includes(role)) {
    return res.status(400).json({ error: "Invalid role provided" });
  }

  // Generate random password
  const password = generateRandomPassword(12);

  try {
    // Check if a user with the same role already exists
    const existingUser = await User.findOne({ userID: role });
    if (existingUser) {
      return res.status(400).json({ error: `User with role '${role}' already exists` });
    }

    // Create a new user with the role as the userID
    const newUser = new User({
      role: role,
      userID: role, // Use role as userID
      password: password,
    });

    await newUser.save();

    res.status(201).json({
      message: "User created successfully",
      userID: newUser.userID,
      password: password, // In a real-world app, avoid sending passwords in responses.
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to create user", details: error.message });
  }
});

// Endpoint to get user details
router.post("/getUser/:userId", async (req, res) => {
  const { userId } = req.params;
  const { password } = req.body;  // Get the password from the request body

  try {
    const user = await User.findOne({ userID: userId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Directly compare the plain-text passwords
    if (user.password === password) {
      res.status(200).json(user); // Passwords match, return the user data
    } else {
      res.status(401).json({ error: "Invalid credentials" }); // Passwords don't match
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
