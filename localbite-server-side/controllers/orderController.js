const Order = require("../models/orderModel");
const Meal = require("../models/mealModel");

const makeOrderCode = () => {
  const part = Math.random().toString(16).slice(2, 7).toUpperCase();
  return `LB-${part}`;
};

exports.getAllOrders = async (req, res) => {
  const orders = await Order.find().sort({ requestedAt: -1 }).limit(200);
  res.json(orders);
};

exports.getOrdersByFoodie = async (req, res) => {
  const { foodieId } = req.params;
  const orders = await Order.find({ foodieId })
    .sort({ requestedAt: -1 })
    .populate("cookId", "fullName isVerified")
    .populate("mealId", "name coverPhotoUrl");
  res.json(orders);
};

exports.getOrdersByCook = async (req, res) => {
  const { cookId } = req.params;
  const orders = await Order.find({ cookId })
    .sort({ requestedAt: -1 })
    .populate("foodieId", "fullName")
    .populate("mealId", "name coverPhotoUrl");
  res.json(orders);
};

exports.createOrder = async (req, res) => {
  const {
    mealId,
    foodieId,
    quantity = 1,
    fulfillmentType,
    pickupDetails,
    deliveryDetails,
  } = req.body;

  if (!mealId || !foodieId || !fulfillmentType) {
    return res
      .status(400)
      .json({ message: "mealId, foodieId, fulfillmentType are required" });
  }

  const meal = await Meal.findOne({ _id: mealId, isDeleted: false });
  if (!meal) return res.status(404).json({ message: "Meal not found" });

  if (meal.availabilityStatus !== "available") {
    return res.status(400).json({ message: "Meal is not available" });
  }

  if (
    meal.availablePortions !== undefined &&
    meal.availablePortions < quantity
  ) {
    return res.status(400).json({ message: "Not enough portions available" });
  }

  const order = await Order.create({
    orderCode: makeOrderCode(),
    mealId: meal._id,
    cookId: meal.cookId,
    foodieId,
    quantity,
    fulfillmentType,
    pickupDetails: fulfillmentType === "pickup" ? pickupDetails : undefined,
    deliveryDetails:
      fulfillmentType === "delivery" ? deliveryDetails : undefined,
    mealSnapshot: {
      name: meal.name,
      unitLabel: meal.unitLabel,
      price: meal.isFree ? 0 : meal.price,
      currency: meal.currency,
      coverPhotoUrl: meal.coverPhotoUrl || meal.photos?.[0]?.url || "",
    },
  });

  res.status(201).json(order);
};

exports.getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("mealId", "name coverPhotoUrl")
    .populate("cookId", "fullName isVerified")
    .populate("foodieId", "fullName");

  if (!order) return res.status(404).json({ message: "Order not found" });
  res.json(order);
};

exports.cookConfirm = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });

  if (order.status !== "requested")
    return res.status(400).json({ message: "Order not in requested state" });

  order.cookDecision.state = "confirmed";
  order.cookDecision.decidedAt = new Date();
  order.status = "cook_confirmed";

  await order.save();
  res.json(order);
};

exports.foodieConfirm = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });

  if (!["requested", "cook_confirmed"].includes(order.status)) {
    return res.status(400).json({ message: "Order cannot be confirmed now" });
  }

  order.foodieDecision.state = "confirmed";
  order.foodieDecision.decidedAt = new Date();

  if (order.cookDecision.state === "confirmed") {
    order.status = "confirmed";
    order.confirmedAt = new Date();
  } else {
    order.status = "foodie_confirmed";
  }

  await order.save();
  res.json(order);
};

exports.cookCancel = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });

  if (
    ["completed", "cook_cancelled", "foodie_cancelled"].includes(order.status)
  ) {
    return res.status(400).json({ message: "Order cannot be cancelled" });
  }

  order.cookDecision.state = "cancelled";
  order.cookDecision.decidedAt = new Date();
  order.status = "cook_cancelled";
  order.cancelledAt = new Date();
  order.cancelInfo = { cancelledBy: "cook", reason: req.body.reason || "" };

  await order.save();
  res.json(order);
};

exports.foodieCancel = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });

  if (
    ["completed", "cook_cancelled", "foodie_cancelled"].includes(order.status)
  ) {
    return res.status(400).json({ message: "Order cannot be cancelled" });
  }

  order.foodieDecision.state = "cancelled";
  order.foodieDecision.decidedAt = new Date();
  order.status = "foodie_cancelled";
  order.cancelledAt = new Date();
  order.cancelInfo = { cancelledBy: "foodie", reason: req.body.reason || "" };

  await order.save();
  res.json(order);
};

exports.completeOrder = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });

  if (order.status !== "confirmed")
    return res
      .status(400)
      .json({ message: "Only confirmed orders can be completed" });

  order.status = "completed";
  order.completedAt = new Date();

  await order.save();
  res.json(order);
};
