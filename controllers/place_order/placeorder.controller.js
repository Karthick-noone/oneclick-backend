const path = require("path");
const multer = require("multer");
const {
  insertOrder,
  upsertProducts,
  insertOrderItems,
  insertProductImages,
} = require("../../models/place_order/placeorder.model");

const generateUniqueId = () => `ORD${Math.floor(10000000 + Math.random() * 90000000)}`;

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/products"),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const upload7 = multer({ storage });

const placeOrder = (req, res) => {
  const {
    user_id,
    total_amount,
    payment_method,
    payment_id,
    status,
    shipping_address,
    address_id,
    cartItems,
  } = req.body;

  const files = req.files || [];
  let items;

  // console.log("📦 Raw cartItems:", cartItems);

  try {
    items = Array.isArray(cartItems) ? cartItems : JSON.parse(cartItems);
  } catch (e) {
    return res.status(400).json({ message: "Invalid cart items format" });
  }

  if (!user_id || !total_amount || !address_id || !items || items.length === 0) {
    return res.status(400).json({ message: "Invalid data" });
  }

  const unique_id = generateUniqueId();
  const invoice = `INV-${Date.now()}`;

  // ✅ branch_id comes from first item (because cartItems is array)
  const branch_id = items[0]?.branch_id || null;
  // console.log("✅ Extracted branch_id from items:", branch_id);

  insertOrder(
    [
      invoice,
      payment_method,
      payment_id,
      unique_id,
      user_id,
      total_amount,
      shipping_address,
      address_id,
      status,
      "Order Placed",
      branch_id
    ],
    (err) => {
      // console.log("---- ORDER INSERT LOG ----");
      // console.log("invoice:", invoice);
      // console.log("unique_id:", unique_id);
      // console.log("branch_id:", branch_id);
      // console.log("--------------------------");

      if (err) return res.status(500).json({ message: "Error inserting order", error: err.message });

      const productValues = items.map(item => [
        item.prod_id,
        item.prod_name,
        item.prod_category,
        item.prod_price,
        item.prod_description,
      ]);

      // console.log("productValues:", productValues);

      upsertProducts(productValues, (err) => {
        if (err) return res.status(500).json({ message: "Error inserting/updating products", error: err.message });

        const itemValues = items.map(item => [
          unique_id,
          item.prod_id,
          item.quantity || 1,
          item.prod_price * (item.quantity || 1),
          item.is_buy_together ? 1 : 0,
        ]);

        // console.log("itemValues:", itemValues);

        insertOrderItems(itemValues, (err) => {
          if (err) return res.status(500).json({ message: "Error inserting order items", error: err.message });

          const imageValues = [];

          items.forEach((item) => {
            const fileMatches = files.filter(f => f.originalname === item.prod_img);
            if (fileMatches.length > 0) {
              fileMatches.forEach(file => imageValues.push([item.prod_id, file.filename]));
            } else if (item.prod_img) {
              (Array.isArray(item.prod_img) ? item.prod_img : [item.prod_img]).forEach(url => {
                imageValues.push([item.prod_id, url]);
              });
            }
          });

          if (imageValues.length > 0) {
            insertProductImages(imageValues, (err) => {
              if (err) return res.status(500).json({ message: "Error inserting product images", error: err.message });
              return res.status(200).json({ message: "Order placed successfully", unique_id });
            });
          } else {
            return res.status(200).json({ message: "Order placed successfully", unique_id });
          }
        });
      });
    }
  );
};




module.exports = { upload7, placeOrder };
