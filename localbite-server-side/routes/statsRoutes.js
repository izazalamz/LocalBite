const express = require("express");
const router = express.Router();
const statsController = require("../controllers/statsController");

router.get("/dashboard", statsController.getDashboard);
router.get("/cook/:cookId", statsController.getCookDashboard);

module.exports = router;
