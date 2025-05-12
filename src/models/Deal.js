const mongoose = require('mongoose');

const DealSchema = new mongoose.Schema({
  dealName: { type: String, required: true },
  dealDesc: { type: String },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }, // Reference to the parent category
  subCategoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'SubCategory' }, // Reference to the sub-category (optional)
  storeName: { type: String, required: true },
  storeLocation: { type: String },
  totalValue: { type: Number, required: true },
  discount: { type: Number, required: true },
  storeLogo: { type: String }, // Link to the store logo/image
  expiryDate: { type: Date, required: true }, // Expiry date of the deal
}, { timestamps: true });

module.exports = mongoose.model("Deal", DealSchema);