const priceOfferModel = require("../../models/price_offer/price_offer.model");

exports.addOffer = async (req, res) => {
  const { productId, offer_start_time, offer_end_time, offer_price } = req.body;
  try {
    await priceOfferModel.insertOffer(productId, offer_start_time, offer_end_time, offer_price);
    res.status(200).json({ message: "Offer created successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error creating offer" });
  }
};

exports.updateOffer = async (req, res) => {
  const { offer_start_time, offer_end_time, offer_price } = req.body;
  const { id } = req.params;
  try {
    await priceOfferModel.updateOffer(id, offer_start_time, offer_end_time, offer_price);
    res.status(200).json({ message: "Offer updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error updating offer" });
  }
};

exports.deleteOffer = async (req, res) => {
  const { id } = req.params;
  try {
    await priceOfferModel.deleteOffer(id);
    res.status(200).json({ message: "Offer deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting offer" });
  }
};

exports.fetchOffer = async (req, res) => {
  const { id } = req.params;
  try {
    const offer = await priceOfferModel.fetchOffer(id);
    if (!offer) return res.status(404).json({ error: "Offer not found" });
    res.status(200).json(offer);
  } catch (err) {
    res.status(500).json({ error: "Error fetching offer details" });
  }
};
