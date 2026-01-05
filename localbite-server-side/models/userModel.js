const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    uid: {
      type: String,
    },

    role: {
      type: String,
      enum: ["foodie", "cook"],
      required: true,
    },

    avatar: {
      type: String,
      default: "",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    // Rating fields (calculated from reviews)
    avgCookRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    cookRatingCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Profile fields
    locationLabel: {
      type: String,
      default: "",
      maxlength: 160,
    },
    profilePhotoUrl: {
      type: String,
      default: "",
    },

    // Soft delete
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
