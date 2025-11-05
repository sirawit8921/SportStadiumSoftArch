const User = require('../models/sqlModels/user');

class UserService {
  async getAllUsers() {
    return await User.findAll();
  }

  async getUserById(id) {
    const user = await User.findByPk(id);
    if (!user) throw new Error('User not found');
    return user;
  }

  async createUser(data) {
    return await User.create(data);
  }

  async updateUser(id, data) {
    const user = await User.findByPk(id);
    if (!user) throw new Error('User not found');
    return await user.update(data);
  }

  async deleteUser(id) {
    const user = await User.findByPk(id);
    if (!user) throw new Error('User not found');
    await user.destroy();
    return true;
  }
}

module.exports = new UserService();
