const NodeCache = require("node-cache");
const apiCache = new NodeCache({ stdTTL: 600, checkperiod: 120 }); // 10 min cache

// Cache middleware for GET requests
function cacheMiddleware(req, res, next) {
  if (req.method !== "GET") return next(); // Only cache GET requests

  const cacheKey = req.originalUrl;
  if (apiCache.has(cacheKey)) {
    console.log(` Cache HIT: ${cacheKey}`);
    return res.json(apiCache.get(cacheKey));
  }

  console.log(` Cache MISS: ${cacheKey}`);

  // Override res.json to store response in cache
  const originalJson = res.json.bind(res);
  res.json = (data) => {
    apiCache.set(cacheKey, data);
    console.log(` Cache STORED: ${cacheKey}`);
    return originalJson(data);
  };

  next();
}

// Clear cache on data-changing methods
function clearCacheMiddleware(req, res, next) {
  if (["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) {
    console.log(` Clearing all GET caches due to ${req.method} ${req.originalUrl}`);
    apiCache.flushAll();
  }
  next();
}

module.exports = { cacheMiddleware, clearCacheMiddleware };
