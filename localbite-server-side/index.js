const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const PORT = process.env.PORT || 3000;
const userRoutes = require("./routes/userRoutes");
const mealRoutes = require("./routes/mealRoutes");
const orderRoutes = require("./routes/orderRoutes");
const statsRoutes = require("./routes/statsRoutes");

const app = express();
const port = process.env.PORT || 5000; 

//middle
app.use(cors());
app.use(express.json());

// Routes
app.use(userRoutes);
app.use("/meals", mealRoutes);
app.use("/orders", orderRoutes);
app.use("/api/stats", statsRoutes);

    const reviews = await Review.find({ 
      cookName: { $regex: new RegExp(`^${cookName}$`, "i") } 
    }).sort({ createdAt: -1 });
    
    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: "Backend error fetching reviews" });
  }
});

// submit
app.post("/api/reviews", async (req, res) => {
  try {
    console.log("[POST] Incoming Data:", req.body);
    const newReview = await Review.create(req.body);
    res.status(201).json(newReview);
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ error: "Backend error saving review" });
  }
});

// del
app.delete("/api/reviews/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`[DELETE] Request for ID: ${id}`);
    
    const deletedReview = await Review.findByIdAndDelete(id);

    if (!deletedReview) {
      return res.status(404).json({ error: "Review not found" });
    }

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ error: "Backend error deleting review" });
  }
});

app.put("/api/reviews/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`[PUT] Update Request for ID: ${id}`, req.body);

    const updatedReview = await Review.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    if (!updatedReview) {
      return res.status(404).json({ error: "Review not found" });
    }

    res.status(200).json(updatedReview);
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json({ error: "Backend error updating review" });
  }
});

// test
app.get("/", (req, res) => {
  res.send("LocalBite Server is Running on Port 5000!");
});

//server start
mongoose.connect("mongodb://localhost:27017/localbite")
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
    });
  })
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));