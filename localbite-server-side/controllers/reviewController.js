const Review = require("../models/reviewModel");
const Order = require("../models/orderModel");
const User = require("../models/userModel");
const Meal = require("../models/mealModel");
const AuditLog = require("../models/auditlogModel");

const logAction = async (actorId, action, targetType, targetId, note = "") => {
  await AuditLog.create({
    actorId: actorId || null,
    action,
    targetType,
    targetId,
    note,
  });
};

const recalcCookRating = async (cookId) => {
  const rows = await Review.aggregate([
    { $match: { cookId, isHidden: false } },
    { $group: { _id: "$cookId", avg: { $avg: "$rating" }, cnt: { $sum: 1 } } },
  ]);

  const avg = rows[0]?.avg || 0;
  const cnt = rows[0]?.cnt || 0;

  await User.findByIdAndUpdate(cookId, {
    avgCookRating: avg,
    cookRatingCount: cnt,
  });
};

const recalcMealRating = async (mealId) => {
  const rows = await Review.aggregate([
    { $match: { mealId, isHidden: false } },
    { $group: { _id: "$mealId", avg: { $avg: "$rating" }, cnt: { $sum: 1 } } },
  ]);

  const avg = rows[0]?.avg || 0;
  const cnt = rows[0]?.cnt || 0;

  await Meal.findByIdAndUpdate(mealId, {
    avgMealRating: avg,
    mealRatingCount: cnt,
  });
};

exports.getAllReviews = async (req, res) => {
  const reviews = await Review.find().sort({ createdAt: -1 }).limit(200);
  res.json(reviews);
};

exports.getReviewsByMeal = async (req, res) => {
  const reviews = await Review.find({
    mealId: req.params.mealId,
    isHidden: false,
  })
    .sort({ createdAt: -1 })
    .populate("foodieId", "fullName profilePhotoUrl");

  res.json(reviews);
};

exports.getReviewsByCook = async (req, res) => {
  const reviews = await Review.find({
    cookId: req.params.cookId,
    isHidden: false,
  })
    .sort({ createdAt: -1 })
    .populate("foodieId", "fullName profilePhotoUrl")
    .populate("mealId", "name coverPhotoUrl");

  res.json(reviews);
};

exports.createReview = async (req, res) => {
  const { orderId, rating, comment } = req.body;

  if (!orderId || !rating) {
    return res.status(400).json({ message: "orderId and rating are required" });
  }

  const order = await Order.findById(orderId);
  if (!order) return res.status(404).json({ message: "Order not found" });

  if (order.status !== "completed") {
    return res
      .status(400)
      .json({ message: "Order must be completed to review" });
  }

  if (order.hasReview) {
    return res.status(400).json({ message: "Review already submitted" });
  }

  const review = await Review.create({
    orderId: order._id,
    mealId: order.mealId,
    cookId: order.cookId,
    foodieId: order.foodieId,
    rating,
    comment: comment || "",
  });

  order.hasReview = true;
  await order.save();

  await recalcCookRating(order.cookId);
  await recalcMealRating(order.mealId);

  res.status(201).json(review);
};

// dev: send actorId in body if you want
exports.hideReview = async (req, res) => {
  const actorId = req.body.actorId;
  const reason = req.body.reason || "";

  const review = await Review.findById(req.params.id);
  if (!review) return res.status(404).json({ message: "Review not found" });

  review.isHidden = true;
  review.hiddenReason = reason;
  review.hiddenBy = actorId || null;
  await review.save();

  await recalcCookRating(review.cookId);
  await recalcMealRating(review.mealId);

  await logAction(actorId, "hide_review", "review", review._id, reason);
  res.json(review);
};

exports.unhideReview = async (req, res) => {
  const actorId = req.body.actorId;

  const review = await Review.findById(req.params.id);
  if (!review) return res.status(404).json({ message: "Review not found" });

  review.isHidden = false;
  review.hiddenReason = "";
  review.hiddenBy = null;
  await review.save();

  await recalcCookRating(review.cookId);
  await recalcMealRating(review.mealId);

  await logAction(actorId, "restore_review", "review", review._id);
  res.json(review);
};
