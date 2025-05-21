const GroupMember = require("../models/groupMember");

// Create a group admin (first member who creates the group)
exports.createAdminGroupMember = async (req, res) => {
    try {
      const { userId, groupId, dealId, contribution, productPhoto } = req.body;
  
      const groupMember = new GroupMember({
        userId,
        groupId,
        dealId,
        contribution,
        productPhoto,
        isVerified: true, 
        role: "admin"
      });
  
      await groupMember.save();
      res.status(201).json({ msg: "Admin group member created successfully", groupMember });
    } catch (error) {
      res.status(500).json({ msg: "Server Error", error });
    }
  };