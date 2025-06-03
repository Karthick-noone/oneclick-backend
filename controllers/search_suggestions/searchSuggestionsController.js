const model = require('../../models/search_suggestions_model/searchSuggestionsModel');
// controllers/suggestionController.js

const synonymMapping = {
  xiaomi: "redmi",
  "one plus": "oneplus",
  oneplus: "oneplus",
};


const keywordMapping = {
  // Paste the entire keywordMapping object here
  Computers: ["laptop", "laptops", "desktop", "desktops", "computer", "computers", "notebook", "notebooks", "pc", "macbook", "ultrabook", "gaming pc", "all in one pc"],
  Mobiles: ["mobile", "mobiles", "smartphone", "smartphones", "phone", "phones", "android", "iphone", "iphones", "oneplus", "samsung", "redmi", "xiaomi", "cellphone"],
  CCTV: ["cctv", "cctvs", "security camera", "security cameras", "surveillance", "spy camera", "hidden camera", "dome camera", "bullet camera"],
  Printers: ["printer", "printers", "scanner", "scanners", "fax", "fax machine", "all-in-one printer", "laser printer", "inkjet printer", "thermal printer"],
  ComputerAccessories: ["keyboard", "computer accessories", "computer accessory", "computers accessories", "computers accessory", "keyboards", "mouse", "mice", "monitor", "monitors", "webcam", "webcams", "laptop charger", "laptop chargers", "usb hub", "external hard drive"],
  MobileAccessories: ["charger", "mobile accessories", "mobile accessory", "mobiles accessories", "mobiles accessory", "chargers", "back cover", "back covers", "screen protector", "screen protectors", "power bank", "power banks", "earphones", "bluetooth headset", "wireless charger"],
  Headphones: ["headphone", "headphones", "earphones", "earbuds", "bluetooth headphones", "wired headphones", "wireless headphones", "gaming headphones", "noise cancelling headphones"],
  Speakers: ["speaker", "speakers", "bluetooth speaker", "home theater", "sound system", "subwoofer", "portable speaker", "wireless speaker", "soundbar"],
  Watch: ["watch", "watches", "smartwatch", "smart watch", "fitness band", "fitness tracker", "apple watch", "android watch", "digital watch"],
  TV: ["tv", "television", "led tv", "smart tv", "oled tv", "qled tv", "4k tv", "android tv", "plasma tv", "lcd tv"],
  CCTVAccessories: ["cctv cable", "cctv accessories", "cctv accessory", "cctv adapter", "cctv power supply", "cctv connector", "cctv mounting bracket", "cctv lens", "cctv hard drive", "dvr", "nvr"],
  PrinterAccessories: ["printer cartridge", "printer accessories", "printer accessory", "printers accessories", "printers accessory", "ink cartridge", "toner", "printer cable", "printer paper", "laser toner", "ink refill", "printer stand"],
  SecondHandProducts: ["secondhand", "second-hand", "used", "pre-owned", "refurbished","refurbish", "renewed", "old", "reused", "resale", "second hand mobiles", "second hand laptops", "used electronics"]
};

exports.getSuggestions = (req, res) => {
  let query = req.query.query?.toLowerCase().trim();
  if (!query) return res.status(400).json({ message: "Query required" });

  if (synonymMapping[query]) {
    query = synonymMapping[query];
  }

  const normalizedQuery = query.replace(/\s+/g, '');

  for (const [category, keywords] of Object.entries(keywordMapping)) {
    const matchFound = keywords.some(keyword => {
      const normalizedKeyword = keyword.toLowerCase().replace(/\s+/g, '');
      return normalizedKeyword === normalizedQuery || keyword.toLowerCase() === query;
    });

    if (matchFound) {
      return res.json({ suggestions: [category] });
    }
  }

  const searchTerm = `%${normalizedQuery}%`;
  model.searchSuggestions(searchTerm, (error, results) => {
    if (error) return res.status(500).json({ message: "Internal server error" });
    if (results.length > 0) {
      const suggestions = results.map(r => r.prod_name || r.category);
      return res.json({ suggestions });
    } else {
      return res.status(404).json({ message: "No suggestions found" });
    }
  });
};

exports.getSuggestedCategory = (req, res) => {
  let query = req.query.query?.toLowerCase().trim();
  if (!query) return res.status(400).json({ message: "Query required" });

  if (synonymMapping[query]) {
    query = synonymMapping[query];
  }

  const normalizedQuery = query.replace(/\s+/g, '');

  // 🔍 STEP 1: Direct match with category name
  for (const category of Object.keys(keywordMapping)) {
    if (
      category.toLowerCase().replace(/\s+/g, '') === normalizedQuery ||
      category.toLowerCase() === query
    ) {
      return res.json({ category });
    }
  }

  // 🔍 STEP 2: Match with keywords list
  for (const [category, keywords] of Object.entries(keywordMapping)) {
    const matchFound = keywords.some(keyword => {
      const normalizedKeyword = keyword.toLowerCase().replace(/\s+/g, '');
      return normalizedKeyword === normalizedQuery || keyword.toLowerCase() === query;
    });

    if (matchFound) {
      return res.json({ category });
    }
  }

  // 🔍 STEP 3: Fallback: check for "accessory" keywords
  if (query.includes("accessory")) {
    for (const [category, keywords] of Object.entries(keywordMapping)) {
      if (category.endsWith("Accessories")) {
        const accessoryMatch = keywords.some(keyword => {
          const normalizedKeyword = keyword.toLowerCase().replace(/\s+/g, '');
          return normalizedQuery.includes(normalizedKeyword);
        });
        if (accessoryMatch) {
          return res.json({ category });
        }
      }
    }
  }

  // 🔍 STEP 4: Fallback to DB
  const searchTerm = `%${normalizedQuery}%`;
  model.searchCategoryOnly(searchTerm, (error, results) => {
    if (error) return res.status(500).json({ message: "Internal server error" });
    if (results.length > 0) {
      return res.json({ category: results[0].category });
    } else {
      return res.status(404).json({ message: "No category found" });
    }
  });
};
