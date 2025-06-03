const WishlistModel = require("../../models/wishlist/wishlist.model");


const removeFromWishlist = (req, res) => {
    const { email, productId } = req.body;
  
    if (!email || !productId) {
      return res.status(400).json({ error: "Email and product ID are required." });
    }
  
    WishlistModel.removeFromWishlist(email, productId, (err, message) => {
      if (err) {
        console.error("Error removing item from wishlist:", err);
        return res.status(500).json({ error: err.message });
      }
  
      return res.status(200).json({ message });
    });
  };
  

  const updateUserWishlist = (req, res) => {
    const { email, username, prod_id, action } = req.body;
  
    if (!email || !username || !prod_id || !action) {
      return res.status(400).json({ error: "Email, username, prod_id, and action are required" });
    }
  
    WishlistModel.updateUserWishlist(email, username, prod_id, action, (err, result) => {
      if (err) {
        console.error("Error updating wishlist:", err);
        return res.status(500).json({ error: err.message });
      }
  
      res.json(result);
    });
  };

 // Controller function to fetch the wishlist
const fetchWishlist = (req, res) => {
    const { email, username } = req.body;
  
    if (!email || !username) {
      return res.status(400).json({ message: "Email and username are required" });
    }
  
    WishlistModel.fetchWishlist(email, username, (err, wishlist) => {
      if (err) {
        console.error("Error fetching wishlist:", err);
        return res.status(500).json({ message: "Error fetching wishlist" });
      }
  
      return res.json({ wishlist });
    });
  };
  
  // Controller function to fetch wishlist with product details and features
  const fetchWishlistWithFeatures = (req, res) => {
    const { email, username } = req.body;
  
    if (!email || !username) {
      return res.status(400).json({ error: "Email and username are required" });
    }
  
    WishlistModel.fetchWishlist(email, username, (err, wishlist) => {
      if (err) {
        console.error("Error fetching wishlist:", err);
        return res.status(500).json({ error: "Error fetching wishlist" });
      }
  
      if (wishlist.length === 0) {
        return res.json({ products: [] });
      }
  
      WishlistModel.fetchWishlistWithFeatures(email, username, wishlist, (err, products) => {
        if (err) {
          console.error("Error fetching wishlist products with features:", err);
          return res.status(500).json({ error: "Error fetching wishlist products with features" });
        }
  
        return res.json({ products });
      });
    });
  };
  
  module.exports = {
    removeFromWishlist,
    updateUserWishlist,
    fetchWishlistWithFeatures,
    fetchWishlist
  };