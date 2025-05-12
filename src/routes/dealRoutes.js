const express = require("express");
const router = express.Router();
const {
  createDeal,

} = require("../controllers/dealController");

const authMiddleware = require("../middleware/authMiddleware");

// Create a new deal
router.post("/create", authMiddleware, createDeal);

module.exports = router;
