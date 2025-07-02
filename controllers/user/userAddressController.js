const UserAddress = require('../../models/user/userAddressModel');

exports.addAddress = (req, res) => {
  const { userId, address } = req.body;

  if (!userId || !address) {
    return res.status(400).send("User  ID and address are required");
  }

  UserAddress.addAddress(userId, address, (err) => {
    if (err) {
      console.error("Error adding address:", err);
      return res.status(500).send("Server error");
    }
    res.status(200).send("Address added successfully");
  });
};

exports.updateAddress = (req, res) => {
  const addressId = req.params.id;
  const updatedAddress = req.body;

  UserAddress.updateAddress(addressId, updatedAddress, (err, results) => {
    if (err) {
      console.error("Error updating address:", err);
      return res.status(500).json({ message: "Error updating address" });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Address not found" });
    }
    res.json({ message: "Address updated successfully" });
  });
};

exports.checkAddressExists = (req, res) => {
  const { userId, address } = req.body;

  if (!userId || !address) {
    return res.status(400).send("User  ID and address are required");
  }

  UserAddress.checkAddressExists(userId, address, (err, results) => {
    if (err) {
      console.error("Error checking address:", err);
      return res.status(500).send("Server error");
    }

    const count = results[0].count;
    if (count > 0) {
      return res.status(409).send("Address already exists"); // Conflict
    }

    return res.status(200).send("Address does not exist"); // Address is unique
  });
};

exports.checkPhoneNumber = (req, res) => {
  const { phone, userId } = req.body;

  if (!phone) {
    return res.status(400).send("Phone number is required");
  }

  UserAddress.checkPhoneNumber(phone, userId, (err, results) => {
    if (err) {
      console.error("Error checking phone number:", err);
      return res.status(500).send("Server error");
    }

    if (results[0].count > 0) {
      return res.status(200).send("Phone number exists for a different user");
    } else {
      return res.status(404).send("Phone number does not exist for a different user");
    }
  });
};

exports.deleteAddress = (req, res) => {
  const addressId = req.params.address_id;

  if (!addressId) {
    return res.status(400).json({ message: "Address ID is required" });
  }

  UserAddress.deleteAddress(addressId, (err, results) => {
    if (err) {
      console.error("Error deleting address:", err);
      return res.status(500).json({ message: "Error deleting address" });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Address not found" });
    }
    res.json({ message: "Address deleted successfully" });
  });
};

exports.fetchAddresses = (req, res) => {
  const userId = req.params.userId;

  UserAddress.fetchAddresses(userId, (err, results) => {
    if (err) {
      console.error("Error fetching addresses:", err);
      return res.status(500).send("Server Error");
    }
    res.json(results);
  });
};

exports.fetchSingleAddress = (req, res) => {
  const userId = req.params.userId;

  UserAddress.fetchSingleAddress(userId, (err, results) => {
    if (err) {
      console.error("Error fetching addresses:", err);
      return res.status(500).send("Server Error");
    }
    res.json(results);
  });
};

exports.updateCurrentAddress = (req, res) => {
  const { userId, addressId } = req.body;

  UserAddress.updateCurrentAddress(userId, addressId, (err, results) => {
    if (err) {
      console.error("Error updating address:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
    res.status(200).json({
      message: "Address updated successfully",
      affectedRows: results.affectedRows
    });
  });
};


