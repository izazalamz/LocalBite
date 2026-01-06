const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");


// Public/report endpoints
router.get("/", reportController.getAllReports);
router.post("/", reportController.createReport);
router.get("/:id", reportController.getReportById);

// Admin actions
router.patch("/:id/assign", reportController.assignReport);
router.patch("/:id/resolve", reportController.resolveReport);
router.patch("/:id/reject", reportController.rejectReport);

module.exports = router;
