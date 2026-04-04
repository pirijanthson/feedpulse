import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import feedbackRoutes from "./routes/feedback.routes";
import analyticsRoutes from "./routes/analytics.routes";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/feedback", feedbackRoutes);
app.use("/api/analytics", analyticsRoutes);
// app.use("/api/auth", authRoutes);

app.get("/", (_req, res) => {
  res.send("FeedPulse API running...");
});

if (process.env.NODE_ENV !== "test") {
  mongoose.connect(process.env.MONGO_URI as string)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));
}

export default app;

if (process.env.NODE_ENV !== "test") {
  app.listen(4000, () => {
    console.log(`Server running on port 4000`);
  });
}