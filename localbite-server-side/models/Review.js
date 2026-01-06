const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    // Link to order - ensures only users who completed orders can review
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true,
        index: true,
    },
    
    // Meal being reviewed
    mealId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Meal",
        required: true,
        index: true,
    },
    
    // Cook who made the meal (for aggregating cook ratings)
    cookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    
    // User who wrote the review (must be authenticated platform user)
    foodieId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    
    // Review content
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    comment: {
        type: String,
        default: "",
        maxlength: 1000,
    },
    
    // Admin moderation
    isHidden: {
        type: Boolean,
        default: false,
        index: true,
    },
    
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});

// Prevent duplicate reviews for same order
reviewSchema.index({ orderId: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);