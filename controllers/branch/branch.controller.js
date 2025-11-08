const {
  createBranch,
  getBranchByPhone,
  verifyPassword,
  checkBranchUnique,
  getAllBranches,
  toggleBranchStatus,
  deleteBranch,
  getAllProducts,
  getProductById
} = require("../../models/branch/branch.model");

// Branch registration
const registerBranch = (req, res) => {
  const branchData = req.body;

  if (!branchData.branch_name || !branchData.email || !branchData.password) {
    return res.status(400).json({ message: "Branch name, email and password are required." });
  }

  // Check uniqueness
  checkBranchUnique(branchData, (err, existing) => {
    if (err) return res.status(500).json({ message: "Database error" });

    if (existing.length > 0) {
      const duplicates = [];
      existing.forEach((row) => {
        // Only check GSTIN if branchData.gstin is not empty
        if (branchData.gstin && row.gstin === branchData.gstin) duplicates.push("GSTIN");
        if (row.phone === branchData.phone) duplicates.push("Phone");
        if (row.email === branchData.email) duplicates.push("Email");
      });

      if (duplicates.length > 0) {
        return res.status(400).json({ message: `${duplicates.join(", ")} already exists` });
      }
    }


    // If unique, create branch
    createBranch(branchData, (err, result) => {
      if (err) return res.status(500).json({ message: "Failed to register branch." });
      res.status(201).json({ message: "Branch registered successfully!", branch: result });
    });
  });
};
// Branch login
const loginBranch = (req, res) => {
  const { phone, password } = req.body;

  if (!phone || !password) {
    return res.status(400).json({ message: "Phone and password are required" });
  }

  getBranchByPhone(phone, async (err, branch) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (!branch) return res.status(401).json({ message: "Branch not found" });

    if (branch.status !== "active") {
      return res.status(403).json({ message: "Branch is inactive. Contact admin." });
    }

    const isMatch = await verifyPassword(password, branch.password);
    if (!isMatch) return res.status(401).json({ message: "Incorrect password" });

    res.status(200).json({ message: "Login successful", branch });
  });
};


// Get all branches
const fetchBranches = (req, res) => {
  getAllBranches((err, branches) => {
    if (err) return res.status(500).json({ message: "Failed to fetch branches" });
    res.json({ branches });
  });
};

// Toggle branch status
const toggleStatus = (req, res) => {
  const { branchId } = req.params;
  const { status } = req.body;

  toggleBranchStatus(branchId, status, (err, newStatus) => {
    if (err) return res.status(500).json({ message: "Failed to update status" });
    res.json({ message: "Status updated", status: newStatus });
  });
};

// Delete branch
const removeBranch = (req, res) => {
  const { branchId } = req.params;

  deleteBranch(branchId, (err) => {
    if (err) return res.status(500).json({ message: "Failed to delete branch" });
    res.json({ message: "Branch deleted successfully" });
  });
};

// ✅ Fetch all products (with optional branch or status filter)
const fetchAllProducts = (req, res) => {
  const { branch_id, status } = req.query;

  getAllProducts({ branch_id, status }, (err, products) => {
    if (err) return res.status(500).json({ message: "Failed to fetch products" });
    res.status(200).json({ products });
  });
};

// ✅ Fetch single product by ID
const fetchSingleProduct = (req, res) => {
  const { id } = req.params;

  getProductById(id, (err, product) => {
    if (err) return res.status(500).json({ message: "Failed to fetch product" });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json({ product });
  });
};

module.exports = {
  registerBranch,
  loginBranch,
  fetchBranches,
  toggleStatus,
  removeBranch,
  fetchAllProducts,
  fetchSingleProduct
};