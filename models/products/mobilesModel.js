const db = require("../../config/db");

exports.insertMobileProduct = (data, cb) => {
  const sql = `
    INSERT INTO oneclick_product_category 
    (productStatus, deliverycharge, subtitle, offer_label, actual_price, category, prod_id, prod_name, prod_price, prod_img, status) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(sql, [
    data.productStatus, data.deliverycharge, data.subtitle, data.label, data.actual_price,
    "Mobiles", data.prod_id, data.name, data.price, JSON.stringify(data.images), "available"
  ], cb);
};

exports.insertMobileFeatures = (data, cb) => {
  const sql = `
    INSERT INTO oneclick_mobile_features 
    (prod_id, memory, storage, processor, camera, display, battery, os, network, others) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(sql, [
    data.prod_id, data.memory, data.storage, data.processor,
    data.camera, data.display, data.battery, data.os, data.network, data.others
  ], cb);
};

exports.fetchProductImages = (id, cb) => {
  db.query("SELECT prod_img FROM oneclick_product_category WHERE id = ?", [id], cb);
};

exports.updateProductImages = (id, images, cb) => {
  db.query("UPDATE oneclick_product_category SET prod_img = ? WHERE id = ?", [JSON.stringify(images), id], cb);
};

exports.fetchMobilesFromDB = (cb) => {
  const sql = `
    SELECT p.*, f.memory, f.storage, f.processor, f.camera, f.display, f.battery, f.os, f.network, f.others 
    FROM oneclick_product_category p 
    LEFT JOIN oneclick_mobile_features f ON p.prod_id = f.prod_id 
    WHERE p.category = 'mobiles' AND productStatus = 'approved'
    ORDER BY p.id DESC`;
  db.query(sql, cb);
};

exports.checkProductExists = (prod_id, cb) => {
  db.query("SELECT * FROM oneclick_product_category WHERE prod_id = ?", [prod_id], cb);
};

exports.insertProduct = (prod_id, data, cb) => {
  const sql = `
    INSERT INTO oneclick_product_category 
    (prod_id, productStatus, deliverycharge, subtitle, actual_price, offer_label, prod_name, prod_price, status) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  db.query(sql, [
    prod_id, data.productStatus, data.deliverycharge, data.subtitle,
    data.actual_price, data.label, data.name, data.price, data.status
  ], cb);
};

exports.updateProduct = (prod_id, data, cb) => {
  const sql = `
    UPDATE oneclick_product_category 
    SET productStatus = ?, deliverycharge = ?, subtitle = ?, actual_price = ?, offer_label = ?, prod_name = ?, prod_price = ?, status = ?
    WHERE prod_id = ?`;
  db.query(sql, [
    data.productStatus, data.deliverycharge, data.subtitle,
    data.actual_price, data.label, data.name, data.price, data.status,
    prod_id
  ], cb);
};

exports.checkFeaturesExists = (prod_id, cb) => {
  db.query("SELECT * FROM oneclick_mobile_features WHERE prod_id = ?", [prod_id], cb);
};

exports.updateFeatures = (prod_id, data, cb) => {
  const sql = `
    UPDATE oneclick_mobile_features 
    SET memory = ?, storage = ?, processor = ?, camera = ?, display = ?, battery = ?, os = ?, network = ?, others = ?
    WHERE prod_id = ?`;
  db.query(sql, [
    data.memory, data.storage, data.processor, data.camera,
    data.display, data.battery, data.os, data.network, data.others,
    prod_id
  ], cb);
};

exports.fetchProductImage = (id, cb) => {
  db.query("SELECT prod_img FROM oneclick_product_category WHERE id = ?", [id], cb);
};

exports.deleteProduct = (id, cb) => {
  db.query("DELETE FROM oneclick_product_category WHERE id = ?", [id], cb);
};


exports.fetchMobiles = (cb) => {
    const sql = `
      SELECT 
        p.prod_id, 
        p.prod_name,
        p.id, 
        p.category, 
        p.prod_price, 
        p.actual_price, 
        p.offer_price, 
        p.offer_start_time, 
        p.offer_end_time, 
        p.prod_img, 
        p.status,
        p.productStatus,
        p.deliverycharge,
        p.subtitle,
        p.offer_label,
        f.memory, 
        f.storage, 
        f.processor, 
        f.camera, 
        f.display, 
        f.battery, 
        f.os, 
        f.network, 
        f.others
      FROM oneclick_product_category p
      LEFT JOIN oneclick_mobile_features f ON p.prod_id = f.prod_id
      WHERE p.category = 'mobiles'
      ORDER BY p.id DESC
    `;
  
    db.query(sql, cb);
  };