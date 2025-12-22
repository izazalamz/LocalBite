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

exports.getAllMeals = async (req, res) => {
  const { search, dietType, isFree, availability, cookId, tag } = req.query;

  const filter = { isDeleted: false };

  if (dietType) filter.dietType = dietType;
  if (availability) filter.availabilityStatus = availability;
  if (cookId) filter.cookId = cookId;
  if (tag) filter.tags = tag;
  if (isFree !== undefined) filter.isFree = isFree === "true";
  if (search) filter.$text = { $search: search };

  const meals = await Meal.find(filter)
    .sort({ createdAt: -1 })
    .limit(100)
    .populate(
      "cookId",
      "fullName isVerified avgCookRating cookRatingCount locationLabel profilePhotoUrl"
    );

  res.json(meals);
};

exports.getMealById = async (req, res) => {
  const meal = await Meal.findOne({
    _id: req.params.id,
    isDeleted: false,
  }).populate(
    "cookId",
    "fullName isVerified avgCookRating cookRatingCount locationLabel profilePhotoUrl"
  );

  if (!meal) return res.status(404).json({ message: "Meal not found" });
  res.json(meal);
};

exports.createMeal = async (req, res) => {
  const payload = req.body;

  if (
    !payload.coverPhotoUrl &&
    Array.isArray(payload.photos) &&
    payload.photos[0]?.url
  ) {
    payload.coverPhotoUrl = payload.photos[0].url;
  }

  const meal = await Meal.create(payload);
  res.status(201).json(meal);
};

exports.updateMeal = async (req, res) => {
  const meal = await Meal.findById(req.params.id);
  if (!meal || meal.isDeleted)
    return res.status(404).json({ message: "Meal not found" });

  Object.assign(meal, req.body);

  if (
    !meal.coverPhotoUrl &&
    Array.isArray(meal.photos) &&
    meal.photos[0]?.url
  ) {
    meal.coverPhotoUrl = meal.photos[0].url;
  }

  await meal.save();
  res.json(meal);
};

exports.deleteMeal = async (req, res) => {
  const meal = await Meal.findById(req.params.id);
  if (!meal || meal.isDeleted)
    return res.status(404).json({ message: "Meal not found" });

  meal.isDeleted = true;
  meal.deletedAt = new Date();
  meal.deleteReason = req.body.reason || "Removed";

  await meal.save();
  res.json({ success: true });
};

exports.updateAvailability = async (req, res) => {
  const meal = await Meal.findById(req.params.id);
  if (!meal || meal.isDeleted)
    return res.status(404).json({ message: "Meal not found" });

  if (req.body.availabilityStatus)
    meal.availabilityStatus = req.body.availabilityStatus;
  if (req.body.availablePortions !== undefined)
    meal.availablePortions = req.body.availablePortions;

  await meal.save();
  res.json(meal);
};

// dev: send actorId in body if you want
exports.takeDownMeal = async (req, res) => {
  const actorId = req.body.actorId;
  const reason = req.body.reason || "Admin action";

  const meal = await Meal.findById(req.params.id);
  if (!meal) return res.status(404).json({ message: "Meal not found" });

  meal.isDeleted = true;
  meal.deletedAt = new Date();
  meal.deletedBy = actorId || null;
  meal.deleteReason = reason;

  await meal.save();
  await logAction(actorId, "take_down_meal", "meal", meal._id, reason);

  res.json(meal);
};

exports.restoreMeal = async (req, res) => {
  const actorId = req.body.actorId;

  const meal = await Meal.findById(req.params.id);
  if (!meal) return res.status(404).json({ message: "Meal not found" });

  meal.isDeleted = false;
  meal.deletedAt = null;
  meal.deletedBy = null;
  meal.deleteReason = "";

  await meal.save();
  await logAction(actorId, "restore_meal", "meal", meal._id);

  res.json(meal);
};
