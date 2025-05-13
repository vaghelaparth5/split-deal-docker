const express = require("express");
const router = express.Router();
const {
  createDeal,
  getDeals
} = require("../controllers/dealController");

const authMiddleware = require("../middleware/authMiddleware");

// Create a new deal
router.post("/create", authMiddleware, createDeal);

// Get all deals
router.get("/get", getDeals);

module.exports = router;
