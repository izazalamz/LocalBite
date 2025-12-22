const Report = require("../models/reportModel");
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

exports.getAllReports = async (req, res) => {
  const reports = await Report.find()
    .sort({ status: 1, createdAt: -1 })
    .limit(200);
  res.json(reports);
};

exports.createReport = async (req, res) => {
  const { reporterId, targetType, targetId, category, description } = req.body;

  if (!reporterId || !targetType || !targetId || !category) {
    return res
      .status(400)
      .json({
        message: "reporterId, targetType, targetId, category are required",
      });
  }

  const report = await Report.create({
    reporterId,
    targetType,
    targetId,
    category,
    description: description || "",
  });

  res.status(201).json(report);
};

exports.getReportById = async (req, res) => {
  const report = await Report.findById(req.params.id);
  if (!report) return res.status(404).json({ message: "Report not found" });
  res.json(report);
};

// dev: send actorId in body if you want
exports.assignReport = async (req, res) => {
  const actorId = req.body.actorId;

  const report = await Report.findByIdAndUpdate(
    req.params.id,
    { status: "under_review", assignedTo: actorId || null },
    { new: true }
  );

  if (!report) return res.status(404).json({ message: "Report not found" });

  await logAction(actorId, "assign_report", "report", report._id);
  res.json(report);
};

exports.resolveReport = async (req, res) => {
  const actorId = req.body.actorId;
  const actionTaken = req.body.actionTaken || "none";
  const note = req.body.note || "";

  const report = await Report.findByIdAndUpdate(
    req.params.id,
    {
      status: "resolved",
      actionTaken,
      resolutionNote: note,
      resolvedAt: new Date(),
    },
    { new: true }
  );

  if (!report) return res.status(404).json({ message: "Report not found" });

  await logAction(
    actorId,
    "resolve_report",
    "report",
    report._id,
    `${actionTaken}: ${note}`
  );
  res.json(report);
};

exports.rejectReport = async (req, res) => {
  const actorId = req.body.actorId;
  const note = req.body.note || "";

  const report = await Report.findByIdAndUpdate(
    req.params.id,
    { status: "rejected", resolutionNote: note, resolvedAt: new Date() },
    { new: true }
  );

  if (!report) return res.status(404).json({ message: "Report not found" });

  await logAction(actorId, "reject_report", "report", report._id, note);
  res.json(report);
};
