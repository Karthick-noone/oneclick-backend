const express = require("express");
const router = express.Router();
const branchController = require("../../controllers/branch/branch.controller");

// Route to register a new branch
router.post("/branch-register", branchController.registerBranch);
router.post("/branch-login", branchController.loginBranch);
// Branch management
router.get("/get-all", branchController.fetchBranches);
router.post("/toggle-status/:branchId", branchController.toggleStatus);
router.delete("/delete/:branchId", branchController.removeBranch);


router.get("/branch-products", branchController.fetchAllProducts);
router.get("/branch-product/:id", branchController.fetchSingleProduct);

module.exports = router;
