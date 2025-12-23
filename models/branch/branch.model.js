const db = require("../../config/db"); // MySQL connection
const bcrypt = require("bcryptjs");

// Check if gstin, phone, or email already exists
const checkBranchUnique = (branchData, callback) => {
  const sql = `
    SELECT * FROM oneclick_branches 
    WHERE gstin = ? OR phone = ? OR email = ?`;
  db.query(sql, [branchData.gstin, branchData.phone, branchData.email], (err, results) => {
    if (err) return callback(err);
    callback(null, results);
  });
};

// Create a new branch
const createBranch = async (branchData, callback) => {
  try {
    const hashedPassword = await bcrypt.hash(branchData.password, 10);

    const sql = `INSERT INTO oneclick_branches 
      (branch_name, company, gstin, owner_name, contact_person, password, email, phone, address, city, place, state, country, pincode, status, joined_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURDATE())`;

    const params = [
      branchData.branch_name,
      branchData.company,
      branchData.gstin,
      branchData.owner_name,
      branchData.contact_person,
      hashedPassword,
      branchData.email,
      branchData.phone,
      branchData.address,
      branchData.city,
      branchData.place,
      branchData.state,
      branchData.country,
      branchData.pincode,
      branchData.status || "pending",
    ];

    db.query(sql, params, function (err, result) {
      if (err) return callback(err);
      callback(null, { id: result.insertId, ...branchData });
    });
  } catch (err) {
    callback(err);
  }
};

// Get branch by phone
const getBranchByPhone = (phone, callback) => {
  const sql = `SELECT * FROM oneclick_branches WHERE phone = ? ORDER BY id DESC`;
  db.query(sql, [phone], (err, results) => {
    if (err) return callback(err);
    if (results.length === 0) return callback(null, null);
    callback(null, results[0]);
  });
};

// Verify password
const verifyPassword = async (inputPassword, hashedPassword) => {
  return await bcrypt.compare(inputPassword, hashedPassword);
};

// Get all branches
const getAllBranches = (callback) => {
  const sql = `SELECT * FROM oneclick_branches ORDER BY id DESC`;
  db.query(sql, (err, results) => {
    if (err) return callback(err);
    callback(null, results);
  });
};

// ✅ Toggle branch status (with approved date update)
const toggleBranchStatus = (branchId, newStatus, callback) => {
  const sql =
    newStatus === "active"
      ? `UPDATE oneclick_branches SET status = ?, joined_date = NOW() WHERE id = ?`
      : `UPDATE oneclick_branches SET status = ? WHERE id = ?`;

  db.query(sql, [newStatus, branchId], (err) => {
    if (err) return callback(err);

    // ✅ Return current date when approved
    const approvedDate =
      newStatus === "active" ? new Date().toISOString() : null;

    callback(null, { status: newStatus, approved_date: approvedDate });
  });
};


// Delete branch
const deleteBranch = (branchId, callback) => {
  const sql = `DELETE FROM oneclick_branches WHERE id = ?`;
  db.query(sql, [branchId], (err) => {
    if (err) return callback(err);
    callback(null);
  });
};

// Fetch all products (optionally filtered by branch_id or status)
const getAllProducts = (filters = {}, callback) => {
  let sql = "SELECT * FROM oneclick_product_category WHERE 1=1";
  const params = [];

  if (filters.branch_id) {
    sql += " AND branch_id = ?";
    params.push(filters.branch_id);
  }

  if (filters.status) {
    sql += " AND status = ?";
    params.push(filters.status);
  }

  sql += " ORDER BY id DESC";

  db.query(sql, params, (err, results) => {
    if (err) return callback(err);
    callback(null, results);
  });
};

// Fetch single product by ID
const getProductById = (id, callback) => {
  const sql = "SELECT * FROM oneclick_product_category WHERE id = ?";
  db.query(sql, [id], (err, results) => {
    if (err) return callback(err);
    if (results.length === 0) return callback(null, null);
    callback(null, results[0]);
  });
};


module.exports = { getAllProducts, getProductById, createBranch, getBranchByPhone, verifyPassword, checkBranchUnique, deleteBranch, toggleBranchStatus, getAllBranches };
