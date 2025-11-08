const model = require("../../models/reports/branchReports.model");

exports.getSalesReport = (req, res) => {
  model.getSalesReport((err, results) => {
    if (err) return res.status(500).send("Error fetching sales report");
    res.json(results);
    // console.log("SalesReport", results)
  });
};

exports.getOrdersReport = (req, res) => {
  model.getOrdersReport((err, results) => {
    if (err) return res.status(500).send("Error fetching orders report");
    res.json(results);
  });
};

exports.getCustomersReport = (req, res) => {
  model.getCustomersReport((err, results) => {
    if (err) return res.status(500).send("Error fetching customers report");
    res.json(results);
  });
};

// Fetch order details for one customer
exports.getCustomerOrdersByMobile = (req, res) => {
  const { mobile } = req.params;


  model.getCustomerOrdersByMobile(mobile, (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Failed to fetch customer orders" });
    }

    res.json(data);
  });
};

exports.deleteSalesReport = (req, res) => {
  model.deleteSalesReport(req.params.id, (err, result) => {
    if (err) return res.status(500).json({ message: "Error deleting sales report" });
    res.status(200).json({ message: "Sales report deleted successfully" });
  });
};

exports.deleteOrderReport = (req, res) => {
  model.deleteOrderReport(req.params.id, (err, result) => {
    if (err) return res.status(500).json({ message: "Error deleting order report" });
    res.status(200).json({ message: "Order report deleted successfully" });
  });
};

exports.deleteCustomerReport = (req, res) => {
  model.deleteCustomerReport(req.params.id, (err, result) => {
    if (err) return res.status(500).json({ message: "Error deleting customer report" });
    res.status(200).json({ message: "Customer report deleted successfully" });
  });
};

exports.getUsers = (req, res) => {
  model.getUsers((err, results) => {
    if (err) return res.status(500).send("Error fetching users");
    res.json(results);
    // console.log('useraddress', results)
  });
};

exports.deleteUser = (req, res) => {
  const id = req.params.id;
  console.log(`Received request to delete user with ID: ${id}`);

  // Step 1: Get user_id from oneclick_users using id
  model.getUserIdById(id, (err, rows) => {
    if (err) {
      console.error("Error fetching user_id:", err);
      return res.status(500).json({ message: "Failed to fetch user info" });
    }

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const userId = rows[0].user_id;

    // Step 2: Delete related addresses using user_id
    model.deleteUserAddresses(userId, (err, addressResult) => {
      if (err) {
        console.error(`Error deleting addresses for user_id ${userId}:`, err);
        return res.status(500).json({ message: "Failed to delete user addresses" });
      }

      console.log(`Deleted ${addressResult.affectedRows} address(es) for user_id ${userId}`);

      // Step 3: Delete user using id
      model.deleteUser(id, (err, result) => {
        if (err) {
          console.error(`Error deleting user with ID ${id}:`, err);
          return res.status(500).json({ message: "Failed to delete user" });
        }

        if (result.affectedRows > 0) {
          res.status(200).json({ message: "User and related addresses deleted successfully" });
        } else {
          res.status(404).json({ message: "User not found" });
        }
      });
    });
  });
};




exports.getPendingPayments = (req, res) => {
  model.getPendingPayments((error, results) => {
    if (error) {
      return res.status(500).json({ message: "Server error" });
    }
    res.status(200).json(results); // Send the fetched pending payments data as response
  });
};



// Fetch Product Categories for Pie Chart
exports.getProductCategories = (req, res) => {
  model.getProductCategories((error, results) => {
    if (error) {
      return res.status(500).json({ message: "Error fetching product categories" });
    }
    res.status(200).json(results); // Return product categories data
  });
};

// Fetch Product Categories and Total Amount
exports.getProductCategoryAmounts = (req, res) => {
  model.getProductCategoryAmounts((error, results) => {
    if (error) {
      return res.status(500).json({ message: "Error fetching product category amounts" });
    }
    res.status(200).json(results); // Return product category total amount data
  });
};
exports.getProductCountByCategory = (req, res) => {
  const { branch_id, userRole } = req.query;

  console.log("\n📦 [Controller] getProductCountByCategory called");
  console.log("➡️ branch_id:", branch_id);
  console.log("➡️ userRole:", userRole);

  model.getProductCountByCategory(branch_id, userRole, (err, results) => {
    if (err) {
      console.error("❌ Error fetching product count:", err);
      return res.status(500).json({ message: "Error fetching product count" });
    }

    console.log("✅ product count result:", results);
    res.status(200).json(results);
  });
};


exports.getTotalProducts = (req, res) => {
  const { branch_id, userRole } = req.query;

  console.log("\n📦 [Controller] getTotalProducts called");
  console.log("➡️ branch_id:", branch_id);
  console.log("➡️ userRole:", userRole);

  model.getTotalProducts(branch_id, userRole, (err, result) => {
    if (err) {
      console.error("❌ Error fetching total products:", err);
      return res.status(500).json({ message: "Error fetching total products" });
    }

    console.log("✅ total products:", result[0]);
    res.status(200).json(result[0]);
  });
};


// exports.getStaffCounts = (req, res) => {
//   const { branch_id, userRole } = req.query;

//   console.log("\n📦 [Controller] getStaffCounts called");
//   console.log("➡️ branch_id:", branch_id);
//   console.log("➡️ userRole:", userRole);

//   model.getStaffCounts(branch_id, userRole, (err, result) => {
//     if (err) {
//       console.error("❌ Error fetching total staff:", err);
//       return res.status(500).json({ message: "Error fetching total staff" });
//     }

//     console.log("✅ total staff count:", result[0]);
//     res.status(200).json(result[0]);
//   });
// };
exports.getStaffCounts = (req, res) => {
  const { branch_id, userRole } = req.query;

  model.getStaffCounts(branch_id, userRole, (err, result) => {
    if (err) return res.status(500).json({ message: "Error fetching total staff" });
    res.status(200).json(result[0]);
  });
};

