const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");

// Create review (requires authentication via uid in body)
router.post("/", reviewController.createReview);

// Get reviews for a specific meal
router.get("/meal/:mealId", reviewController.getReviewsByMeal);

// Get reviews for a specific cook (aggregated from meal reviews)
router.get("/cook/:cookId", reviewController.getReviewsByCook);

// Update a review (requires authentication via uid in body)
router.put("/:id", reviewController.updateReview);

// Delete a review (requires authentication via uid in body)
router.delete("/:id", reviewController.deleteReview);

module.exports = router;