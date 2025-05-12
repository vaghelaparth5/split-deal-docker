const express = require("express");
const router = express.Router();
const {
  createDeal,
  getAllDeals,
  getDealById,
  updateDeal,
  deleteDeal,
  joinDeal,
  leaveDeal,
} = require("../controllers/dealController");

const authMiddleware = require("../middlewares/authMiddleware");

// Create a new deal
router.post("/create", authMiddleware, createDeal);

// Get all deals
router.get("/all", authMiddleware, getAllDeals);

// Get a specific deal by ID
router.get("/:id", authMiddleware, getDealById);

// Update a deal
router.put("/update/:id", authMiddleware, updateDeal);

// Delete a deal
router.delete("/delete/:id", authMiddleware, deleteDeal);

// Join a deal
router.post("/join/:id", authMiddleware, joinDeal);

// Leave a deal
router.post("/leave/:id", authMiddleware, leaveDeal);

module.exports = router;
