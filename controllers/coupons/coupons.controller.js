const Coupon = require("../../models/coupons/coupons.model");
const couponsModel = require("../../models/coupons/coupons.model");
const generateProductId = require("../../utils/generateProductId");
const path = require("path");
const fs = require("fs");

exports.applyCoupon = async (req, res) => {
  try {
    const { couponCode, product_ids, cart_total } = req.body;
    console.log("Received data:", req.body);

    const normalizedCouponCode = couponCode;
    const productIdsArray = Array.isArray(product_ids)
      ? product_ids
      : [product_ids];

    // Query product-specific coupons
    const results = await Coupon.findByCodeAndProductIds(
      normalizedCouponCode,
      productIdsArray
    );
    console.log("Coupons table results:", results);

    if (results.length > 0) {
      function stripTimeZone(date) {
        const d = new Date(date);
        return new Date(d.getFullYear(), d.getMonth(), d.getDate());
      }

      const today = stripTimeZone(new Date());

      const validCoupons = results.filter(coupon => {
        const expiryDate = stripTimeZone(coupon.expiry_date);
        return expiryDate >= today;
      });

      if (validCoupons.length === 0) {
        console.log("Sending error: Coupon has expired.");
        return res.status(400).json({ error: "Coupon has expired." });
      }

      const totalDiscount = validCoupons.reduce(
        (sum, coupon) => sum + parseInt(coupon.discount_value, 10),
        0
      );

      return res.json({
        success: true,
        message: "Coupon applied successfully!",
        discount2: totalDiscount
        // min_purchase_limit omitted for product-specific coupons
      });
    }

    // If not found in product-specific, check common coupon
    const commonResults = await Coupon.findCommonCouponByCode(
      normalizedCouponCode
    );
    console.log("Common coupons table results:", commonResults);

    if (commonResults.length === 0) {
      console.log("Sending error: Invalid coupon code.");
      return res.status(400).json({ error: "Invalid coupon code." });
    }

    const { min_purchase_limit, value } = commonResults[0];

    console.log("Cart total received:", cart_total);
    console.log("Min purchase limit required:", min_purchase_limit);

    if (parseFloat(cart_total) < parseFloat(min_purchase_limit)) {
      console.log(
        `Sending error: Minimum purchase of ₹${min_purchase_limit} required.`
      );
      return res.status(400).json({
        error: `Minimum purchase of ₹${min_purchase_limit} required to use this coupon.`,
      });
    }

    return res.json({
      success: true,
      message: "Coupon applied successfully!",
      discount1: value,
      // min_purchase_limit,
    });

  } catch (err) {
    console.error("Unhandled server error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
};


// Add Multiple Coupons
exports.addMultipleCoupons = async (req, res) => {
  const { coupons } = req.body;

  if (!Array.isArray(coupons) || coupons.length === 0) {
    return res
      .status(400)
      .json({ message: "Invalid input data. Expecting an array of coupons." });
  }

  try {
    await Coupon.insertMany(coupons);
    return res.status(200).json({ message: "Coupons added successfully." });
  } catch (err) {
    console.error("Error inserting coupons:", err);
    return res.status(500).json({ message: "Error inserting coupons." });
  }
};

// Get Coupons by Product ID
exports.getCouponsByProductId = async (req, res) => {
  const productId = req.params.productId;

  try {
    const coupons = await Coupon.getByProductId(productId);
    if (coupons.length > 0) {
      return res.status(200).json({ coupons });
    }
    return res
      .status(404)
      .json({ error: "No coupons found for this product." });
  } catch (err) {
    console.error("Error fetching coupons:", err);
    return res.status(500).json({ message: "Failed to fetch coupons." });
  }
};

// Update Coupon
exports.updateCoupon = async (req, res) => {
  const { id } = req.params;
  const { coupon_code, expiry_date, couponValue } = req.body;

  try {
    const result = await Coupon.updateCoupon(
      id,
      couponValue,
      coupon_code,
      expiry_date
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Coupon not found" });
    }
    res.json({ message: "Coupon updated successfully" });
  } catch (err) {
    console.error("Error updating coupon:", err);
    return res.status(500).json({ message: "Error updating coupon." });
  }
};

// Delete Coupon
exports.deleteCoupon = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await Coupon.deleteCoupon(id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Coupon not found" });
    }
    res.json({ message: "Coupon deleted successfully" });
  } catch (err) {
    console.error("Error deleting coupon:", err);
    return res.status(500).json({ message: "Error deleting coupon." });
  }
};

