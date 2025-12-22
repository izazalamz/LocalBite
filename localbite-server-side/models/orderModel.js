const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    // Short id for users/admin
    orderCode: { type: String, required: true, unique: true, index: true },

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

    // Save key meal info for history
    mealSnapshot: {
      name: { type: String, required: true },
      unitLabel: { type: String, default: "Per Portion" },
      price: { type: Number, required: true },
      currency: { type: String, default: "BDT" },
      coverPhotoUrl: { type: String, default: "" },
    },

    quantity: { type: Number, default: 1, min: 1 },

    // Delivery or pickup
    fulfillmentType: {
      type: String,
      enum: ["pickup", "delivery"],
      required: true,
      index: true,
    },

    pickupDetails: {
      pickupTime: { type: Date },
      pickupNote: { type: String, default: "", maxlength: 300 },
    },

    deliveryDetails: {
      addressLabel: { type: String, default: "", maxlength: 160 },
      addressText: { type: String, default: "", maxlength: 500 },
      deliveryNote: { type: String, default: "", maxlength: 300 },
    },

    // Order workflow
    status: {
      type: String,
      enum: [
        "requested",
        "cook_confirmed",
        "foodie_confirmed",
        "confirmed",
        "cook_cancelled",
        "foodie_cancelled",
        "expired",
        "completed",
      ],
      default: "requested",
      index: true,
    },

    cookDecision: {
      state: {
        type: String,
        enum: ["pending", "confirmed", "cancelled"],
        default: "pending",
      },
      decidedAt: { type: Date },
      note: { type: String, default: "", maxlength: 300 },
    },

    foodieDecision: {
      state: {
        type: String,
        enum: ["pending", "confirmed", "cancelled"],
        default: "pending",
      },
      decidedAt: { type: Date },
      note: { type: String, default: "", maxlength: 300 },
    },

    requestedAt: { type: Date, default: Date.now, index: true },
    confirmedAt: { type: Date },
    completedAt: { type: Date },
    cancelledAt: { type: Date },

    cancelInfo: {
      cancelledBy: { type: String, enum: ["cook", "foodie", "system"] },
      reason: { type: String, default: "", maxlength: 400 },
    },

    // Used to block duplicate reviews
    hasReview: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

OrderSchema.index({ cookId: 1, requestedAt: -1 });
OrderSchema.index({ foodieId: 1, requestedAt: -1 });
OrderSchema.index({ status: 1, requestedAt: -1 });

module.exports = mongoose.model("Order", OrderSchema);
