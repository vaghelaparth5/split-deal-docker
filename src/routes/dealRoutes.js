const express = require("express");
const router = express.Router();
const {
  createDeal,
  expireDeals
} = require("../controllers/dealController");

const authMiddleware = require("../middleware/authMiddleware");

// Create a new deal
router.post("/create", authMiddleware, createDeal);

// Manually expire outdated deals
router.patch("/expire", authMiddleware, expireDeals);

module.exports = router;
