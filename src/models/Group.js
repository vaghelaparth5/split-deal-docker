const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
  dealId: {type: mongoose.Schema.Types.ObjectId, ref: 'Deal', required: true}, // Reference to the deal
  dealLogo: { type: String, required: true }, // Link to the deal logo/image
  dealTitle: { type: String, required: true },
  dealDescription: { type: String },
  storeName: {type: String},
  storeLocation: { type: String, required: true },
  totalValue: { type: Number, required: true },
  discount: { type: Number, required: true },
  expiryDate: { type: Date, required: true }, // Expiry date of the deal
  membersRequired: { type: Number, required: true }, // Number of members required to join
  creationDate: { type: Date, default: Date.now }, // Date and time when the group was created
  status: { type: String, enum: ["active", "inactive", "completed"], default: "active" }, // Status of the group
  receiptImage: { type: String }, // Link to the receipt image
}, { timestamps: true });

module.exports = mongoose.model("Group", GroupSchema);