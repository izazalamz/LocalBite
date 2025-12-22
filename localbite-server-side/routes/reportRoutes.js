const router = require("express").Router();
const { requireAuth } = require("../middleware/auth");
const reports = require("../controllers/reports.controller");

router.post("/", requireAuth, reports.createReport);
router.get("/me", requireAuth, reports.getMyReports);

module.exports = router;
