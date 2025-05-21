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

// Create a team member (joins an existing group)
exports.createTeamMember = async (req, res) => {
    try {
      const { userId, groupId, dealId, contribution, productPhoto } = req.body;
  
      const groupMember = new GroupMember({
        userId,
        groupId,
        dealId,
        contribution,
        productPhoto,
        isVerified: false, // Needs admin approval
        role: "team-member"
      });
  
      await groupMember.save();
      res.status(201).json({ msg: "Team member request submitted", groupMember });
    } catch (error) {
      res.status(500).json({ msg: "Server Error", error });
    }
  };