const { Team } = require("../models/sqlModels");
const formatDate = require("../utils/formatDate");
const { sendToQueue } = require("../utils/rabbitmq");

const formatTeam = (t) => ({
  id: t.id,
  teamName: t.teamName,
  expectedNumberOfPlayers: t.expectedNumberOfPlayers,
  currentNumberOfPlayers: t.currentNumberOfPlayers,
  members: t.members,
  createdAt: formatDate(t.createdAt),
});

// CREATE TEAM
exports.createTeam = async (req, res) => {
  try {
    const team = await Team.create({
      teamName: req.body.teamName,
      expectedNumberOfPlayers: req.body.expectedNumberOfPlayers,
      currentNumberOfPlayers: req.body.currentNumberOfPlayers || 0,
      members: req.body.members || [],
    });

    await sendToQueue("teamQueue", {
      event: "team_created",
      teamId: team.id,
      timestamp: new Date(),
    });

    res.status(201).json(formatTeam(team));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// GET ALL TEAMS
exports.getTeams = async (req, res) => {
  try {
    const teams = await Team.findAll();
    res.json(teams.map(formatTeam));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET ONE TEAM
exports.getTeamById = async (req, res) => {
  try {
    const team = await Team.findByPk(req.params.id);
    if (!team) return res.status(404).json({ message: "Team not found" });
    res.json(formatTeam(team));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE TEAM
exports.updateTeam = async (req, res) => {
  try {
    const team = await Team.findByPk(req.params.id);
    if (!team) return res.status(404).json({ message: "Team not found" });

    await team.update(req.body);

    res.json({
      message: "Team updated successfully",
      team: formatTeam(team),
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE TEAM
exports.deleteTeam = async (req, res) => {
  try {
    const deleted = await Team.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ message: "Team not found" });
    res.json({ message: "Team deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// JOIN TEAM
exports.joinTeam = async (req, res) => {
  try {
    const team = await Team.findByPk(req.params.id);
    if (!team) return res.status(404).json({ message: "Team not found" });

    const members = team.members || [];
    if (!members.includes(req.body.userId)) {
      members.push(req.body.userId);
      team.currentNumberOfPlayers = members.length;
      team.members = members;
      await team.save();

      await sendToQueue("teamQueue", {
        event: "team_joined",
        teamId: team.id,
        userId: req.body.userId,
        timestamp: new Date(),
      });
    }

    res.json(formatTeam(team));
  } catch (err) {
    console.error("Join team failed:", err);
    res.status(400).json({ message: err.message });
  }
};

// UNJOIN TEAM
exports.unjoinTeam = async (req, res) => {
  try {
    const team = await Team.findByPk(req.params.id);
    if (!team) return res.status(404).json({ message: "Team not found" });

    const members = (team.members || []).filter(
      (m) => m !== req.body.userId
    );
    team.members = members;
    team.currentNumberOfPlayers = members.length;
    await team.save();

    await sendToQueue("teamQueue", {
      event: "team_left",
      teamId: team.id,
      userId: req.body.userId,
      timestamp: new Date(),
    });

    res.json(formatTeam(team));
  } catch (err) {
    console.error("Unjoin team failed:", err);
    res.status(400).json({ message: err.message });
  }
};
