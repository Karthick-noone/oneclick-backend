const NodeCache = require("node-cache");
const path = require("path");
const fs = require("fs");

const apiCache = new NodeCache({ stdTTL: 600, checkperiod: 120 }); // 10 min cache

// Log to server.log file
function logToFile(message, type = "CACHE") {
  const logFilePath = path.join(__dirname, "../server.log");
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] [${type}] ${message}\n`;
  fs.appendFile(logFilePath, logEntry, (err) => {
    if (err) console.error("Failed to write cache log:", err);
  });
}

// Cache middleware for GET requests
function cacheMiddleware(req, res, next) {
  if (req.method !== "GET") return next(); // Only cache GET requests

  const cacheKey = req.originalUrl;
  if (apiCache.has(cacheKey)) {
    const msg = `✅ Cache HIT: ${cacheKey}`;
    // console.log(msg);
    logToFile(msg, "CACHE_HIT");
    return res.json(apiCache.get(cacheKey));
  }

  const msg = `❌ Cache MISS: ${cacheKey}`;
  // console.log(msg);
  logToFile(msg, "CACHE_MISS");

  // Override res.json to store response in cache
  const originalJson = res.json.bind(res);
  res.json = (data) => {
    try {
      apiCache.set(cacheKey, data);
      const storeMsg = `📦 Cache STORED: ${cacheKey}`;
      // console.log(storeMsg);
      logToFile(storeMsg, "CACHE_STORE");
    } catch (err) {
      const errorMsg = `⚠️ Failed to store cache for ${cacheKey}: ${err.message}`;
      console.error(errorMsg);
      logToFile(errorMsg, "CACHE_ERROR");
    }
    return originalJson(data);
  };

  next();
}

// Clear cache on data-changing methods
function clearCacheMiddleware(req, res, next) {
  if (["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) {
    const msg = `🧹 Clearing all GET caches due to ${req.method} ${req.originalUrl}`;
    // console.log(msg);
    logToFile(msg, "CACHE_CLEAR");
    try {
      apiCache.flushAll();
    } catch (err) {
      const errorMsg = `⚠️ Failed to clear cache: ${err.message}`;
      console.error(errorMsg);
      logToFile(errorMsg, "CACHE_ERROR");
    }
  }
  next();
}

module.exports = { cacheMiddleware, clearCacheMiddleware };
