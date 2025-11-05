const express = require("express");
const router = express.Router();
const sportstadiumController = require("../controllers/sportstadiumController");

// Get all stadiums
router.get("/", sportstadiumController.getSportStadiums);

// Get a stadium by ID
router.get("/:id", sportstadiumController.getSportStadiumById);

// Create stadium
router.post("/", sportstadiumController.createSportStadium);

// Update a stadium by ID
router.patch("/:id", sportstadiumController.updateSportStadium);

// Delete a stadium by ID
router.delete("/:id", sportstadiumController.deleteSportStadium);

module.exports = router;
