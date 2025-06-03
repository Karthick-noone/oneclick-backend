const db = require('../../config/db')

exports.insertOffer = (productId, start, end, price) => {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO oneclick_product_category (id, offer_start_time, offer_end_time, offer_price)
      VALUES (?, ?, ?, ?)
    `;
    db.query(sql, [productId, start, end, price], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

exports.updateOffer = (id, start, end, price) => {
  return new Promise((resolve, reject) => {
    const sql = `
      UPDATE oneclick_product_category
      SET offer_start_time = ?, offer_end_time = ?, offer_price = ?
      WHERE id = ?
    `;
    db.query(sql, [start, end, price, id], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

exports.deleteOffer = (id) => {
  return new Promise((resolve, reject) => {
    const sql = `
      UPDATE oneclick_product_category
      SET offer_start_time = NULL, offer_end_time = NULL, offer_price = NULL
      WHERE id = ?
    `;
    db.query(sql, [id], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

exports.fetchOffer = (id) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT *,
             DATE_FORMAT(offer_start_time, '%Y-%m-%dT%H:%i') AS offer_start_time,
             DATE_FORMAT(offer_end_time, '%Y-%m-%dT%H:%i') AS offer_end_time
      FROM oneclick_product_category
      WHERE id = ?
    `;
    db.query(sql, [id], (err, results) => {
      if (err) return reject(err);
      resolve(results[0]);
    });
  });
};
