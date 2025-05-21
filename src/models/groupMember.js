const mongoose = require('mongoose');

const GroupMemberSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true }, 
  dealId: { type: mongoose.Schema.Types.ObjectId, ref: 'Deal', required: true }, 
  contribution: { type: Number, required: true }, 
  productPhoto: { type: String }, 
  isVerified: { type: Boolean, default: false }, 
  ratings: { type: Number, min: 0, max: 5 }, 
  ratingsProvided: { 
    type: String, 
    enum: ["not submitted", "skipped", "submitted"], 
    default: "not submitted" 
  },
  role: { type: String, enum: ["admin", "team-member"], required: true }, // Either admin or team-member
}, { timestamps: true });

module.exports = mongoose.model("GroupMember", GroupMemberSchema);