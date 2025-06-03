const express = require("express");
const router = express.Router();
const accessoriesController = require("../../controllers/accessories/accessories.controller");

router.get("/getcomputeraccessories", accessoriesController.getAccessoriesByCategory("ComputerAccessories"));
router.get("/getmobileaccessories", accessoriesController.getAccessoriesByCategory("MobileAccessories"));
router.get("/getcctvaccessories", accessoriesController.getAccessoriesByCategory("CCTVAccessories"));
router.get("/getprinteraccessories", accessoriesController.getAccessoriesByCategory("PrinterAccessories"));
router.post("/addfrequentlybuy", accessoriesController.addFrequentlyBuyAccessories);

module.exports = router;
