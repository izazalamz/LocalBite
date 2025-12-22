const mongoose = require("mongoose");

const StatsDailySchema = new mongoose.Schema(
  {
    dateKey: { type: String, required: true, unique: true, index: true }, // YYYY-MM-DD

    mealsCreated: { type: Number, default: 0, min: 0 },
    ordersRequested: { type: Number, default: 0, min: 0 },
    ordersConfirmed: { type: Number, default: 0, min: 0 },
    ordersCompleted: { type: Number, default: 0, min: 0 },
    ordersCancelled: { type: Number, default: 0, min: 0 },

    estimatedWasteSavedKg: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("StatsDaily", StatsDailySchema);
