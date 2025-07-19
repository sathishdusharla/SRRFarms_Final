const mongoose = require('mongoose');

const passwordResetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userEmail: {
    type: String,
    required: true
  },
  userPhone: {
    type: String,
    required: true
  },
  userFullName: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'rejected'],
    default: 'pending'
  },
  adminNotes: {
    type: String,
    default: ''
  },
  newPassword: {
    type: String,
    default: null
  },
  completedAt: {
    type: Date,
    default: null
  },
  completedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  requestReason: {
    type: String,
    default: 'Forgot password'
  }
}, {
  timestamps: true
});

// Index for faster queries
passwordResetSchema.index({ userId: 1 });
passwordResetSchema.index({ status: 1 });
passwordResetSchema.index({ createdAt: -1 });

module.exports = mongoose.model('PasswordReset', passwordResetSchema);
