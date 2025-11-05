const Notification = require("../models/nosqlModels/notification");
const Reservation = require("../models/nosqlModels/reservation");
const formatDate = require("../utils/formatDate");
const moment = require("moment-timezone");


const formatNotification = (n, reservation) => ({
  _id: n._id,
  reservation: {
    _id: reservation._id,
    stadium: reservation.sportstadiumName,
    sportType: reservation.sportType,
    timeSlot: {
      start: formatDate(reservation.timeSlot.start),
      end: formatDate(reservation.timeSlot.end),
    },
  },
  status: n.status,
  createdAt: formatDate(n.createdAt),
});

// Create Notification
exports.createNotification = async (req, res) => {
  try {
    const { reservationId } = req.body;

    const reservation = await Reservation.findById(reservationId);
    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    // ใช้เวลาจากการจองเป็นเวลาการแจ้งเตือน
    const notification = new Notification({
      reservationId,
      notificationTime: reservation.timeSlot.start,
    });

    await notification.save();
    res.status(201).json(formatNotification(notification, reservation));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get All Notifications
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().populate("reservationId");
    res.json(
      notifications.map((n) => formatNotification(n, n.reservationId))
    );
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Notification by ID
exports.getNotificationById = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id).populate("reservationId");
    if (!notification) return res.status(404).json({ message: "Notification not found" });
    res.json(formatNotification(notification, notification.reservationId));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Notification
exports.updateNotification = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate("reservationId");

    if (!notification) return res.status(404).json({ message: "Notification not found" });
    res.json(formatNotification(notification, notification.reservationId));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete Notification
exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);
    if (!notification) return res.status(404).json({ message: "Notification not found" });
    res.json({ message: "Notification deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
