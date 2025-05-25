const express = require("express");
const userController = require("../controllers/userController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Update Profile

// Update Location
router.put("/update-location", authMiddleware, userController.updateLocation);

// Update Rating
router.put("/update-rating/:userId",authMiddleware, userController.updateRating);

// Update Successful Orders
router.put("/successful-order", authMiddleware,userController.updateSuccessfulOrders);

// Update Failed Orders
router.put("/failed-order", authMiddleware, userController.updateFailedOrders);

router.get("/user/:userId", authMiddleware, userController.getUserDetails);


module.exports = router;