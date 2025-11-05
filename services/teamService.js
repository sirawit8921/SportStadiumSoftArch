const Team = require('../models/sqlModels/team');

class TeamService {
  async getAllTeams() {
    return await Team.find();
  }

  async getTeamById(id) {
    const team = await Team.findById(id);
    if (!team) throw new Error('Team not found');
    return team;
  }

  async createTeam(data) {
    const team = new Team(data);
    return await team.save();
  }

  async updateTeam(id, data) {
    const team = await Team.findByIdAndUpdate(id, data, { new: true });
    if (!team) throw new Error('Team not found');
    return team;
  }

  async deleteTeam(id) {
    const team = await Team.findByIdAndDelete(id);
    if (!team) throw new Error('Team not found');
    return true;
  }
}

module.exports = new TeamService();
