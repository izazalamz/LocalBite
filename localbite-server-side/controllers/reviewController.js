const Review = require("../models/Review");
const Order = require("../models/orderModel");
const Meal = require("../models/mealModel");
const User = require("../models/userModel");

// Helper function to recalculate cook rating from meal reviews
const recalcCookRating = async (cookId) => {
  const reviews = await Review.find({ cookId, isHidden: false });
  if (reviews.length === 0) {
    await User.findByIdAndUpdate(cookId, {
      avgCookRating: 0,
      cookRatingCount: 0,
    });
    return;
  }

  const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  await User.findByIdAndUpdate(cookId, {
    avgCookRating: avg,
    cookRatingCount: reviews.length,
  });
};

// Helper function to recalculate meal rating
const recalcMealRating = async (mealId) => {
  const reviews = await Review.find({ mealId, isHidden: false });
  if (reviews.length === 0) {
    await Meal.findByIdAndUpdate(mealId, {
      avgMealRating: 0,
      mealRatingCount: 0,
    });
    return;
  }

  const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  await Meal.findByIdAndUpdate(mealId, {
    avgMealRating: avg,
    mealRatingCount: reviews.length,
  });
};

// Get reviews for a specific meal
exports.getReviewsByMeal = async (req, res) => {
  try {
    const { mealId } = req.params;
    const reviews = await Review.find({
      mealId,
      isHidden: false,
    })
      .sort({ createdAt: -1 })
      .populate("foodieId", "fullName profilePhotoUrl")
      .populate("mealId", "name coverPhotoUrl");

    res.status(200).json(reviews);
  } catch (error) {
    console.error("Get Error:", error);
    res.status(500).json({ message: "Error fetching reviews" });
  }
};

// Get reviews for a specific cook (aggregated from all their meal reviews)
exports.getReviewsByCook = async (req, res) => {
  try {
    const { cookId } = req.params;
    const reviews = await Review.find({
      cookId,
      isHidden: false,
    })
      .sort({ createdAt: -1 })
      .populate("foodieId", "fullName profilePhotoUrl")
      .populate("mealId", "name coverPhotoUrl");

    res.status(200).json(reviews);
  } catch (error) {
    console.error("Get Error:", error);
    res.status(500).json({ message: "Error fetching reviews" });
  }
};

// Create review - only authenticated users who completed orders can review
exports.createReview = async (req, res) => {
  try {
    const { orderId, rating, comment, uid } = req.body;

    // Validate required fields
    if (!orderId || !rating || !uid) {
      return res.status(400).json({
        message: "orderId, rating, and uid (user authentication) are required",
      });
    }

    // Verify user exists in database (must be authenticated platform user)
    const user = await User.findOne({ uid });
    if (!user) {
      return res.status(401).json({
        message: "User not found. Please sign up first.",
      });
    }

    // Get the order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Verify the order belongs to this user
    const userDb = await User.findOne({ uid });
    if (order.foodieId.toString() !== userDb._id.toString()) {
      return res.status(403).json({
        message: "You can only review your own orders",
      });
    }

    // Verify order is completed
    if (order.status !== "completed") {
      return res.status(400).json({
        message: "Order must be completed before reviewing",
      });
    }

    // Check if review already exists for this order
    const existingReview = await Review.findOne({ orderId });
    if (existingReview) {
      return res.status(400).json({
        message: "Review already submitted for this order",
      });
    }

    // Create review
    const newReview = await Review.create({
      orderId: order._id,
      mealId: order.mealId,
      cookId: order.cookId,
      foodieId: userDb._id,
      rating: Number(rating),
      comment: comment || "",
    });

    // Mark order as reviewed
    order.hasReview = true;
    await order.save();

    // Recalculate ratings
    await recalcCookRating(order.cookId);
    await recalcMealRating(order.mealId);

    // Populate and return
    const populatedReview = await Review.findById(newReview._id)
      .populate("foodieId", "fullName profilePhotoUrl")
      .populate("mealId", "name coverPhotoUrl")
      .populate("cookId", "fullName");

    res.status(201).json(populatedReview);
  } catch (error) {
    console.error("Save Error:", error);
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Review already exists for this order",
      });
    }
    res.status(500).json({ message: "Error saving review", error: error.message });
  }
};

// Update review - only the reviewer can update
exports.updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment, uid } = req.body;

    // Verify user
    const user = await User.findOne({ uid });
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Verify user owns this review
    if (review.foodieId.toString() !== user._id.toString()) {
      return res.status(403).json({
        message: "You can only update your own reviews",
      });
    }

    const updatedReview = await Review.findByIdAndUpdate(
      id,
      { rating: Number(rating), comment: comment || "" },
      { new: true }
    )
      .populate("foodieId", "fullName profilePhotoUrl")
      .populate("mealId", "name coverPhotoUrl");

    // Recalculate ratings
    await recalcCookRating(review.cookId);
    await recalcMealRating(review.mealId);

    res.status(200).json(updatedReview);
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ message: "Error updating review", error: error.message });
  }
};

// Delete review - only the reviewer can delete
exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { uid } = req.body;

    // Verify user
    const user = await User.findOne({ uid });
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Verify user owns this review
    if (review.foodieId.toString() !== user._id.toString()) {
      return res.status(403).json({
        message: "You can only delete your own reviews",
      });
    }

    const cookId = review.cookId;
    const mealId = review.mealId;

    await Review.findByIdAndDelete(id);

    // Recalculate ratings
    await recalcCookRating(cookId);
    await recalcMealRating(mealId);

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ message: "Error deleting review", error: error.message });
  }
};