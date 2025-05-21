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