const User = require("../models/User");

exports.getUserDetails = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select("-user_password"); // Exclude password for security
    if (!user) return res.status(404).json({ msg: "User not found" });

    res.json({ msg: "User details fetched successfully", user });
  } catch (error) {
    res.status(500).json({ msg: "Server Error", error });
  }
};

// 📌 UPDATE LOCATION
exports.updateLocation = async (req, res) => {
  try {
    const { location } = req.body;
    const userId = req.user.user_id;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { location },
      { new: true }
    );

    res.json({ msg: "Location updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ msg: "Server Error", error });
  }
};

// 📌 UPDATE RATING
exports.updateRating = async (req, res) => {
  try {
    const { rating } = req.body;
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.rating_score += rating;
    user.number_of_people_rated += 1;

    await user.save();
    res.json({ msg: "Rating updated successfully", user });
  } catch (error) {
    res.status(500).json({ msg: "Server Error", error });
  }
};

// 📌 UPDATE SUCCESSFUL ORDERS & MONEY SAVED
exports.updateSuccessfulOrders = async (req, res) => {
  try {
    const { discount } = req.body;
    const userId = req.user.user_id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.successful_orders += 1;
    user.total_money_saved += discount;

    await user.save();
    res.json({ msg: "Successful order updated", user });
  } catch (error) {
    res.status(500).json({ msg: "Server Error", error });
  }
};

// 📌 UPDATE FAILED ORDERS
exports.updateFailedOrders = async (req, res) => {
  try {
    const userId = req.user.user_id;

    const user = await User.findByIdAndUpdate(
      userId,
      { $inc: { failure_order: 1 } },
      { new: true }
    );

    res.json({ msg: "Failed order updated", user });
  } catch (error) {
    res.status(500).json({ msg: "Server Error", error });
  }
};
