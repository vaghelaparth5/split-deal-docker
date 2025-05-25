const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  user_email: { type: String, required: true, unique: true },
  user_password: { type: String, required: true },
  name: { type: String, default: "" },
  phone_number: { type: String, default: "" },
  location: { type: String, default: "" },
  rating_score: { type: Number, default: 0 },
  number_of_people_rated: { type: Number, default: 0 },
  successful_orders: { type: Number, default: 0 },
  failure_order: { type: Number, default: 0 },
  total_money_saved: { type: Number, default: 0 },
  resetPasswordToken: { type: String , default: "" },
  resetPasswordExpires: { type: Date, default: null }
});

module.exports = mongoose.model("User", UserSchema);
