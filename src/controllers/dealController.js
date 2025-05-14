const Deal = require("../models/Deal");

exports.createDeal = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      original_price,
      deadline,
      location,
      max_participants,
      category,
      image_url,
    } = req.body;

    const newDeal = new Deal({
      title,
      description,
      price,
      original_price,
      deadline,
      location,
      max_participants,
      creator: req.user.user_id,
      participants: [req.user.user_id],
      category,
      image_url,
    });

    await newDeal.save();
    res.status(201).json({ msg: "Deal created successfully", deal: newDeal });
  } catch (error) {
    res.status(500).json({ msg: "Server Error", error });
  }
};

// Get all deals
exports.getDeals = async (req, res) => {
  try {
    const deals = await Deal.find().sort({ createdAt: -1 }); // Latest first
    res.json({ msg: "Deals fetched successfully", deals });
  } catch (error) {
    res.status(500).json({ msg: "Server Error", error });
  }
};

// Manually expire all deals past their deadline
exports.expireDeals = async (req, res) => {
  try {
    const now = new Date();

    const expiredDeals = await Deal.updateMany(
      { deadline: { $lt: now }, is_active: true },
      { is_active: false }
    );

    res.status(200).json({
      msg: "Expired deals updated successfully",
      modifiedCount: expiredDeals.modifiedCount
    });
  } catch (error) {
    res.status(500).json({ msg: "Server Error", error });
  }
};
