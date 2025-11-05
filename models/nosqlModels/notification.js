const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
  reservationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Reservation",
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "sent", "failed"],
    default: "pending"
  },
  notificationTime: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Notification", NotificationSchema);
