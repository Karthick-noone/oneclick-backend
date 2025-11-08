// controllers/notifications/notification.controller.js
const NotificationModel = require('../../models/notifications/notification.model');

const NotificationController = {
  async getAll(req, res) {
    try {
      const rows = await NotificationModel.getAll();
      res.json(rows);
    } catch (err) {
      console.error('[Notifications][getAll] Error:', err);
      res.status(500).json({ error: 'Failed to fetch notifications' });
    }
  },

  async markAsRead(req, res) {
    try {
      const { id } = req.params;
      const ok = await NotificationModel.markAsRead(id);
      if (!ok) return res.status(404).json({ error: 'Notification not found' });
      res.json({ success: true });
    } catch (err) {
      console.error('[Notifications][markAsRead] Error:', err);
      res.status(500).json({ error: 'Failed to mark as read' });
    }
  },

  async markAllAsRead(req, res) {
    try {
      const count = await NotificationModel.markAllAsRead();
      res.json({ success: true, updated: count });
    } catch (err) {
      console.error('[Notifications][markAllAsRead] Error:', err);
      res.status(500).json({ error: 'Failed to mark all as read' });
    }
  },

  async deleteOld(req, res) {
    try {
      const days = Number(req.query.days || 15);
      const deleted = await NotificationModel.deleteOlderThan(days);
      res.json({ success: true, deleted, days });
    } catch (err) {
      console.error('[Notifications][deleteOld] Error:', err);
      res.status(500).json({ error: 'Failed to delete old notifications' });
    }
  },

  async create(req, res) {
    try {
      const { message, type = 'general' } = req.body;
      if (!message || !message.trim()) {
        return res.status(400).json({ error: 'message is required' });
      }
      const created = await NotificationModel.create({ type, message: message.trim() });
      res.status(201).json(created);
    } catch (err) {
      console.error('[Notifications][create] Error:', err);
      res.status(500).json({ error: 'Failed to create notification' });
    }
  },
};

module.exports = NotificationController;
