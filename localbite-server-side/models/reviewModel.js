const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
  {
    // One review per order
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      unique: true,
      index: true,
    },

    mealId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Meal",
      required: true,
      index: true,
    },
    cookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    foodieId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    rating: { type: Number, required: true, min: 1, max: 5, index: true },
    comment: { type: String, default: "", maxlength: 1200 },

    // Admin can hide reviews if needed
    isHidden: { type: Boolean, default: false, index: true },
    hiddenReason: { type: String, default: "", maxlength: 400 },
    hiddenBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

ReviewSchema.index({ cookId: 1, createdAt: -1 });
ReviewSchema.index({ mealId: 1, createdAt: -1 });

module.exports = mongoose.model("Review", ReviewSchema);
