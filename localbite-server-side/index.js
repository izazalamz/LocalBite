const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const PORT = process.env.PORT || 3000;
const userRoutes = require("./routes/userRoutes");
const mealRoutes = require("./routes/mealRoutes");
const orderRoutes = require("./routes/orderRoutes");
const statsRoutes = require("./routes/statsRoutes");

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use(userRoutes);
app.use("/meals", mealRoutes);
app.use("/orders", orderRoutes);
app.use("/api/stats", statsRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
