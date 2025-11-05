const mongoose = require("mongoose");
const Team = require("../sqlModels/team");
const Reservation = require("./reservation");

mongoose.connect(process.env.DATABASE_URL);

module.exports = { Team, Reservation };
