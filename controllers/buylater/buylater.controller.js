// controllers/buyLater.controller.js
const BuyLaterModel = require("../../models/buylater/buylater.model");

const storeBuyLater = (req, res) => {
  const { productIds, userId } = req.body;

  if (!Array.isArray(productIds) || productIds.length === 0) {
    return res.status(400).json({
      error: "Invalid productIds provided. It should be a non-empty array.",
    });
  }

  if (!userId) {
    return res.status(400).json({ error: "Missing userId. Unable to store buy later items." });
  }

  BuyLaterModel.getUserCartData(userId, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database error", details: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    let existingBuyLaterItems = [];
    let existingCartItems = [];

    if (results[0].buy_later) {
      try {
        existingBuyLaterItems = JSON.parse(results[0].buy_later);
      } catch (parseError) {
        return res.status(500).json({ error: "Invalid buy_later format" });
      }
    }

    if (results[0].addtocart) {
      try {
        existingCartItems = JSON.parse(results[0].addtocart);
      } catch (parseError) {
        return res.status(500).json({ error: "Invalid addtocart format" });
      }
    }

    const updatedBuyLaterList = [...new Set([...existingBuyLaterItems, ...productIds])];
    const updatedCartItems = existingCartItems.filter((cartItem) => {
      if (typeof cartItem !== "string" || !cartItem.includes("-")) {
        return true; // Keep it if it doesn't match the expected format
      }
      const cartProductId = parseInt(cartItem.split("-")[0], 10);
      return !productIds.includes(cartProductId);
    });


    BuyLaterModel.updateUserCartData(userId, updatedBuyLaterList, updatedCartItems, (updateErr, updateResults) => {
      if (updateErr) {
        return res.status(500).json({ error: "Database error", details: updateErr });
      }

      res.json({
        message: "Items successfully added to Buy Later and removed from cart.",
        buyLater: updatedBuyLaterList,
        updatedCart: updatedCartItems,
      });
    });
  });
};

const removeBuyLaterItem = (req, res) => {
  const { productId, userId } = req.body;

  if (!productId || !userId) {
    return res.status(400).json({ error: "Missing productId or userId." });
  }

  BuyLaterModel.getUserBuyLaterData(userId, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database error", details: err });
    }

    if (results.length === 0 || !results[0].buy_later) {
      return res.json({ message: "No items found in Buy Later." });
    }

    let existingBuyLaterItems = [];
    try {
      existingBuyLaterItems = JSON.parse(results[0].buy_later);
    } catch (parseError) {
      return res.status(500).json({ error: "Invalid buy_later format" });
    }

    // Remove the product ID from the buy_later list
    const updatedBuyLaterItems = existingBuyLaterItems.filter(id => id !== productId);

    BuyLaterModel.updateUserBuyLater(userId, updatedBuyLaterItems, (updateErr, updateResults) => {
      if (updateErr) {
        return res.status(500).json({ error: "Database error", details: updateErr });
      }

      res.json({
        message: "Item successfully removed from Buy Later.",
        buyLater: updatedBuyLaterItems,
      });
    });
  });
};


const getBuyLaterItems = (req, res) => {
  const { userId } = req.params;

  BuyLaterModel.getUserBuyLater(userId, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database error while fetching buy_later", details: err });
    }

    if (results.length === 0 || !results[0].buy_later) {
      return res.json({ buyLater: [] });
    }

    let buyLaterItems = [];
    try {
      buyLaterItems = JSON.parse(results[0].buy_later);
    } catch (parseError) {
      return res.status(500).json({ error: "Invalid buy_later format" });
    }

    if (buyLaterItems.length === 0) {
      return res.json({ buyLater: [] });
    }

    // Reverse the order to show the last added item first
    buyLaterItems = buyLaterItems.reverse();

    // Fetch product details based on buy_later items
    BuyLaterModel.getProductDetailsByIds(buyLaterItems, (productErr, productResults) => {
      if (productErr) {
        return res.status(500).json({ error: "Database error while fetching product details", details: productErr });
      }

      // Reorder productResults to match the reversed buyLaterItems order
      const orderedProducts = buyLaterItems.map(id =>
        productResults.find(product => product.id === id)
      ).filter(product => product); // Remove undefined entries

      res.json({ buyLater: orderedProducts });
    });
  });
};


const addToCart = (req, res) => {
  const { email, productId, quantity, buyLater } = req.body;

  if (!email || !productId || quantity === undefined) {
    return res.status(400).json({ message: "Email, Product ID, and Quantity are required" });
  }

  BuyLaterModel.getUserCartAndBuyLater(email, (err, result) => {
    if (err) return res.status(500).json({ message: "Error fetching cart data", error: err });
    if (result.length === 0) return res.status(404).json({ message: "User not found" });

    let currentCart = result[0].addtocart ? JSON.parse(result[0].addtocart) : [];
    let buyLaterList = result[0].buy_later ? JSON.parse(result[0].buy_later) : [];

    const productEntry = `${productId}-${quantity}`;
    const existingProductIndex = currentCart.findIndex(item => item.startsWith(`${productId}-`));

    if (existingProductIndex !== -1) {
      const [existingProductId, existingQuantity] = currentCart[existingProductIndex].split("-");
      currentCart[existingProductIndex] = `${existingProductId}-${parseInt(existingQuantity, 10) + quantity}`;
    } else {
      currentCart.push(productEntry);
    }

    BuyLaterModel.updateUserCart(email, currentCart, (updateErr) => {
      if (updateErr) return res.status(500).json({ message: "Error updating cart", error: updateErr });

      if (buyLater) {
        buyLaterList = buyLaterList.filter(id => id !== productId);
        BuyLaterModel.updateUserBuyLaterItem(email, buyLaterList, (updateErr2) => {
          if (updateErr2) return res.status(500).json({ message: "Error updating buy_later", error: updateErr2 });
          return res.status(200).json({ message: "Product added to cart successfully" });
        });
      } else {
        return res.status(200).json({ message: "Product added to cart successfully" });
      }
    });
  });
};


module.exports = {
  storeBuyLater,
  removeBuyLaterItem,
  getBuyLaterItems,
  addToCart
};
