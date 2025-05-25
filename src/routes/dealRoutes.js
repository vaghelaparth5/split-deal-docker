const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
  createDeal,
  getDeals,
  expireDeals,
  getDealById,
  updateDeal,
  softDeleteDeal
} = require("../controllers/dealController");

router.post("/create", authMiddleware, createDeal);
router.get("/get", getDeals);

// Manually expire outdated deals
router.patch("/expire", authMiddleware, expireDeals);
router.get("/:id", authMiddleware, getDealById);
router.put("/:id", authMiddleware, updateDeal);
router.delete("/:id", authMiddleware, softDeleteDeal);

module.exports = router;

// src/routes/dealRoutes.js



const Deal = require('../models/Deal');

//  Add this at the bottom or top
router.get('/debug/all', async (req, res) => {
  try {
    const deals = await Deal.find().sort({ createdAt: -1 }).limit(10);
    res.json(deals);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching deals', error: err.message });
  }
});

module.exports = router;
