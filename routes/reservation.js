const express = require("express");
const router = express.Router();
const reservationController = require("../controllers/reservationController");

// Create Reservation
router.post("/", reservationController.createReservation);

// Get All Reservations
router.get("/", reservationController.getReservations);

// Get Reservation by ID
router.get("/:id", reservationController.getReservationById);

// Update Reservation
router.put("/:id", reservationController.updateReservation);

// Cancel Reservation
router.patch("/:id/cancel", reservationController.cancelReservation);

// Check-in Reservation
router.patch("/:id/checkin", reservationController.checkInReservation);

// Delete Reservation
router.delete("/:id", reservationController.deleteReservation);

module.exports = router;
