const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema(
  {
    reporterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // What was reported
    targetType: {
      type: String,
      enum: ["meal", "review", "user"],
      required: true,
      index: true,
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },

    category: {
      type: String,
      enum: [
        "inappropriate",
        "unsafe_food",
        "scam",
        "harassment",
        "spam",
        "other",
      ],
      required: true,
      index: true,
    },

    description: { type: String, default: "", maxlength: 1200 },

    // Admin handling
    status: {
      type: String,
      enum: ["open", "under_review", "resolved", "rejected"],
      default: "open",
      index: true,
    },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    actionTaken: {
      type: String,
      enum: [
        "none",
        "hide_review",
        "take_down_meal",
        "suspend_user",
        "warn_user",
      ],
      default: "none",
      index: true,
    },
    resolutionNote: { type: String, default: "", maxlength: 800 },
    resolvedAt: { type: Date },
  },
  { timestamps: true }
);

ReportSchema.index({ targetType: 1, targetId: 1, status: 1 });
ReportSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model("Report", ReportSchema);
