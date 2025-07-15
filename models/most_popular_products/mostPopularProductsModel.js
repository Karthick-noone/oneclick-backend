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
      Secondhandproducts: 10,
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
          let query;

          if (['Mobiles', 'Computers', 'Secondhandproducts'].includes(category)) {
            query = `
    SELECT 
      p.*, 
      m.memory AS memory,
      m.storage AS storage,
      m.processor AS processor,
      m.camera AS camera,
      m.display AS display,
      m.battery AS battery,
      m.os AS os,
      m.network AS network,
      m.others AS others
    FROM oneclick_product_category p
    LEFT JOIN oneclick_mobile_features m
    ON p.prod_id = m.prod_id
    WHERE p.category = ? AND p.productStatus = 'approved'
    ORDER BY p.id DESC LIMIT ?`;
          } else {
            query = `
    SELECT * FROM oneclick_product_category
    WHERE category = ? AND productStatus = 'approved'
    ORDER BY id DESC LIMIT ?`;
          }


          // console.log(`[FETCH_PRODUCTS] Running Query for ${category}:`, query);

          db.query(query, [category, limit], (err, results) => {
            if (err) {
              console.error(`[FETCH_PRODUCTS] Error fetching ${category}:`, err);
              return reject(err);
            }

            // console.log(
            //   `[FETCH_PRODUCTS] Fetched ${results.length} items for category: ${category}`
            // );
            resolve(results);
          });
        })
    );

    Promise.all(promises)
  .then((results) => {
    const combined = results.flat().map(product => ({
      ...product,
      category: product.category, // Ensure category info stays
    }));
    callback(null, combined);
  })
  .catch((err) => callback(err));
  },

};


module.exports = MostPopularProducts;
