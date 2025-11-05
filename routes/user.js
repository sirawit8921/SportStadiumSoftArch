const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { protect, adminOnly } = require("../middlewares/authMiddleware");

// Register
router.post("/", userController.registerUser);

// Login
router.post("/login", userController.login);

// Get all users (admin only)
router.get("/", protect, adminOnly, userController.getAllUsers);

// Get user by ID
router.get("/:id", protect, userController.getUserById);

// Update user
router.patch("/:id", protect, adminOnly, userController.updateUser);

// Delete user
router.delete("/:id", protect, adminOnly, userController.deleteUser);

module.exports = router;
