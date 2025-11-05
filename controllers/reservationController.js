const Reservation = require("../models/nosqlModels/reservation"); // MongoDB (Mongoose)
const { SportStadium } = require("../models/sqlModels"); // MySQL (Sequelize)
const moment = require("moment-timezone");
const formatDate = require("../utils/formatDate");
const { sendToQueue } = require("../utils/rabbitmq");

// Create reservation and get sport stadium
exports.createReservation = async (req, res) => {
  try {
    const { userId, sportstadiumName, sportType, timeSlot } = req.body;

    // Get SportStadium ftom MySQL
    const stadium = await SportStadium.findOne({
      where: { sportstadiumName },
    });

    if (!stadium) {
      return res.status(404).json({ message: "Sport stadium not found" });
    }

    const start = moment.tz(timeSlot.start, "Asia/Bangkok").toDate();
    const end = moment.tz(timeSlot.end, "Asia/Bangkok").toDate();

    // Create reservation in MongoDB
    const reservation = new Reservation({
      userId,
      stadiumId: stadium.id,
      sportstadiumName: stadium.sportstadiumName,
      sportType,
      timeSlot: { start, end },
      status: "reserved",
    });

    await reservation.save();

    // Sent event to RabbitMQ
    await sendToQueue("reservationQueue", {
      event: "reservation_created",
      reservationId: reservation._id,
      userId,
      stadiumId: stadium.id,
      stadiumName: stadium.sportstadiumName,
      sportType,
      start,
      end,
      createdAt: new Date(),
    });

    res.status(201).json({
      message: "Reservation created successfully",
      data: reservation,
    });
  } catch (err) {
    console.error("Error creating reservation:", err.message);
    res.status(400).json({ message: err.message });
  }
};

// Get all reservations
exports.getReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find();
    if (!reservations.length)
      return res.status(200).json({ message: "No reservations found" });

    res.json(
      reservations.map((r) => ({
        id: r._id,
        userId: r.userId,
        stadiumId: r.stadiumId,
        sportstadiumName: r.sportstadiumName,
        sportType: r.sportType,
        timeSlot: r.timeSlot,
        status: r.status,
        createdAt: formatDate(r.createdAt),
      }))
    );
  } catch (err) {
    console.error("Error fetching reservations:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// Get oon reservation
exports.getReservationById = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation)
      return res.status(404).json({ message: "Reservation not found" });

    res.json(reservation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// update reservation
exports.updateReservation = async (req, res) => {
  try {
    const { sportstadiumName, timeSlot, status } = req.body;
    const updateData = { ...req.body };

    // ถ้ามีเปลี่ยนชื่อสนาม → อัปเดต stadiumId ด้วย
    if (sportstadiumName) {
      const stadium = await SportStadium.findOne({
        where: { sportstadiumName },
      });
      if (!stadium)
        return res.status(404).json({ message: "Sport stadium not found" });

      updateData.stadiumId = stadium.id;
    }

    // ถ้ามีเปลี่ยนเวลา → แปลงโซนเวลา
    if (timeSlot) {
      updateData.timeSlot = {
        start: moment.tz(timeSlot.start, "Asia/Bangkok").toDate(),
        end: moment.tz(timeSlot.end, "Asia/Bangkok").toDate(),
      };
    }

    const updated = await Reservation.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updated)
      return res.status(404).json({ message: "Reservation not found" });

    res.json({ message: "Reservation updated successfully", data: updated });
  } catch (err) {
    console.error("Error updating reservation:", err.message);
    res.status(400).json({ message: err.message });
  }
};

// Cancel reservation
exports.cancelReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      { status: "cancelled" },
      { new: true }
    );
    if (!reservation)
      return res.status(404).json({ message: "Reservation not found" });

    await sendToQueue("reservationQueue", {
      event: "reservation_cancelled",
      reservationId: reservation._id,
      userId: reservation.userId,
      timestamp: new Date(),
    });

    res.json({
      message: "Reservation cancelled successfully",
      data: reservation,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Check in reservation
exports.checkInReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      { status: "checked-in" },
      { new: true }
    );
    if (!reservation)
      return res.status(404).json({ message: "Reservation not found" });

    await sendToQueue("reservationQueue", {
      event: "reservation_checked_in",
      reservationId: reservation._id,
      userId: reservation.userId,
      timestamp: new Date(),
    });

    res.json({
      message: "Reservation checked in successfully",
      data: reservation,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete reservation
exports.deleteReservation = async (req, res) => {
  try {
    const deleted = await Reservation.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Reservation not found" });

    await sendToQueue("reservationQueue", {
      event: "reservation_deleted",
      reservationId: req.params.id,
      timestamp: new Date(),
    });

    res.json({ message: "Reservation deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
