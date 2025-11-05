const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");

// Create notification
router.post("/", notificationController.createNotification);

// Get all notifications
router.get("/", notificationController.getNotifications);

// Get notification by ID
router.get("/:id", notificationController.getNotificationById);

// Update notification by ID
router.put("/:id", notificationController.updateNotification);

// Delete notification by ID
router.delete("/:id", notificationController.deleteNotification);

module.exports = router;
