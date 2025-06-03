const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config(); // Optional if using environment variables

// Initialize DB connection once (important for cPanel or clustered hosting)
require("./config/db");

const app = express();
const port = process.env.PORT || 5001;

// Middleware- used for sharing resource to the different origins(platforms)
app.use(cors());
app.use(express.json());

// Static file serving
app.use("/backend/uploads", express.static(path.join(__dirname, "uploads")));

const edithomepageRoutes = require("./routes/adpage_routes/edithomepageRoutes");
const doubleAdRoutes = require("./routes/adpage_routes/doubleAdPageRoutes");
const offersRoutes = require("./routes/offerspage_routes/offersPageRoutes");
const mobileOffersRoutes = require("./routes/offerspage_routes/mobileOffersRoutes");
const CCTVOffersPageRoutes = require("./routes/offerspage_routes/CCTVOffersPageRoutes");
const singleAdPageRoutes = require("./routes/adpage_routes/singleAdPageRoutes");

const loginBackgroundRoutes = require("./routes/loginbackground_routes/loginBackgroundRoutes");
const searchSuggestionsRoutes = require('./routes/search_suggestions_routes/searchSuggestionsRoutes');
const userAddressRoutes = require('./routes/user/userAddressRoutes');
const authenticationRoutes = require('./routes/authentication/authenticationRoutes');
const mostPopularProductsRoutes = require('./routes/most_popular_products/mostPopularProductsRoutes');
const contactRoutes = require('./routes/contact/contactRoutes');
const careerRoutes = require('./routes/contact/careerRoutes');
const userOrdersRoutes = require('./routes/user_orders/userOrdersRoutes');

const computersRoutes = require("./routes/products/computersRoutes");
const mobilesRoutes = require("./routes/products/mobilesRoutes");
const cctvRoutes = require("./routes/products/cctvRoutes");
const headphonesRoutes = require("./routes/products/headphonesRoutes");
const speakersRoutes = require("./routes/products/speakersRoutes");
const tvRoutes = require("./routes/products/tvRoutes");
const watchRoutes = require("./routes/products/watchRoutes");
const printersRoutes = require("./routes/products/printersRoutes");
const computeraccessoriesRoutes = require("./routes/products/computeraccessoriesRoutes");
const cctvaccessoriesRoutes = require("./routes/products/cctvaccessoriesRoutes");
const mobileaccessoriesRoutes = require("./routes/products/mobileaccessoriesRoutes");
const printeraccessoriesRoutes = require("./routes/products/printeraccessoriesRoutes");
const secondhandproductsRoutes = require("./routes/products/secondhandproductsRoutes");
const recentlyViewedRoutes = require("./routes/products/recentlyViewedRoutes");

const relatedProductsRoutes = require("./routes/product_details/productDetails.routes");
const couponRoutes = require("./routes/coupons/coupons.routes");
const cartRoutes = require("./routes/cart/cart.routes");
const wishlistRoutes = require("./routes/wishlist/wishlist.routes");
const buylaterRoutes = require("./routes/buylater/buylater.routes");
const placeOrderRoutes = require("./routes/place_order/placeorder.routes");
const ordersRoutes = require("./routes/orders/orders.routes");
const reportRoutes = require("./routes/reports/reports.routes");
const staffRoutes = require("./routes/staffs/staffs.routes");
const accessoriesRoutes = require("./routes/accessories/accessories.routes");
const priceOfferRoutes = require("./routes/price_offer/price_offer.routes");

// Register routes (mounted under /backend)
app.use("/backend", edithomepageRoutes);
app.use("/backend", doubleAdRoutes);
app.use("/backend", offersRoutes);
app.use("/backend", mobileOffersRoutes);
app.use("/backend", CCTVOffersPageRoutes);
app.use("/backend", singleAdPageRoutes);

app.use("/backend", loginBackgroundRoutes);
app.use("/backend", searchSuggestionsRoutes);
app.use("/backend", userAddressRoutes);
app.use("/backend", authenticationRoutes);
app.use("/backend/api", mostPopularProductsRoutes);
app.use("/backend", contactRoutes);
app.use("/backend", careerRoutes);
app.use("/backend", userOrdersRoutes);

app.use("/backend", computersRoutes);
app.use("/backend", mobilesRoutes);
app.use("/backend", cctvRoutes);
app.use("/backend", headphonesRoutes);
app.use("/backend", speakersRoutes);
app.use("/backend", tvRoutes);
app.use("/backend", watchRoutes);
app.use("/backend", printersRoutes);
app.use("/backend", computeraccessoriesRoutes);
app.use("/backend", cctvaccessoriesRoutes);
app.use("/backend", mobileaccessoriesRoutes);
app.use("/backend", printeraccessoriesRoutes);
app.use("/backend", secondhandproductsRoutes);
app.use("/backend", recentlyViewedRoutes);

app.use("/backend", relatedProductsRoutes);
app.use("/backend", couponRoutes);
app.use("/backend", cartRoutes);
app.use("/backend", wishlistRoutes);
app.use("/backend", buylaterRoutes);
app.use("/backend", placeOrderRoutes);
app.use("/backend", ordersRoutes);
app.use("/backend", reportRoutes);
app.use("/backend", staffRoutes);
app.use("/backend", accessoriesRoutes);
app.use("/backend", priceOfferRoutes);

// Default root
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Error handling middleware (important for production debugging)
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.stack);
  res.status(500).json({ message: "Internal Server Error", error: err.message });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
