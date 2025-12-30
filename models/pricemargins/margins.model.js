// models/pricemargins/margins.model.js

const db = require("../../config/db");

const MarginModel = {
    // Fetch all margin rules
    getAll: () => {
        return new Promise((resolve, reject) => {
            db.query("SELECT * FROM oneclick_margin_settings ORDER BY range_from ASC", (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    },

    // Add new margin rule
    add: ({ range_from, range_to, margin_amount }) => {
        const sql = `
  INSERT INTO oneclick_margin_settings 
  (range_from, range_to, margin_amount, created_at) 
  VALUES (?, ?, ?, NOW())
`;

        return new Promise((resolve, reject) => {
            db.query(sql, [range_from, range_to, margin_amount], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    },

    // Update margin rule
    update: (id, { range_from, range_to, margin_amount }) => {
        const sql = `
        UPDATE oneclick_margin_settings
        SET range_from = ?, range_to = ?, margin_amount = ?
        WHERE id = ?
    `;

        return new Promise((resolve, reject) => {
            db.query(
                sql,
                [range_from, range_to, margin_amount, id],
                (err, results) => {
                    if (err) return reject(err);
                    resolve(results);
                }
            );
        });
    },


    // Delete a margin rule
    delete: (id) => {
        return new Promise((resolve, reject) => {
            db.query("DELETE FROM oneclick_margin_settings WHERE id = ?", [id], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    },
};

module.exports = MarginModel;
