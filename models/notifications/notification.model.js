// models/notifications/notification.model.js
const db = require('../../config/db'); // adjust path if needed

const NotificationModel = {
getAll() {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT id, type, message, is_read, created_at
      FROM oneclick_notifications
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      ORDER BY created_at DESC
    `;

    db.query(sql, (err, rows) => {
      if (err) {
        console.error('[Notifications][Model][getAll] DB Error:', err);
        return reject(err);
      }
      resolve(rows);
    });
  });
},


  markAsRead(id) {
    return new Promise((resolve, reject) => {
      const sql = `UPDATE oneclick_notifications SET is_read = 1 WHERE id = ?`;
      db.query(sql, [id], (err, res) => {
        if (err) {
          console.error('[Notifications][Model][markAsRead] DB Error:', err);
          return reject(err);
        }
        resolve(res.affectedRows > 0);
      });
    });
  },

  markAllAsRead() {
    return new Promise((resolve, reject) => {
      const sql = `UPDATE oneclick_notifications SET is_read = 1 WHERE is_read = 0`;
      db.query(sql, (err, res) => {
        if (err) {
          console.error('[Notifications][Model][markAllAsRead] DB Error:', err);
          return reject(err);
        }
        resolve(res.affectedRows || 0);
      });
    });
  },

  deleteOlderThan(days = 15) {
    return new Promise((resolve, reject) => {
      const sql = `
        DELETE FROM oneclick_notifications
        WHERE created_at < (NOW() - INTERVAL ? DAY)
      `;
      db.query(sql, [days], (err, res) => {
        if (err) {
          console.error('[Notifications][Model][deleteOlderThan] DB Error:', err);
          return reject(err);
        }
        resolve(res.affectedRows || 0);
      });
    });
  },

  create({ type = 'general', message }) {
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO oneclick_notifications (type, message, is_read, created_at)
        VALUES (?, ?, 0, NOW())
      `;
      db.query(sql, [type, message], (err, res) => {
        if (err) {
          console.error('[Notifications][Model][create] DB Error:', err);
          return reject(err);
        }
        resolve({ id: res.insertId, type, message, is_read: 0 });
      });
    });
  },
};

module.exports = NotificationModel;
