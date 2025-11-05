const SportStadium = require('../models/sqlModels/sportstadium');

class SportStadiumService {
  async getAllStadiums() {
    return await SportStadium.findAll();
  }

  async getStadiumById(id) {
    const stadium = await SportStadium.findByPk(id);
    if (!stadium) throw new Error('Stadium not found');
    return stadium;
  }

  async createStadium(data) {
    return await SportStadium.create(data);
  }

  async updateStadium(id, data) {
    const stadium = await SportStadium.findByPk(id);
    if (!stadium) throw new Error('Stadium not found');
    return await stadium.update(data);
  }

  async deleteStadium(id) {
    const stadium = await SportStadium.findByPk(id);
    if (!stadium) throw new Error('Stadium not found');
    await stadium.destroy();
    return true;
  }
}

module.exports = new SportStadiumService();
