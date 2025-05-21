const express = require("express");
const router = express.Router();
const {
  createAdminGroupMember,
} = require("../controllers/groupMemberController");

const authMiddleware = require("../middleware/authMiddleware");

// Route to create an admin group member
router.post("/create-admin-group-member", authMiddleware, createAdminGroupMember);

// Route to create a team member
router.post("/create-team-member", authMiddleware, createTeamMember);

module.exports = router;