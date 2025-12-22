const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");

router.get("/", reportController.getAllReports);
router.post("/", reportController.createReport);
router.get("/:id", reportController.getReportById);

// Admin-like handling 
router.patch("/:id/assign", reportController.assignReport);
router.patch("/:id/resolve", reportController.resolveReport);
router.patch("/:id/reject", reportController.rejectReport);

module.exports = router;
