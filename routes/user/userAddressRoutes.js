const express = require('express');
const router = express.Router();
const userAddressController = require('../../controllers/user/userAddressController');

// Route to handle address submission
router.post('/useraddress', userAddressController.addAddress);

// Route to update an address
router.put('/updateuseraddress/:id', userAddressController.updateAddress);

// Route to check for existing address
router.post('/checkAddressExists', userAddressController.checkAddressExists);

// Route to check if phone number exists for a different user
router.post('/checkPhoneNumber', userAddressController.checkPhoneNumber);

// Route to delete an address
router.delete('/deleteuseraddress/:address_id', userAddressController.deleteAddress);

// Route to fetch addresses for a specific user
router.get('/useraddress/:userId', userAddressController.fetchAddresses);

// Route to fetch the current address for a specific user
router.get('/singleaddress/:userId', userAddressController.fetchSingleAddress);

// Route to update the current address
router.post('/update-current-address', userAddressController.updateCurrentAddress);

module.exports = router;
