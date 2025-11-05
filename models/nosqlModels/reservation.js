const mongoose = require("mongoose");

const ReservationSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  stadiumId: { type: String, required: true },
  sportstadiumName: { type: String, required: true },
  sportType: { type: String },
  timeSlot: {
    start: Date,
    end: Date,
  },
  status: { type: String, default: "reserved" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Reservation", ReservationSchema);
