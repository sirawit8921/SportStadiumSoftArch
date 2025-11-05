const express = require("express");
const router = express.Router();
const teamController = require("../controllers/teamController");

// Create a new team
router.post("/", teamController.createTeam);

// Get all teams
router.get("/", teamController.getTeams);

// Get team by ID
router.get("/:id", teamController.getTeamById);

// Update team by ID
router.put("/:id", teamController.updateTeam);

// Delete team by ID
router.delete("/:id", teamController.deleteTeam);

// Join team
router.patch("/:id/join", teamController.joinTeam);

// Unjoin team
router.patch("/:id/unjoin", teamController.unjoinTeam);

module.exports = router;
