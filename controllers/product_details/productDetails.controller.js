const ProductDetailsModel = require('../../models/product_details/productDetails.model');

// Controller function to fetch product details by ID
const getProductDetailsById = (req, res) => {
  const { id } = req.params; // Extract product ID from URL params

  if (!id) {
    return res.status(400).json({ error: "Product ID is required" });
  }

  ProductDetailsModel.getProductDetailsById(id, (err, productDetails) => {
    if (err) {
      console.error("Error fetching product details:", err);
      return res.status(500).json({ error: "Error fetching product details" });
    }

    return res.json(productDetails);
  });
};


// Controller function to fetch related products by category
const getRelatedProductsByCategory = (req, res) => {
  const { category } = req.params;

  ProductDetailsModel.getRelatedProductsByCategory(category, (err, products) => {
    if (err) {
      console.error("Error fetching related products:", err);
      return res.status(500).json({ error: "Error fetching related products" });
    }
    res.json(products);
  });
};

// Controller function to fetch related products with accessory mapping
const getRelatedProductsWithAccessories = (req, res) => {
  const { category } = req.params;

  ProductDetailsModel.getRelatedProductsWithAccessories(category, (err, products) => {
    if (err) {
      console.error("Error fetching related products:", err);
      return res.status(500).json({ error: "Error fetching related products" });
    }
    res.json(products);
  });
};

// Controller to get additional accessories for a product
const getAdditionalAccessories = (req, res) => {
  const { productId } = req.params;

  ProductDetailsModel.getAdditionalAccessoriesByProductId(productId, (err, result) => {
    if (err) {
      console.error("Error fetching additional accessories:", err);
      return res.status(500).send("Error fetching additional accessories");
    }

    if (result.length > 0) {
      const additionalAccessories = result[0].additional_accessories;
      if (additionalAccessories && additionalAccessories.length > 0) {
        // console.log("additionalAccessories", additionalAccessories);
        return res.json({ additional_accessories: additionalAccessories });
      } else {
        return res.status(404).send("No additional accessories found for the given product ID");
      }
    } else {
      return res.status(404).send("No product found for the given ID");
    }
  });
};

// Controller to get accessory product details
const getAccessoryDetails = (req, res) => {
  const { id: accessoryId } = req.params;

  ProductDetailsModel.getAccessoryDetailsById(accessoryId, (err, result) => {
    if (err) {
      console.error("Error fetching accessory details:", err);
      return res.status(500).send("Error fetching accessory details");
    }

    if (result.length > 0) {
      const accessory = result[0];

      // If prod_img is a single blob name, convert to array
      if (
        typeof accessory.prod_img === "string" &&
        accessory.prod_img.startsWith("blob_")
      ) {
        accessory.prod_img = [accessory.prod_img];
      }

      // console.log("Fetched accessory details:", accessory);
      return res.json(accessory);
    } else {
      console.warn(`No accessory found for the given ID: ${accessoryId}`);
      return res.status(404).send("Accessory not found for the given ID");
    }
  });
};

// Controller to get all offers page products
const getAllOfferPageProducts = (req, res) => {
  ProductDetailsModel.getAllOfferPageProducts((err, results) => {
    if (err) {
      console.error("Error fetching product:", err);
      return res.status(500).json({ message: "Failed to fetch product" });
    }

    return res.json(results);
  });
};


module.exports = {
  getProductDetailsById,
  getRelatedProductsWithAccessories,
  getRelatedProductsByCategory,
  getAdditionalAccessories,
  getAccessoryDetails,
  getAllOfferPageProducts
};
