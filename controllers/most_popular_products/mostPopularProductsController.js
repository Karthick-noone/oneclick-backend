const MostPopularProducts = require('../../models/most_popular_products/mostPopularProductsModel');

exports.fetchMostPopular = (req, res) => {
  const categories = [
    "Mobiles",
    "Computers",
    "CCTV",
    "Printers",
    "ComputerAccessories",
    "MobileAccessories",
    "CCTVAccessories",
    "PrinterAccessories",
    "Speakers",
    "Headphones",
    "Watch",
  ];

  MostPopularProducts.fetchMostPopular(categories, (err, products) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error", details: err });
    }

    if (!products || products.length === 0) {
      return res.status(404).json({ error: "No products found" });
    }

    try {
      const latestProducts = categories.reduce((result, category) => {
        const product = products.find((product) => product.category === category);
        if (product) {
          result.push(product);
        }
        return result;
      }, []);

      res.json(latestProducts);
    } catch (error) {
      console.error("Error while processing products:", error);
      return res.status(500).json({ error: "Error processing products", details: error });
    }
  });
};

exports.fetchProducts = (req, res) => {
  const categories = [
    "Mobiles",
    "Computers",
    "CCTV",
    "Printers",
    "ComputerAccessories",
    "MobileAccessories",
    "CCTVAccessories",
    "PrinterAccessories",
    "Speakers",
    "Headphones",
  ];

  MostPopularProducts.fetchProducts(categories, (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
};
