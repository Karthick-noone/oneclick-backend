const db = require("../../config/db");

const Coupon = {
    findByCodeAndProductIds: (couponCode, productIds) => {
        return new Promise((resolve, reject) => {
          const normalizedCouponCode = couponCode;
          const productIdsArray = Array.isArray(productIds)
            ? productIds
            : [productIds];
    
          const sql = `
            SELECT coupon_id, coupon_code, expiry_date, discount_value 
            FROM oneclick_coupons 
            WHERE product_id IN (?) AND BINARY coupon_code = ?
          `;
    
          db.query(sql, [productIdsArray, normalizedCouponCode], (err, results) => {
            if (err) return reject(err);
            resolve(results);
          });
        });
      },
    
      
      findCommonCouponByCode: (couponCode) => {
        return new Promise((resolve, reject) => {
          const sql = `
            SELECT min_purchase_limit, value 
            FROM oneclick_common_coupon 
            WHERE BINARY name = ?
          `;
          db.query(sql, [couponCode], (err, results) => {
            if (err) return reject(err);
            resolve(results);
          });
        });
      },

  insertMany: (coupons) => {
    return new Promise((resolve, reject) => {
      const values = coupons.map((coupon) => [
        coupon.product_id,
        coupon.coupon_code,
        coupon.discount_value,
        coupon.expiry_date,
      ]);
      db.query(
        "INSERT INTO oneclick_coupons (product_id, coupon_code, discount_value, expiry_date) VALUES ?",
        [values],
        (err, results) => {
          if (err) return reject(err);
          resolve(results);
        }
      );
    });
  },

  getByProductId: (productId) => {
    return new Promise((resolve, reject) => {
      db.query(
        "SELECT coupon_id, coupon_code, discount_value, expiry_date FROM oneclick_coupons WHERE product_id = ? ORDER BY coupon_id DESC",
        [productId],
        (err, results) => {
          if (err) return reject(err);
          resolve(results);
        }
      );
    });
  },

  updateCoupon: (id, discountValue, couponCode, expiryDate) => {
    return new Promise((resolve, reject) => {
      db.query(
        "UPDATE oneclick_coupons SET discount_value = ?, coupon_code = ?, expiry_date = ? WHERE coupon_id = ?",
        [discountValue, couponCode, expiryDate, id],
        (err, results) => {
          if (err) return reject(err);
          resolve(results);
        }
      );
    });
  },

  deleteCoupon: (id) => {
    return new Promise((resolve, reject) => {
      db.query(
        "DELETE FROM oneclick_coupons WHERE coupon_id = ?",
        [id],
        (err, results) => {
          if (err) return reject(err);
          resolve(results);
        }
      );
    });
  },

  getAll: () => {
    return new Promise((resolve, reject) => {
      db.query(
        "SELECT * FROM oneclick_common_coupon ORDER BY id DESC",
        [],
        (err, results) => {
          if (err) return reject(err);
          resolve(results);
        }
      );
    });
  },

  addCoupon: (name, value, minPurchaseLimit) => {
    return new Promise((resolve, reject) => {
      db.query(
        "INSERT INTO oneclick_common_coupon (name, value, min_purchase_limit) VALUES (?, ?, ?)",
        [name, value, minPurchaseLimit],
        (err, results) => {
          if (err) return reject(err);
          resolve(results);
        }
      );
    });
  },

  updateCommonCoupon: (id, name, value, minPurchaseLimit, callback) => {
  const query = `
    UPDATE oneclick_common_coupon 
    SET min_purchase_limit = ?, name = ?, value = ? 
    WHERE id = ?
  `;
  db.query(query, [minPurchaseLimit, name, value, id], callback);
},

deleteCommonCoupon: (id, callback) => {
  const query = "DELETE FROM oneclick_common_coupon WHERE id = ?";
  db.query(query, [id], callback);
},


getProductById: (id, callback) => {
  const query = "SELECT * FROM oneclick_product_category WHERE id = ?";
  db.query(query, [id], callback);
},

insertCopiedProduct: (newProdId, newImageJson, id, callback) => {
  const query = `
    INSERT INTO oneclick_product_category 
    (prod_id, prod_name, category, subtitle, prod_features, actual_price, prod_price, deliverycharge, offer_label, prod_img, productStatus)
    SELECT ?, prod_name, category, subtitle, prod_features, actual_price, prod_price, deliverycharge, offer_label, ?, productStatus
    FROM oneclick_product_category 
    WHERE id = ?
  `;
  db.query(query, [newProdId, newImageJson, id], callback);
}
};


module.exports = Coupon;

