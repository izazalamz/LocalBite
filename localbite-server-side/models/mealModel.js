const mongoose = require("mongoose");

const MealSchema = new mongoose.Schema(
  {
    cookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
      index: true,
    },
    shortDescription: { type: String, default: "", maxlength: 180 },
    description: { type: String, default: "", maxlength: 1500 },

    // Images (coverPhotoUrl helps UI)
    photos: [
      {
        url: { type: String, required: true },
        caption: { type: String, default: "", maxlength: 120 },
      },
    ],
    coverPhotoUrl: { type: String, default: "" },

    // Food details
    ingredients: [{ type: String, trim: true, maxlength: 60 }],
    allergens: [{ type: String, trim: true, maxlength: 50, index: true }],

    // Price setup
    isFree: { type: Boolean, default: false, index: true },
    price: { type: Number, default: 0, min: 0 },
    currency: { type: String, default: "BDT", maxlength: 6 },
    unitLabel: { type: String, default: "Per Portion", maxlength: 40 },

    // Search filters
    dietType: {
      type: String,
      enum: ["veg", "non_veg", "vegan", "halal", "other"],
      default: "other",
      index: true,
    },
    cuisine: { type: String, default: "", maxlength: 50, index: true },
    tags: [{ type: String, trim: true, maxlength: 30, index: true }],

    // Availability
    availabilityStatus: {
      type: String,
      enum: ["available", "sold_out", "paused"],
      default: "available",
      index: true,
    },
    availablePortions: { type: Number, default: 1, min: 0 },

    // Prep / delivery label shown in UI
    readyInMinutes: { type: Number, default: 0, min: 0 },
    deliveryTimeLabel: { type: String, default: "", maxlength: 80 },

    // Display location for the meal
    locationLabel: { type: String, default: "", maxlength: 160 },

    // Pickup/delivery support
    fulfillmentOptions: {
      pickup: { type: Boolean, default: true },
      delivery: { type: Boolean, default: false },
    },

    // Rating summary for meals
    avgMealRating: { type: Number, default: 0, min: 0, max: 5 },
    mealRatingCount: { type: Number, default: 0, min: 0 },

    // Soft delete
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date },
    deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    deleteReason: { type: String, default: "", maxlength: 400 },
  },
  { timestamps: true }
);

MealSchema.index({
  name: "text",
  shortDescription: "text",
  description: "text",
  cuisine: "text",
  tags: "text",
});

MealSchema.index({ cookId: 1, availabilityStatus: 1, isDeleted: 1 });
MealSchema.index({ dietType: 1, availabilityStatus: 1, isDeleted: 1 });
MealSchema.index({ isFree: 1, availabilityStatus: 1, isDeleted: 1 });

module.exports = mongoose.model("Meal", MealSchema);
