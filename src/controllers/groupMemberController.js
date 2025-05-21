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

  // Delete a team member from a group (Only Admin can remove)
exports.deleteTeamMember = async (req, res) => {
    try {
      const { id } = req.params;
  
      const groupMember = await GroupMember.findByIdAndDelete(id);
      if (!groupMember) return res.status(404).json({ msg: "Team member not found" });
  
      res.json({ msg: "Team member removed successfully" });
    } catch (error) {
      res.status(500).json({ msg: "Server Error", error });
    }
  };

  // Verify a team member (Admin approval)
exports.verifyTeamMember = async (req, res) => {
    try {
      const { id } = req.params;
      const { isVerified } = req.body;
  
      const groupMember = await GroupMember.findByIdAndUpdate(
        id,
        { isVerified },
        { new: true }
      );
  
      if (!groupMember) return res.status(404).json({ msg: "Team member not found" });
  
      res.json({ msg: "Team member verification status updated", groupMember });
    } catch (error) {
      res.status(500).json({ msg: "Server Error", error });
    }
  };

  // Update ratingsProvided status
exports.updateRatingsProvided = async (req, res) => {
    try {
      const { id } = req.params;
      const { ratingsProvided } = req.body;
  
      if (!["not submitted", "skipped", "submitted"].includes(ratingsProvided)) {
        return res.status(400).json({ msg: "Invalid ratingsProvided status" });
      }
  
      const groupMember = await GroupMember.findByIdAndUpdate(
        id,
        { ratingsProvided },
        { new: true }
      );
  
      if (!groupMember) return res.status(404).json({ msg: "Team member not found" });
  
      res.json({ msg: "Ratings status updated successfully", groupMember });
    } catch (error) {
      res.status(500).json({ msg: "Server Error", error });
    }
  };

  // Get all group members by groupId
  exports.getGroupMembersByGroupId = async (req, res) => {
    try {
      const { groupId } = req.params;
  
      // Find all group members with the given groupId
      const groupMembers = await GroupMember.find({ groupId })
        .populate("userId", "name email") // Populate user details (optional)
        .populate("dealId", "dealName dealDesc"); // Populate deal details (optional)
  
      if (!groupMembers || groupMembers.length === 0) {
        return res.status(404).json({ msg: "No group members found for this group" });
      }
  
      res.json({ msg: "Group members fetched successfully", groupMembers });
    } catch (error) {
      res.status(500).json({ msg: "Server Error", error });
    }
  };

  