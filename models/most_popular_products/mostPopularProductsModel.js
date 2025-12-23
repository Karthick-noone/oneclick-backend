const db = require('../../config/db');

const MostPopularProducts = {
  fetchMostPopular: (categories, callback) => {
    let query = `
      SELECT p.*, 
             CASE WHEN p.category IN ('Mobiles', 'Computers') THEN m.memory ELSE NULL END AS memory,
             CASE WHEN p.category IN ('Mobiles', 'Computers') THEN m.storage ELSE NULL END AS storage,
             CASE WHEN p.category IN ('Mobiles', 'Computers') THEN m.processor ELSE NULL END AS processor,
             CASE WHEN p.category IN ('Mobiles', 'Computers') THEN m.camera ELSE NULL END AS camera,
             CASE WHEN p.category IN ('Mobiles', 'Computers') THEN m.display ELSE NULL END AS display,
             CASE WHEN p.category IN ('Mobiles', 'Computers') THEN m.battery ELSE NULL END AS battery,
             CASE WHEN p.category IN ('Mobiles', 'Computers') THEN m.os ELSE NULL END AS os,
             CASE WHEN p.category IN ('Mobiles', 'Computers') THEN m.network ELSE NULL END AS network,
             CASE WHEN p.category IN ('Mobiles', 'Computers') THEN m.others ELSE NULL END AS others
      FROM oneclick_product_category p
      LEFT JOIN oneclick_mobile_features m 
        ON p.prod_id = m.prod_id AND p.category IN ('Mobiles', 'Computers')
      WHERE p.category IN (${categories.map(() => "?").join(",")}) 
        AND p.productStatus = 'approved' 
      ORDER BY p.category, p.id DESC`;

    db.query(query, categories, (err, products) => {
      if (err) return callback(err);

      // ⭐ APPLY MARGIN LOGIC HERE
      const marginSql = "SELECT * FROM oneclick_margin_settings ORDER BY range_from ASC";

      db.query(marginSql, (mErr, marginRules) => {
        if (mErr) {
          console.error("Margin Load Error:", mErr);
          return callback(null, products);
        }

        const updated = products.map(p => {
          const base = Number(p.prod_price);

          if (!p.branch_id) {
            return { ...p, prod_price: base }; // super admin → no margin
          }

          const rule = marginRules.find(r => base >= r.range_from && base <= r.range_to);

          return rule
            ? { ...p, prod_price: base + Number(rule.margin_amount) }
            : { ...p, prod_price: base };
        });

        callback(null, updated);
      });
    });
  },

  fetchProducts: (categories, callback) => {
    const categoryLimits = {
      Mobiles: 10, Computers: 10, Secondhandproducts: 10, CCTV: 10, Printers: 10,
      ComputerAccessories: 2, MobileAccessories: 2, CCTVAccessories: 2,
      PrinterAccessories: 2, Speakers: 5, Headphones: 5,
    };

    const promises = categories.map(
      (category) =>
        new Promise((resolve, reject) => {
          const limit = categoryLimits[category];
          let query;

          if (['Mobiles', 'Computers', 'Secondhandproducts'].includes(category)) {
            query = `
              SELECT p.*, m.memory, m.storage, m.processor, m.camera, m.display,
                     m.battery, m.os, m.network, m.others
              FROM oneclick_product_category p
              LEFT JOIN oneclick_mobile_features m ON p.prod_id = m.prod_id
              WHERE p.category = ? AND p.productStatus = 'approved'
              ORDER BY p.id DESC LIMIT ?`;
          } else {
            query = `
              SELECT *
              FROM oneclick_product_category
              WHERE category = ? AND productStatus = 'approved'
              ORDER BY id DESC LIMIT ?`;
          }

          db.query(query, [category, limit], (err, results) => {
            if (err) return reject(err);
            resolve(results);
          });
        })
    );

    Promise.all(promises)
      .then(results => {
        const combined = results.flat().map(product => ({ ...product }));

        // ⭐ APPLY MARGIN LOGIC HERE
        const marginSql = "SELECT * FROM oneclick_margin_settings ORDER BY range_from ASC";

        db.query(marginSql, (err, marginRules) => {
          if (err) {
            console.error("Margin Load Error:", err);
            return callback(null, combined);
          }

          const updated = combined.map(p => {
            const base = Number(p.prod_price);

            if (!p.branch_id) return { ...p, prod_price: base };

            const rule = marginRules.find(r => base >= r.range_from && base <= r.range_to);

            return rule
              ? { ...p, prod_price: base + Number(rule.margin_amount) }
              : { ...p, prod_price: base };
          });

          callback(null, updated);
        });
      })
      .catch(err => callback(err));
  },
};

module.exports = MostPopularProducts;
