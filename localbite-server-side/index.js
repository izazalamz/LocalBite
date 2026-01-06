const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const PORT = process.env.PORT || 3000;
const userRoutes = require("./routes/userRoutes");
const mealRoutes = require("./routes/mealRoutes");
const orderRoutes = require("./routes/orderRoutes");
const statsRoutes = require("./routes/statsRoutes");
const verificationRoutes = require("./routes/verificationRoutes");

const app = express();

// Connect to database
connectDB();

//middle
app.use(cors());
app.use(express.json());

// Routes
app.use(userRoutes);
app.use("/meals", mealRoutes);
app.use("/orders", orderRoutes);
app.use("/api/stats", statsRoutes);

app.use("/api/verify", verificationRoutes);

app.get("/", (req, res) => {
  res.send("Get Ready To Share a Bite!");
});
// Mount additional route modules
const reportRoutes = require("./routes/reportRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const auditlogRoutes = require("./routes/auditlogRoutes");

app.use("/reports", reportRoutes);
app.use("/reviews", reviewRoutes);
app.use("/auditlogs", auditlogRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
