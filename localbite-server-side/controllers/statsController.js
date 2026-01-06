const mongoose = require("mongoose");
const Meal = require("../models/mealModel");
const Order = require("../models/orderModel");
const User = require("../models/userModel");

exports.getDashboard = async (req, res) => {
  const totalMeals = await Meal.countDocuments({ isDeleted: false });
  const totalOrders = await Order.countDocuments({});
  const totalCompleted = await Order.countDocuments({ status: "completed" });

  const topCooks = await User.find({ role: "cook", isDeleted: false })
    .sort({ avgCookRating: -1, cookRatingCount: -1 })
    .limit(10)
    .select(
      "fullName avgCookRating cookRatingCount isVerified locationLabel profilePhotoUrl"
    );

  const popularMeals = await Order.aggregate([
    { $group: { _id: "$mealId", orders: { $sum: 1 } } },
    { $sort: { orders: -1 } },
    { $limit: 10 },
    {
      $lookup: {
        from: "meals",
        localField: "_id",
        foreignField: "_id",
        as: "meal",
      },
    },
    { $unwind: "$meal" },
    { $match: { "meal.isDeleted": false } },
    {
      $project: {
        mealId: "$meal._id",
        name: "$meal.name",
        coverPhotoUrl: "$meal.coverPhotoUrl",
        orders: 1,
      },
    },
  ]);

  const now = new Date();
  const start = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 11, 1)
  );

  const monthlyOrders = await Order.aggregate([
    { $match: { requestedAt: { $gte: start } } },
    {
      $group: {
        _id: { y: { $year: "$requestedAt" }, m: { $month: "$requestedAt" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.y": 1, "_id.m": 1 } },
  ]);

  const estimatedWasteSavedKg = totalMeals * 0.5;

  res.json({
    totalMeals,
    totalOrders,
    totalCompleted,
    estimatedWasteSavedKg,
    topCooks,
    popularMeals,
    monthlyOrders,
  });
};

exports.getCookDashboard = async (req, res) => {
  try {
    const { cookId } = req.params;

    // Convert cookId to ObjectId for consistent querying
    const cookObjectId = mongoose.Types.ObjectId.isValid(cookId)
      ? new mongoose.Types.ObjectId(cookId)
      : null;

    if (!cookObjectId) {
      return res.status(400).json({
        success: false,
        message: "Invalid cook ID",
      });
    }

    // Active or completed
    const activeOrdersCount = await Order.countDocuments({
      cookId: cookObjectId,
      status: { $in: ["cook_confirmed", "foodie_confirmed", "confirmed"] },
    });

    const pendingRequestsCount = await Order.countDocuments({
      cookId: cookObjectId,
      status: "requested",
    });

    const completedOrdersCount = await Order.countDocuments({
      cookId: cookObjectId,
      status: "completed",
    });

    const totalEarnings =
      (await Order.aggregate([
        { $match: { cookId: cookObjectId, status: "completed" } },
        { $group: { _id: null, total: { $sum: { $multiply: ["$quantity", "$mealSnapshot.price"] } } } },
      ]))[0]?.total || 0;

    const user = await User.findById(cookObjectId).select(
      "avgCookRating cookRatingCount"
    );
    const avgRating = user ? user.avgCookRating : 0;

    res.json({
      success: true,
      activeOrdersCount,
      pendingRequestsCount,
      completedOrdersCount,
      totalEarnings,
      avgRating,
    });
  } catch (error) {
    console.error("Error fetching cook dashboard:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch cook dashboard",
    });
  }
};
