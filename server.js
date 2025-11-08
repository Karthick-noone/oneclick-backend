const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
require("dotenv").config();
// const { cacheMiddleware, clearCacheMiddleware } = require("./cache/cacheInstance"); //  New file

const app = express();
const port = process.env.PORT || 5001;

const logFilePath = path.join(__dirname, "server.log");

// === Process-level Error Logging (add at the top) ===
process.on("unhandledRejection", (reason, promise) => {
  const msg = `Unhandled Rejection at: ${promise}, reason: ${reason}`;
  console.error(msg);
  fs.appendFileSync(logFilePath, `[${new Date().toISOString()}] [UNHANDLED_REJECTION] ${msg}\n`);
});

process.on("uncaughtException", (err) => {
  const msg = `Uncaught Exception: ${err.stack}`;
  console.error(msg);
  fs.appendFileSync(logFilePath, `[${new Date().toISOString()}] [UNCAUGHT_EXCEPTION] ${msg}\n`);
  process.exit(1); // optional: restart server
});

function logToFile(message, type = "INFO") {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] [${type}] ${message}\n`;
  fs.appendFile(logFilePath, logEntry, (err) => {
    if (err) {
      console.error("Failed to write to server.log:", err);
    }
  });
}

// DB Connection
require("./config/db");
logToFile("MySQL DB connection module loaded", "DB");

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files
app.use("/backend/uploads", express.static(path.join(__dirname, "uploads")));
logToFile("Serving static files at /backend/uploads", "STATIC");

// Route Imports
logToFile("Importing routes...", "INIT");


try {
  const { cacheMiddleware, clearCacheMiddleware } = require("./cache/cacheInstance");

  // Wrap cache middlewares in try-catch
  app.use((req, res, next) => {
    try {
      clearCacheMiddleware(req, res, next);
    } catch (err) {
      logToFile(`Error in clearCacheMiddleware: ${err.stack}`, "CACHE_ERROR");
      console.error("clearCacheMiddleware error:", err);
      next(err);
    }
  });

  app.use((req, res, next) => {
    try {
      cacheMiddleware(req, res, next);
    } catch (err) {
      logToFile(`Error in cacheMiddleware: ${err.stack}`, "CACHE_ERROR");
      console.error("cacheMiddleware error:", err);
      next(err);
    }
  });

  logToFile("Cache middlewares loaded successfully", "CACHE");
} catch (err) {
  console.error("Failed to load cache middlewares:", err);
  logToFile(`Failed to load cache middlewares: ${err.stack}`, "CACHE_ERROR");
}


const edithomepageRoutes = require("./routes/adpage_routes/editHomePageRoutes");
const doubleAdRoutes = require("./routes/adpage_routes/doubleAdPageRoutes");
const offersRoutes = require("./routes/offerspage_routes/offersPageRoutes");
const mobileOffersRoutes = require("./routes/offerspage_routes/mobileOffersRoutes");
const CCTVOffersPageRoutes = require("./routes/offerspage_routes/CCTVOffersPageRoutes");
const singleAdPageRoutes = require("./routes/adpage_routes/singleAdPageRoutes");

const loginBackgroundRoutes = require("./routes/loginbackground_routes/loginBackgroundRoutes");
const searchSuggestionsRoutes = require("./routes/search_suggestions_routes/searchSuggestionsRoutes");
const userAddressRoutes = require("./routes/user/userAddressRoutes");
const authenticationRoutes = require("./routes/authentication/authenticationRoutes");
const mostPopularProductsRoutes = require("./routes/most_popular_products/mostPopularProductsRoutes");
const contactRoutes = require("./routes/contact/contactRoutes");
const careerRoutes = require("./routes/contact/careerRoutes");
const userOrdersRoutes = require("./routes/user_orders/userOrdersRoutes");

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
const BranchReportRoutes = require("./routes/reports/branchReports.routes");
const staffRoutes = require("./routes/staffs/staffs.routes");
const accessoriesRoutes = require("./routes/accessories/accessories.routes");
const priceOfferRoutes = require("./routes/price_offer/price_offer.routes");
const productBannerRoutes = require("./routes/offerspage_routes/productBannerRoutes");
const otpRoutes = require("./routes/otp/otpRoutes");
const productStatusRoutes = require("./routes/products/productStatus.routes");
const branchRoutes = require("./routes/branch/branch.route.js");
const gstRoutes = require("./routes/gst/gst.route");
const notificationsRouter = require('./routes/notifications/notification.route');

// Register Routes
logToFile("Registering routes...", "ROUTES");

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
app.use("/backend/branch", BranchReportRoutes);
app.use("/backend", staffRoutes);
app.use("/backend", accessoriesRoutes);
app.use("/backend", priceOfferRoutes);
app.use("/backend", productBannerRoutes);
app.use("/backend", otpRoutes);
app.use("/backend", productStatusRoutes);
app.use("/backend/api/branch", branchRoutes);
app.use("/backend/api/gst", gstRoutes);
app.use('/backend/notifications', notificationsRouter);

logToFile("All routes registered successfully", "ROUTES");

// Health Route
app.get("/health", (req, res) => {
  res.send("OK");
});

// Root Route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// ======= Product Deep-Link Route =======
const https = require("https");

// ======= Product Deep-Link Route =======
app.get("/backend/shop/:productId", (req, res) => {
  const { productId } = req.params;
  const userAgent = req.headers['user-agent'] || "";
  const isIOS = /iPhone|iPad|iPod/i.test(userAgent);
  const isAndroid = /Android/i.test(userAgent);

  const appDeepLink = `seataxi://product/${productId}`;
  const playStoreUrl = `https://play.google.com/store/apps/details?id=com.oneclick.seasense`;
  const appStoreUrl = `https://apps.apple.com/app/your-app-id`;
  const webProductUrl = `https://oneclickteck.com/shop/${productId}`;

  // Function to check if web product exists
  function checkWebProduct(url, callback) {
    https
      .get(url, { method: "HEAD" }, (resp) => {
        callback(resp.statusCode === 200);
      })
      .on("error", () => callback(false));
  }

  if (isIOS || isAndroid) {
    checkWebProduct(webProductUrl, (exists) => {
      if (exists) {
        // Product exists → open web first
        res.send(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>Opening Product...</title>
            <script>
              window.location = "${webProductUrl}";
            </script>
          </head>
          <body>
            <div style="text-align:center; padding:50px;">
              <h2>Opening Product...</h2>
              <p>If the web page doesn't load, try again later.</p>
            </div>
          </body>
          </html>
        `);
      } else {
        // Product does not exist → fallback to app store
        res.send(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>Redirecting to SeaTaxi</title>
            ${isIOS ? `<meta name="apple-itunes-app" content="app-id=YOUR_APP_ID">` : ""}
            <script>
              window.location = "${appDeepLink}";
              setTimeout(function() {
                window.location = "${isIOS ? appStoreUrl : playStoreUrl}";
              }, 1000);
            </script>
          </head>
          <body>
            <div style="text-align:center; padding:50px;">
              <h2>Opening SeaTaxi App...</h2>
              <p>If the app doesn't open, you'll be redirected to ${isIOS ? "App Store" : "Play Store"}.</p>
            </div>
          </body>
          </html>
        `);
      }
    });
  } else {
    // Desktop → redirect directly to web
    res.redirect(webProductUrl);
  }
});

