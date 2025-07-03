const CartModel = require("../../models/cart/cart.model");

const {
  clearUserCart,
  fetchUserCart,
} = require("../../models/cart/cart.model");

// Add to Cart
const addToCart = (req, res) => {
  const { email, productId, quantity } = req.body;

  if (!email || !productId || quantity === undefined) {
    return res.status(400).json({ message: "Email, Product ID, and Quantity are required" });
  }

  try {
    CartModel.getUserCart(email, (err, result) => {
      if (err) {
        console.error("Error fetching cart:", err);
        return res.status(500).json({ message: "Error fetching cart data" });
      }

      if (!result || result.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      let currentCart = [];
      try {
        currentCart = result[0].addtocart ? JSON.parse(result[0].addtocart) : [];
      } catch (e) {
        console.error("Error parsing cart:", e);
        currentCart = [];
      }

      const productEntry = `${productId}-${quantity}`;
      const existingIndex = currentCart.findIndex((item) =>
        typeof item === "string" && item.startsWith(`${productId}-`)
      );

      if (existingIndex !== -1) {
        const [_, existingQty] = currentCart[existingIndex].split("-");
        const updatedQty = parseInt(existingQty) + parseInt(quantity);
        currentCart[existingIndex] = `${productId}-${updatedQty}`;
      } else {
        currentCart.push(productEntry);
      }

      CartModel.updateUsersCart(email, currentCart, (updateErr) => {
        if (updateErr) {
          console.error("Error updating cart:", updateErr);
          return res.status(500).json({ message: "Error updating cart" });
        }
        return res.status(200).json({ message: "Product added to cart successfully" });
      });
    });
  } catch (fatalErr) {
    console.error("Fatal Error in addToCart:", fatalErr);
    return res.status(500).json({ message: "Something went wrong." });
  }
};

// Get Cart Items
const getCartItems = (req, res) => {
  const { email, username } = req.body;

  if (!email || !username) {
    return res.status(400).json({ error: "Email and username are required" });
  }

  try {
    CartModel.getUserCartByEmailAndUsername(email, username, (err, results) => {
      if (err) {
        console.error("Error retrieving cart items:", err);
        return res.status(500).json({ error: "Error retrieving cart items" });
      }

      if (!results || results.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      let cartItems = [];
      try {
        cartItems = results[0].addtocart ? JSON.parse(results[0].addtocart) : [];
      } catch (e) {
        console.error("Error parsing cart:", e);
        cartItems = [];
      }

      if (cartItems.length === 0) {
        return res.json({ products: [] });
      }

      const productIds = cartItems
        .map((item) => {
          if (typeof item !== "string") return null;
          return item.includes("-") ? item.split("-")[0] : null;
        })
        .filter(Boolean);

      CartModel.getProductsByIds(productIds, (err, productResults) => {
        if (err) {
          console.error("Error fetching product details:", err);
          return res.status(500).json({ error: "Error fetching product details" });
        }

        const productsWithQuantity = productResults.map((product) => {
          const cartItem = cartItems.find((item) =>
            typeof item === "string" && item.startsWith(`${product.id}-`)
          );
          const quantity = cartItem ? parseInt(cartItem.split("-")[1]) : 0;

          return { ...product, quantity };
        });

        const featureProdIds = productsWithQuantity
          .filter((product) => ["Mobiles", "Computers"].includes(product.category))
          .map((product) => product.prod_id);

        if (featureProdIds.length === 0) {
          return res.json({ products: productsWithQuantity });
        }

        CartModel.getFeaturesByProdIds(featureProdIds, (err, featureResults) => {
          if (err) {
            console.error("Error fetching features:", err);
            return res.status(500).json({ error: "Error fetching product features" });
          }

          const enrichedProducts = productsWithQuantity.map((product) => {
            const features = featureResults.find((f) => f.prod_id === product.prod_id);
            return features ? { ...product, ...features } : product;
          });

          res.json({ products: enrichedProducts });
        });
      });
    });
  } catch (fatalErr) {
    console.error("Fatal Error in getCartItems:", fatalErr);
    return res.status(500).json({ error: "Something went wrong." });
  }
};


const getCartQuantitySum = (req, res) => {
  const { email, username } = req.body;

  if (!email || !username) {
    return res.status(400).json({ error: "Email and username are required" });
  }

  CartModel.getUserCartByEmailAndUsername(email, username, (err, results) => {
    if (err) {
      console.error("Error retrieving cart items:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (!results || results.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    let cartItems = results[0].addtocart || "[]";

    try {
      cartItems = JSON.parse(cartItems);
    } catch (e) {
      console.error("Error parsing cart items:", e);
      return res.status(400).json({ error: "Invalid cart format" });
    }

    const totalQuantity = cartItems.reduce((sum, item) => {
      const quantity = parseInt(item.split("-")[1]);
      return sum + (isNaN(quantity) ? 0 : quantity);
    }, 0);

    res.json({ totalQuantity });
  });
};

const updateCartQuantity = (req, res) => {
  const { email, itemId, quantity } = req.body;

  if (!email || !itemId || quantity === undefined) {
    return res
      .status(400)
      .json({ error: "Email, itemId, and quantity are required" });
  }

  CartModel.getCartByEmail(email, (err, results) => {
    if (err) {
      console.error("Error retrieving cart:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (!results || results.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    let cartItems = [];
    try {
      cartItems = results[0].addtocart ? JSON.parse(results[0].addtocart) : [];
    } catch (e) {
      console.error("Error parsing cart data:", e);
    }

    const itemIndex = cartItems.findIndex((item) =>
      item.startsWith(`${itemId}-`)
    );

    if (itemIndex !== -1) {
      cartItems[itemIndex] = `${itemId}-${quantity}`;
    } else {
      cartItems.push(`${itemId}-${quantity}`);
    }

    CartModel.updateCartByEmail(email, cartItems, (updateErr) => {
      if (updateErr) {
        console.error("Error updating cart:", updateErr);
        return res.status(500).json({ error: "Failed to update cart" });
      }

      res.status(200).json({ message: "Cart quantity updated successfully" });
    });
  });
};

const removeFromCart = (req, res) => {
  const { email, itemId, quantity } = req.body;

  if (!email || !itemId || !quantity) {
    return res.status(400).json({ error: "Email, ItemId, and Quantity are required" });
  }

  CartModel.removeItemFromCart(email, itemId, quantity, (err, message) => {
    if (err) {
      console.error("Error removing item from cart:", err);
      return res.status(500).json({ error: err.message });
    }

    return res.status(200).json({ success: true, message });
  });
};



const clearCart = (req, res) => {
  const { email, cartItems } = req.body;

  if (!email || !Array.isArray(cartItems)) {
    return res.status(400).json({ error: "Email and cartItems are required" });
  }

  fetchUserCart(email, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    let currentCart;
    try {
      currentCart = JSON.parse(result[0].addtocart);
    } catch (e) {
      return res.status(500).json({ error: "Corrupted cart data" });
    }

    const itemsToRemove = new Set(
      cartItems.map((item) => `${item.id}-${item.quantity}`)
    );

    const updatedCart = currentCart.filter(
      (item) => !itemsToRemove.has(item)
    );

    clearUserCart(email, updatedCart, (updateErr) => {
      if (updateErr) {
        return res.status(500).json({ error: "Failed to update cart" });
      }

      res.json({
        message: "Selected cart items removed successfully",
        updatedCart,
      });
    });
  });
};

module.exports = {
  addToCart,
  getCartItems,
  getCartQuantitySum,
  updateCartQuantity,
  removeFromCart,
  clearCart,
};
