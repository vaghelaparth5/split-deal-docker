const Group = require("../models/Group");

// Create a new group
exports.createGroup = async (req, res) => {
  try {
    const {
      dealId,
      dealLogo,
      dealTitle,
      dealDescription,
      storeName,
      storeLocation,
      totalValue,
      discount,
      expiryDate,
      membersRequired,
      receiptImage,
    } = req.body;

    // Create and save group
    const group = new Group({
      dealId,
      dealLogo,
      dealTitle,
      dealDescription,
      storeName,
      storeLocation,
      totalValue,
      discount,
      expiryDate: new Date(expiryDate), // Ensure it's saved as a Date object
      membersRequired,
      receiptImage,
    });
    await group.save();

    const io = req.app.get("io");
    if (io) {
      io.emit("new_group", {
        msg: "A new group has been created",
        group,
      });
    }

    res.status(201).json({ msg: "Group created successfully", group });
  } catch (error) {
    res.status(500).json({ msg: "Server Error", error });
  }
};

exports.updateGroupStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const group = await Group.findByIdAndUpdate(
      id,
      { status },
      { new: true } // Return the updated document
    );
    if (!group) return res.status(404).json({ msg: "Group not found" });

    res.json({ msg: "Group status updated successfully", group });
  } catch (error) {
    res.status(500).json({ msg: "Server Error", error });
  }
};
exports.getAllGroups = async (req, res) => {
  try {
    const groups = await Group.find();
    res.json(groups);
  } catch (error) {
    res.status(500).json({ msg: "Server Error", error });
  }
};

//  Get group by ID
exports.getGroupById = async (req, res) => {
  try {
    const { id } = req.params;
    const group = await Group.findById(id);
    if (!group) return res.status(404).json({ msg: "Group not found" });
    res.json(group);
  } catch (error) {
    res.status(500).json({ msg: "Server Error", error });
  }
};

exports.deleteGroup = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the group
    const group = await Group.findByIdAndDelete(id);

    if (!group) return res.status(404).json({ msg: "Group not found" });

    res.json({ msg: "Group deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Server Error", error });
  }
};

exports.updateReceiptImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { receiptImage } = req.body;

    if (!receiptImage) {
      return res.status(400).json({ msg: "Receipt image URL is required" });
    }

    const group = await Group.findByIdAndUpdate(
      id,
      { receiptImage },
      { new: true } // Return the updated document
    );

    if (!group) return res.status(404).json({ msg: "Group not found" });

    res.json({ msg: "Receipt image updated successfully", group });
  } catch (error) {
    res.status(500).json({ msg: "Server Error", error });
  }
};

exports.updateMembersRequired = async (req, res) => {
  try {
    const { id } = req.params;
    const { membersRequired } = req.body;

    // Check if it's a number and >= 1
    if (
      membersRequired === undefined ||
      isNaN(membersRequired) ||
      Number(membersRequired) < 1
    ) {
      return res.status(400).json({ msg: "Valid membersRequired value is required" });
    }

    const group = await Group.findByIdAndUpdate(
      id,
      { membersRequired: Number(membersRequired) },
      { new: true }
    );

    if (!group) {
      return res.status(404).json({ msg: "Group not found" });
    }

    res.json({ msg: "Members required updated successfully", group });
  } catch (error) {
    res.status(500).json({ msg: "Server Error", error });
  }
};
