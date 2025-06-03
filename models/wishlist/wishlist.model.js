const db = require("../../config/db");

  const removeFromWishlist = (email, productId, callback) => {
    const query = "SELECT wishlist FROM oneclick_users WHERE email = ?";
  
    db.query(query, [email], (err, result) => {
      if (err) return callback(err);
      if (result.length === 0) return callback(new Error("User not found"));
  
      let wishlist = [];
      try {
        wishlist = result[0].wishlist ? JSON.parse(result[0].wishlist) : [];
      } catch (parseError) {
        return callback(new Error("Error parsing wishlist"));
      }
  
      // Remove the product from the wishlist
      wishlist = wishlist.filter(item => item !== productId);
      const updatedWishlist = JSON.stringify(wishlist);
  
      const updateQuery = "UPDATE oneclick_users SET wishlist = ? WHERE email = ?";
      db.query(updateQuery, [updatedWishlist, email], (updateErr, updateResult) => {
        if (updateErr) return callback(updateErr);
        if (updateResult.affectedRows === 0) return callback(new Error("No changes made, user or wishlist not found"));
  
        callback(null, "Item removed from wishlist successfully");
      });
    });
  };
  

  const updateUserWishlist = (email, username, prod_id, action, callback) => {
    const query = "SELECT wishlist FROM oneclick_users WHERE email = ? AND username = ?";
  
    db.query(query, [email, username], (err, result) => {
      if (err) return callback(err);
      if (result.length === 0) return callback(new Error("User not found"));
  
      let wishlist = result[0].wishlist || [];
      try {
        wishlist = JSON.parse(wishlist);
      } catch (parseError) {
        wishlist = [];
      }
  
      if (action === "add") {
        // Add prod_id to wishlist if not already present
        if (!wishlist.includes(prod_id)) {
          wishlist.push(prod_id);
        }
      } else if (action === "remove") {
        // Remove prod_id from wishlist
        wishlist = wishlist.filter(id => id !== prod_id);
      }
  
      const updatedWishlist = JSON.stringify(wishlist);
      const updateQuery = "UPDATE oneclick_users SET wishlist = ? WHERE email = ? AND username = ?";
  
      db.query(updateQuery, [updatedWishlist, email, username], (updateErr) => {
        if (updateErr) return callback(updateErr);
        callback(null, { success: true });
      });
    });
  };

// Function to fetch the wishlist from the database
const fetchWishlist = (email, username, callback) => {
    const query = "SELECT wishlist FROM oneclick_users WHERE email = ? AND username = ?";
    db.query(query, [email, username], (err, results) => {
      if (err) return callback(err);
      if (results.length === 0) return callback(new Error("User not found"));
  
      let wishlist = [];
      try {
        wishlist = JSON.parse(results[0].wishlist || "[]");
      } catch (error) {
        return callback(new Error("Failed to parse wishlist"));
      }
  
      // Sort wishlist in descending order
      wishlist = wishlist.sort((a, b) => b - a);
      return callback(null, wishlist);
    });
  };
  
  // Function to fetch wishlist products with details and features
  const fetchWishlistWithFeatures = (email, username, wishlist, callback) => {
    const placeholders = wishlist.map(() => "?").join(",");
    const query = `SELECT * FROM oneclick_product_category WHERE id IN (${placeholders})`;
  
    db.query(query, wishlist, (err, productResults) => {
      if (err) return callback(err);
  
      const featureProductIds = productResults
        .filter((product) => product.category === "Mobiles" || product.category === "Computers")
        .map((product) => product.prod_id);
  
      if (featureProductIds.length === 0) {
        return callback(null, productResults);
      }
  
      const featureQuery = `SELECT * FROM oneclick_mobile_features WHERE prod_id IN (${featureProductIds.map(() => "?").join(",")})`;
  
      db.query(featureQuery, featureProductIds, (err, featureResults) => {
        if (err) return callback(err);
  
        const productsWithFeatures = productResults.map((product) => {
          const features = featureResults.find((feature) => feature.prod_id === product.prod_id);
          return features ? { ...product, ...features } : product;
        });
  
        return callback(null, productsWithFeatures);
      });
    });
  };


  module.exports = {
    removeFromWishlist,
    updateUserWishlist,
    fetchWishlist,
    fetchWishlistWithFeatures,
  };
  
 
  