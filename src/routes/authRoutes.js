const express = require("express");
const { registerUser, loginUser, forgotPassword, resetPassword } = require("../controllers/authController");

const router = express.Router();

// Register User
router.post("/register", registerUser);

// Login User
router.post("/login", loginUser);

router.post("/forgot-password", forgotPassword);

router.put("/reset-password/:token", resetPassword);

module.exports = router;