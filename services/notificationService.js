const Notification = require('../models/nosqlModels/notification');

class NotificationService {
  async getAllNotifications() {
    return await Notification.find();
  }

  async getNotificationById(id) {
    const notification = await Notification.findById(id);
    if (!notification) throw new Error('Notification not found');
    return notification;
  }

  async createNotification(data) {
    const notification = new Notification(data);
    return await notification.save();
  }

  async deleteNotification(id) {
    const notification = await Notification.findByIdAndDelete(id);
    if (!notification) throw new Error('Notification not found');
    return true;
  }

  async getNotificationsByUser(userId) {
    return await Notification.find({ userId }).sort({ createdAt: -1 });
  }
}

module.exports = new NotificationService();
