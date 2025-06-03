const db = require("../../config/db");

exports.fetchProductImages = (productId, callback) => {
  const sql = "SELECT prod_img FROM oneclick_product_category WHERE id = ?";
  db.query(sql, [productId], callback);
};

exports.updateProductImages = (productId, images, callback) => {
  const sql = "UPDATE oneclick_product_category SET prod_img = ? WHERE id = ?";
  db.query(sql, [JSON.stringify(images), productId], callback);
};

exports.insertComputerProduct = (data, callback) => {
  const sql = `
    INSERT INTO oneclick_product_category 
    (productStatus, deliverycharge, subtitle, offer_label, actual_price, category, prod_id, prod_name, prod_price, prod_img, status) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  db.query(
    sql,
    [
      data.productStatus,
      data.deliverycharge,
      data.subtitle,
      data.label,
      data.actual_price,
      "Computers",
      data.prod_id,
      data.name,
      data.price,
      JSON.stringify(data.images),
      "available",
    ],
    callback
  );
};

exports.insertComputerFeatures = (data, callback) => {
  const sql = `
    INSERT INTO oneclick_mobile_features 
    (prod_id, memory, storage, processor, display, os, others) 
    VALUES (?, ?, ?, ?, ?, ?, ?)`;
  db.query(
    sql,
    [data.prod_id, data.memory, data.storage, data.processor, data.display, data.os, data.others],
    callback
  );
};

exports.fetchAllComputers = (callback) => {
  const sql = `
    SELECT 
      p.prod_id, p.prod_name, p.id, p.category, p.prod_price, p.actual_price, 
      p.offer_price, p.offer_start_time, p.offer_end_time, p.prod_img, p.status,
      p.productStatus, p.deliverycharge, p.subtitle, p.offer_label,
      f.memory, f.storage, f.processor, f.display, f.os, f.others
    FROM oneclick_product_category p
    LEFT JOIN oneclick_mobile_features f ON p.prod_id = f.prod_id
    WHERE p.category = 'computers'
    ORDER BY p.id DESC
  `;
  db.query(sql, callback);
};


exports.checkProductExists = (productId, cb) => {
    const sql = "SELECT * FROM oneclick_product_category WHERE prod_id = ?";
    db.query(sql, [productId], cb);
  };
  
  exports.insertProduct = (productId, data, cb) => {
    const sql = `
      INSERT INTO oneclick_product_category 
      (prod_id, productStatus, deliverycharge, subtitle, actual_price, offer_label, prod_name, prod_price, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [
      productId,
      data.productStatus || "",
      data.deliverycharge || 0,
      data.subtitle || "",
      data.actual_price || 0,
      data.label || "",
      data.name || "",
      data.price || 0,
      data.status || "",
    ];
    db.query(sql, values, cb);
  };
  
  exports.updateProduct = (productId, data, cb) => {
    const sql = `
      UPDATE oneclick_product_category 
      SET productStatus = ?, deliverycharge = ?, subtitle = ?, actual_price = ?, offer_label = ?, prod_name = ?, prod_price = ?, status = ?
      WHERE prod_id = ?`;
    const values = [
      data.productStatus || "",
      data.deliverycharge || 0,
      data.subtitle || "",
      data.actual_price || 0,
      data.label || "",
      data.name || "",
      data.price || 0,
      data.status || "",
      productId,
    ];
    db.query(sql, values, cb);
  };
  
  exports.checkFeaturesExists = (productId, cb) => {
    const sql = "SELECT * FROM oneclick_mobile_features WHERE prod_id = ?";
    db.query(sql, [productId], cb);
  };
  
  exports.insertFeatures = (productId, data, cb) => {
    const sql = `
      INSERT INTO oneclick_mobile_features 
      (prod_id, memory, storage, processor, display, os, others) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const values = [
      productId,
      data.memory || "",
      data.storage || "",
      data.processor || "",
      data.display || "",
      data.os || "",
      data.others || "",
    ];
    db.query(sql, values, cb);
  };
  
  exports.updateFeatures = (productId, data, cb) => {
    const sql = `
      UPDATE oneclick_mobile_features 
      SET memory = ?, storage = ?, processor = ?, display = ?, os = ?, others = ?
      WHERE prod_id = ?`;
    const values = [
      data.memory || "",
      data.storage || "",
      data.processor || "",
      data.display || "",
      data.os || "",
      data.others || "",
      productId,
    ];
    db.query(sql, values, cb);
  };
  
  exports.fetchProductImage = (id, cb) => {
    const sql = "SELECT prod_img FROM oneclick_product_category WHERE id = ?";
    db.query(sql, [id], cb);
  };
  
  exports.deleteProduct = (id, cb) => {
    const sql = "DELETE FROM oneclick_product_category WHERE id = ?";
    db.query(sql, [id], cb);
  };