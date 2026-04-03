import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import feedbackRoutes from "./routes/feedback.routes";
import analyticsRoutes from "./routes/analytics.routes";
import { analyzeFeedback } from "./services/gemini.service";
// import authRoutes from "./routes/auth.routes";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/feedback", feedbackRoutes);
app.use("/api/analytics", analyticsRoutes);
// app.use("/api/auth", authRoutes);

app.use(cors());
app.use(express.json());

// app.use("/api/analytics", analyticsRoutes);

app.get("/", (_req, res) => {
  res.send("FeedPulse API running...");
});

mongoose.connect(process.env.MONGO_URI as string)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.listen(4000, () => console.log("Server running on port 4000"));