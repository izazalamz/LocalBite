const express = require("express");
const router = express.Router();
const mealController = require("../controllers/mealController");

router.get("/", mealController.getAllMeals);
router.get("/:id", mealController.getMealById);

router.post("/", mealController.createMeal);
router.patch("/:id", mealController.updateMeal);
router.delete("/:id", mealController.deleteMeal);

router.patch("/:id/availability", mealController.updateAvailability);

// Admin-like moderation
router.patch("/:id/takedown", mealController.takeDownMeal);
router.patch("/:id/restore", mealController.restoreMeal);

module.exports = router;
