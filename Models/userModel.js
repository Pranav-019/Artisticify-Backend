const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  role: {
    type: String,
    required: true,
    enum: ["CRM", "ADMIN", "WEB", "UI/UX", "SEO", "SOCIAL MEDIA"],
  },
  userID: {
    type: String,
    required: true,
    unique: true, // Ensures there are no duplicate IDs
  },
  password: {
    type: String,
    required: true,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