// ======= Fallback for unknown routes =======
app.get('*', (req, res) => res.redirect('https://oneclickteck.com'));

// ===== Error Handler =====
app.use((err, req, res, next) => {
  const errorMessage = `Error at ${req.method} ${req.originalUrl}: ${err.stack}`;
  console.error(errorMessage);
  logToFile(errorMessage, "ERROR");
  res.status(500).json({ message: "Internal Server Error", error: err.message });
});


// Process Level Error Logging
process.on("unhandledRejection", (reason, promise) => {
  const msg = `Unhandled Rejection at: ${promise}, reason: ${reason}`;
  console.error(msg);
  logToFile(msg, "UNHANDLED_REJECTION");
});

process.on("uncaughtException", (err) => {
  if (err.code === 'ECONNRESET') {
    logToFile(`ECONNRESET ignored: ${err.message}`, "WARNING");
    return;
  }

  const msg = `Uncaught Exception: ${err.stack}`;
  console.error(msg);
  logToFile(msg, "UNCAUGHT_EXCEPTION");

  if (msg.includes("Cannot enqueue Query after fatal error")) {
    logToFile("⚠️ DB connection lost. Restarting recommended or use pool.", "DB_FATAL");
  }
});

// Graceful Shutdown
process.on("SIGTERM", () => {
  const msg = "SIGTERM received. Server is shutting down gracefully.";
  console.log(msg);
  logToFile(msg, "SHUTDOWN");
  process.exit(0);
});

// Start Server
app.listen(port, () => {
  const msg = `Server running on port ${port}`;
  console.log(msg);
  logToFile(msg, "STARTUP");
});
