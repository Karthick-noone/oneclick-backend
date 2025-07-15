const db = require("../../config/db"); // adjust path as needed

exports.fetchOrdersWithDetails = () => {
  const query = `
    SELECT o.*, 
          oi.order_item_id, 
          oi.quantity, 
          oi.price, 
          oi.is_buy_together, 
          p.product_id, 
          p.name AS product_name, 
          p.description AS product_description,
          o.shipping_address 
    FROM oneclick_orders o
    LEFT JOIN oneclick_order_items oi ON o.order_id = oi.order_id
    LEFT JOIN oneclick_products p ON oi.product_id = p.product_id
    ORDER BY o.order_id DESC
  `;
  return new Promise((resolve, reject) => {
    db.query(query, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

exports.fetchUsersByIds = (userIds) => {
  const query = `SELECT user_id, username FROM oneclick_users WHERE user_id IN (?)`;
  return new Promise((resolve, reject) => {
    db.query(query, [userIds], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};


exports.deleteOrderById = (orderId) => {
  return new Promise((resolve, reject) => {
    // console.log(`[DELETE_ORDER] Deleting order and related data for order ID: ${orderId}`);

    // Step 1: Get product IDs for the order
    const getProductIdsSql = `SELECT product_id FROM oneclick_order_items WHERE order_id = ?`;
    db.query(getProductIdsSql, [orderId], (err, productResults) => {
      if (err) {
        // console.error("[DELETE_ORDER] Failed to fetch product IDs:", err);
        return reject(err);
      }

      const productIds = productResults.map(row => row.product_id);

      // console.log(`[DELETE_ORDER] Found ${productIds.length} products to delete:`, productIds);

      // Step 2: Delete products (if any)
      if (productIds.length > 0) {
        const deleteProductsSql = `DELETE FROM oneclick_products WHERE product_id IN (?)`;
        db.query(deleteProductsSql, [productIds], (err, productsResult) => {
          if (err) {
            // console.error("[DELETE_ORDER] Failed to delete products:", err);
            return reject(err);
          }
          // console.log(`[DELETE_ORDER] Deleted ${productsResult.affectedRows} rows from oneclick_products`);

          // Step 3: Delete order items
          const deleteOrderItemsSql = `DELETE FROM oneclick_order_items WHERE order_id = ?`;
          db.query(deleteOrderItemsSql, [orderId], (err, orderItemsResult) => {
            if (err) {
              // console.error("[DELETE_ORDER] Failed to delete order items:", err);
              return reject(err);
            }
            // console.log(`[DELETE_ORDER] Deleted ${orderItemsResult.affectedRows} rows from oneclick_order_items`);

            // Step 4: Delete the order itself
            const deleteOrderSql = `DELETE FROM oneclick_orders WHERE unique_id = ?`;
            db.query(deleteOrderSql, [orderId], (err, orderResult) => {
              if (err) {
                // console.error("[DELETE_ORDER] Failed to delete order:", err);
                return reject(err);
              }
              // console.log(`[DELETE_ORDER] Deleted ${orderResult.affectedRows} rows from oneclick_orders`);

              resolve({
                message: "Order and all related data deleted successfully",
                productsDeleted: productsResult.affectedRows,
                orderItemsDeleted: orderItemsResult.affectedRows,
                orderDeleted: orderResult.affectedRows
              });
            });
          });
        });
      } else {
        // console.log("[DELETE_ORDER] No products found for this order");

        // If no products, just delete order items and the order
        const deleteOrderItemsSql = `DELETE FROM oneclick_order_items WHERE order_id = ?`;
        db.query(deleteOrderItemsSql, [orderId], (err, orderItemsResult) => {
          if (err) {
            // console.error("[DELETE_ORDER] Failed to delete order items:", err);
            return reject(err);
          }
          // console.log(`[DELETE_ORDER] Deleted ${orderItemsResult.affectedRows} rows from oneclick_order_items`);

          const deleteOrderSql = `DELETE FROM oneclick_orders WHERE unique_id = ?`;
          db.query(deleteOrderSql, [orderId], (err, orderResult) => {
            if (err) {
              // console.error("[DELETE_ORDER] Failed to delete order:", err);
              return reject(err);
            }
            // console.log(`[DELETE_ORDER] Deleted ${orderResult.affectedRows} rows from oneclick_orders`);

            resolve({
              message: "Order and related data deleted successfully (no products found)",
              productsDeleted: 0,
              orderItemsDeleted: orderItemsResult.affectedRows,
              orderDeleted: orderResult.affectedRows
            });
          });
        });
      }
    });
  });
};



exports.updateOrderStatus = (orderId, status) => {
  const query = "UPDATE oneclick_orders SET status = ? WHERE unique_id = ?";
  return new Promise((resolve, reject) => {
    db.query(query, [status, orderId], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

exports.getOrderStatus = (orderId) => {
  const query = `SELECT unique_id, payment_method, payment_id, delivery_status, delivery_date, order_date FROM oneclick_orders WHERE unique_id = ?`;
  return new Promise((resolve, reject) => {
    db.query(query, [orderId], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

exports.updateDeliveryStatus = (orderId, deliveryStatus, deliveryDate) => {
  // If deliveryStatus is 'Delivered', use current date
  const finalDeliveryDate =
    deliveryStatus === "Delivered"
      ? new Date().toISOString().slice(0, 19).replace("T", " ") // Format: YYYY-MM-DD HH:MM:SS
      : deliveryDate;

  const query = `
    UPDATE oneclick_orders 
    SET delivery_status = ?, delivery_date = ? 
    WHERE unique_id = ?
  `;

  return new Promise((resolve, reject) => {
    db.query(query, [deliveryStatus, finalDeliveryDate, orderId], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};
