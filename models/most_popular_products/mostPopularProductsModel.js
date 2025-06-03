const db = require('../../config/db');

const MostPopularProducts = {
  fetchMostPopular: (categories, callback) => {
    let query = `
      SELECT p.*, 
             CASE 
               WHEN p.category IN ('Mobiles', 'Computers') THEN m.memory
               ELSE NULL 
             END AS memory,
             CASE 
               WHEN p.category IN ('Mobiles', 'Computers') THEN m.storage
               ELSE NULL 
             END AS storage,
             CASE 
               WHEN p.category IN ('Mobiles', 'Computers') THEN m.processor
               ELSE NULL 
             END AS processor,
             CASE 
               WHEN p.category IN ('Mobiles', 'Computers') THEN m.camera
               ELSE NULL 
             END AS camera,
             CASE 
               WHEN p.category IN ('Mobiles', 'Computers') THEN m.display
               ELSE NULL 
             END AS display,
             CASE 
               WHEN p.category IN ('Mobiles', 'Computers') THEN m.battery
               ELSE NULL 
             END AS battery,
             CASE 
               WHEN p.category IN ('Mobiles', 'Computers') THEN m.os
               ELSE NULL 
             END AS os,
             CASE 
               WHEN p.category IN ('Mobiles', 'Computers') THEN m.network
               ELSE NULL 
             END AS network,
             CASE 
               WHEN p.category IN ('Mobiles', 'Computers') THEN m.others
               ELSE NULL 
             END AS others
      FROM oneclick_product_category p
      LEFT JOIN oneclick_mobile_features m 
      ON p.prod_id = m.prod_id AND p.category IN ('Mobiles', 'Computers')
      WHERE p.category IN (${categories.map(() => "?").join(",")}) 
      AND p.productStatus = 'approved' 
      ORDER BY p.category, p.id DESC`;

    db.query(query, categories, callback);
  },

  fetchProducts: (categories, callback) => {
    const categoryLimits = {
      Mobiles: 10,
      Computers: 10,
      CCTV: 10,
      Printers: 10,
      ComputerAccessories: 2,
      MobileAccessories: 2,
      CCTVAccessories: 2,
      PrinterAccessories: 2,
      Speakers: 5,
      Headphones: 5,
    };

    const promises = categories.map(
      (category) =>
        new Promise((resolve, reject) => {
          const limit = categoryLimits[category];
          const query = `SELECT * FROM oneclick_product_category WHERE category = ? AND productStatus = 'approved' ORDER BY id DESC LIMIT ?`;

          db.query(query, [category, limit], (err, results) => {
            if (err) {
              return reject(err);
            }
            resolve(results);
          });
        })
    );

    Promise.all(promises)
      .then((results) => {
        callback(null, results);
      })
      .catch((err) => {
        callback(err);
      });
  }
};

module.exports = MostPopularProducts;
