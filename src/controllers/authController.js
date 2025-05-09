const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
require("dotenv").config();

// Setup email transporter for password resets
typeof process.env.SMTP_HOST === 'undefined' && console.warn('SMTP configuration missing in .env');
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: +process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// REGISTER USER (WITH NAME & PHONE NUMBER)
exports.registerUser = async (req, res) => {
  try {
    const { user_email, user_password, name, phone_number } = req.body;

    // Check if user already exists
    let user = await User.findOne({ user_email });
    if (user) return res.status(400).json({ msg: "User already exists" });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user_password, salt);

    // Create new user document
    user = new User({
      user_email,
      user_password: hashedPassword,
      name,
      phone_number,
    });

    await user.save();

    res.status(201).json({ msg: "User registered successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server Error", error });
  }
};

// LOGIN USER
exports.loginUser = async (req, res) => {
  try {
    const { user_email, user_password } = req.body;

    // Find user by email
    const user = await User.findOne({ user_email });
    if (!user) return res.status(400).json({ msg: "Invalid Credentials" });

    // Compare passwords
    const isMatch = await bcrypt.compare(user_password, user.user_password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid Credentials" });

    // Generate JWT
    const token = jwt.sign({ user_id: user._id }, process.env.JWT_SECRET, { expiresIn: "12h" });

    res.json({ msg: "Authentication successful", token, user_id: user._id, user_name: user.name });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server Error", error });
  }
};

// FORGOT PASSWORD: send reset link
exports.forgotPassword = async (req, res) => {
  try {
    const { user_email } = req.body;
    const user = await User.findOne({ user_email });
    if (!user) return res.status(404).json({ msg: "No account with that email." });

    // Generate and hash token
    const token = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Construct reset URL
    const resetURL = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    // Email options
    const mailOptions = {
      to: user_email,
      from: process.env.SMTP_FROM || 'no-reply@yourapp.com',
      subject: 'Password Reset Request',
      text: `You requested a password reset.\n\n` +
            `Please click the link below (or copy/paste into your browser) to reset your password:\n\n` +
            `${resetURL}\n\n` +
            `If you did not request this, please ignore this email.`,
    };

    await transporter.sendMail(mailOptions);
    res.json({ msg: "Password reset link sent to email." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server Error", error });
  }
};

// RESET PASSWORD: update with new password
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    // Hash incoming token
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find user by token and check expiry
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });
    if (!user) return res.status(400).json({ msg: "Invalid or expired token." });

    // Hash and set the new password
    const salt = await bcrypt.genSalt(10);
    user.user_password = await bcrypt.hash(newPassword, salt);

    // Clear reset fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ msg: "Password has been reset successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server Error", error });
  }
};
