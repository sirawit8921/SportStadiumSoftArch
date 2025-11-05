const Reservation = require('../models/nosqlModels/reservation');

class ReservationService {
  async getAllReservations() {
    return await Reservation.find();
  }

  async getReservationById(id) {
    const reservation = await Reservation.findById(id);
    if (!reservation) throw new Error('Reservation not found');
    return reservation;
  }

  async createReservation(data) {
    const reservation = new Reservation(data);
    return await reservation.save();
  }

  async updateReservation(id, data) {
    const reservation = await Reservation.findByIdAndUpdate(id, data, { new: true });
    if (!reservation) throw new Error('Reservation not found');
    return reservation;
  }

  async deleteReservation(id) {
    const reservation = await Reservation.findByIdAndDelete(id);
    if (!reservation) throw new Error('Reservation not found');
    return true;
  }

  async getReservationsByUser(userId) {
    return await Reservation.find({ userId });
  }

  async getReservationsByStadium(stadiumId) {
    return await Reservation.find({ stadiumId });
  }
}

module.exports = new ReservationService();
