const AuditLog = require("../models/auditlogModel");

exports.getAllAuditLogs = async (req, res) => {
  const {
    action,
    targetType,
    actorId,
    targetId,
    page = 1,
    limit = 50,
  } = req.query;

  const filter = {};
  if (action) filter.action = action;
  if (targetType) filter.targetType = targetType;
  if (actorId) filter.actorId = actorId;
  if (targetId) filter.targetId = targetId;

  const skip = (Number(page) - 1) * Number(limit);

  const [items, total] = await Promise.all([
    AuditLog.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    AuditLog.countDocuments(filter),
  ]);

  res.json({ total, page: Number(page), limit: Number(limit), items });
};

exports.getAuditLogById = async (req, res) => {
  const log = await AuditLog.findById(req.params.id).lean();
  if (!log) return res.status(404).json({ message: "Audit log not found" });
  res.json(log);
};
