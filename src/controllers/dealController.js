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
    // ✅ Debug print for io
    const io = req.app.get("io");
    if (!io) {
      console.error(" io is not available from req.app");
    } else {
      console.log(" io is available, emitting event");
      io.emit("new_deal", {
        msg: "A new deal has been added \n",
        deal: newDeal,
      });
    }

    res.status(201).json({ msg: "Deal created successfully", deal: newDeal });
  } catch (error) {
    console.error(" Error in createDeal:", error);
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

    // Find deals that will be expired
    const dealsToExpire = await Deal.find({
      deadline: { $lt: now },
      is_active: true
    });

    if (dealsToExpire.length === 0) {
      return res.status(200).json({ msg: "No deals to expire", modifiedCount: 0 });
    }

    // Expire them
    await Deal.updateMany(
      { _id: { $in: dealsToExpire.map((d) => d._id) } },
      { is_active: false }
    );

    // Emit for each expired deal
    const io = req.app.get("io");
    if (io) {
      dealsToExpire.forEach((deal) => {
        io.emit("deal_expired", {
          msg: "A deal has expired!",
          deal: {
            _id: deal._id,
            title: deal.title,
            image_url: deal.image_url,
            deadline: deal.deadline,
          },
        });
      });
    }

    res.status(200).json({
      msg: "Expired deals updated successfully",
      modifiedCount: dealsToExpire.length
    });
  } catch (error) {
    res.status(500).json({ msg: "Server Error", error });
  }
};

// Get a single deal by ID
exports.getDealById = async (req, res) => {
  try {
    const deal = await Deal.findById(req.params.id);
    if (!deal) return res.status(404).json({ msg: "Deal not found" });
    res.json({ msg: "Deal fetched successfully", deal });
  } catch (error) {
    res.status(500).json({ msg: "Server Error", error });
  }
};

// Update a deal by ID
exports.updateDeal = async (req, res) => {
  try {
    const updatedDeal = await Deal.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedDeal) return res.status(404).json({ msg: "Deal not found" });
    res.json({ msg: "Deal updated", deal: updatedDeal });
  } catch (error) {
    res.status(500).json({ msg: "Server Error", error });
  }
};

// Soft delete a deal
exports.deleteDeal = async (req, res) => {
  try {
    const deleted = await Deal.findByIdAndUpdate(
      req.params.id,
      { is_active: false },
      { new: true }
    );
    if (!deleted) return res.status(404).json({ msg: "Deal not found" });
    res.json({ msg: "Deal soft deleted", deal: deleted });
  } catch (error) {
    res.status(500).json({ msg: "Server Error", error });
  }
};

// Soft delete a deal
exports.softDeleteDeal = async (req, res) => {
  try {
    const deal = await Deal.findById(req.params.id);
    if (!deal) return res.status(404).json({ msg: "Deal not found" });

    deal.is_active = false;
    await deal.save();

    res.status(200).json({ msg: "Deal soft deleted successfully", deal });
  } catch (error) {
    res.status(500).json({ msg: "Server Error", error });
  }
};
