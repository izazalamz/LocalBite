const express = require("express");
const router = express.Router();
const auditlogController = require("../controllers/auditlogController");

router.get("/", auditlogController.getAllAuditLogs);
router.get("/:id", auditlogController.getAuditLogById);

module.exports = router;
