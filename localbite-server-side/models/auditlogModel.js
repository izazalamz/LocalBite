const mongoose = require("mongoose");

const AuditLogSchema = new mongoose.Schema(
  {
    actorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    action: {
      type: String,
      enum: [
        "verify_user",
        "unverify_user",
        "take_down_meal",
        "restore_meal",
        "hide_review",
        "restore_review",
        "suspend_user",
        "unsuspend_user",
        "resolve_report",
      ],
      required: true,
      index: true,
    },

    targetType: {
      type: String,
      enum: ["user", "meal", "review", "report"],
      required: true,
      index: true,
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },

    note: { type: String, default: "", maxlength: 1200 },
  },
  { timestamps: true }
);

AuditLogSchema.index({ action: 1, createdAt: -1 });

module.exports = mongoose.model("AuditLog", AuditLogSchema);