// Get All Common Coupons
exports.getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.getAll();
    if (coupons.length === 0) {
      return res.status(404).json({ error: "No coupons found." });
    }
    res.json(coupons);
  } catch (err) {
    console.error("Error fetching coupons:", err);
    return res.status(500).json({ error: "Failed to fetch coupons." });
  }
};

// Add New Coupon
exports.addNewCoupon = async (req, res) => {
  const { name, value, minPurchaseLimit } = req.body;

  try {
    const result = await Coupon.addCoupon(name, value, minPurchaseLimit);
    res
      .status(201)
      .json({ message: "Coupon added successfully", id: result.insertId });
  } catch (err) {
    console.error("Error adding coupon:", err);
    return res.status(500).json({ message: "Failed to add coupon." });
  }
};

exports.updateCommonCoupon = (req, res) => {
  const { id } = req.params;
  const { name, value, minPurchaseLimit } = req.body;

  console.log("Updating coupon:", { id, name, value, minPurchaseLimit });

  couponsModel.updateCommonCoupon(id, name, value, minPurchaseLimit, (err) => {
    if (err) {
      console.error("Error updating coupon:", err);
      return res.status(500).json({ message: "Error updating coupon" });
    }
    console.log("Coupon updated successfully:", id);
    res.json({ message: "Coupon updated successfully" });
  });
};

exports.deleteCommonCoupon = (req, res) => {
  const { id } = req.params;
  console.log(`Deleting coupon with ID: ${id}`);

  couponsModel.deleteCommonCoupon(id, (err) => {
    if (err) {
      console.error("Error deleting coupon:", err);
      return res.status(500).json({ message: "Error deleting coupon" });
    }
    console.log("Deleted coupon successfully:", id);
    res.json({ message: "Coupon deleted successfully" });
  });
};

exports.copyProduct = (req, res) => {
  const productId = req.params.id;
  const newProdId = generateProductId();

  couponsModel.getProductById(productId, (err, result) => {
    if (err || result.length === 0) {
      console.error("Error fetching original product:", err);
      return res.status(500).json({ message: "Error fetching product" });
    }

    const originalProduct = result[0];
    let imageArray = [];

    try {
      imageArray = JSON.parse(originalProduct.prod_img);
      if (!Array.isArray(imageArray)) throw new Error("Invalid JSON format");
    } catch (parseErr) {
      console.error("Error parsing image JSON:", parseErr);
      return res.status(500).json({ message: "Invalid image format" });
    }

    const categoryFolder = originalProduct.category.toLowerCase();
    const newImageArray = [];

    imageArray.forEach((imageName) => {
      if (!imageName || typeof imageName !== "string") return;

      const oldPath = path.join(
        __dirname,
        "../../uploads",
        categoryFolder,
        imageName
      );
      const newName = `copy_${newProdId}_${imageName}`;
      const newPath = path.join(
        __dirname,
        "../../uploads",
        categoryFolder,
        newName
      );

      try {
        if (fs.existsSync(oldPath)) {
          fs.copyFileSync(oldPath, newPath);
          newImageArray.push(newName);
        }
      } catch (copyErr) {
        console.error("Error copying image:", copyErr);
      }
    });

    const newImageJson = JSON.stringify(
      newImageArray.filter((n) => n && n !== "blob").length > 0
        ? newImageArray
        : ["no-image.jpg"]
    );

    couponsModel.insertCopiedProduct(
      newProdId,
      newImageJson,
      productId,
      (copyErr) => {
        if (copyErr) {
          console.error("Error copying product:", copyErr);
          return res.status(500).json({ message: "Failed to copy product" });
        }

        res.json({
          message: "Product copied successfully",
          newProductId: newProdId,
        });
      }
    );
  });
};
