import { Request, Response } from "express";
import Feedback from "../models/feedback.model";
import { generateWeeklySummary } from "../services/gemini.service";

export const getWeeklyAISummary = async (req: Request, res: Response) => {
  try {
    // 1. Get date from 7 days ago
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    // 2. Fetch feedback from DB
    const feedbacks = await Feedback.find({ createdAt: { $gte: weekAgo } });

    if (!feedbacks.length) {
      return res.status(200).json({ summary: "No feedback found in the last 7 days." });
    }

    // 3. Call AI Service
    const summary = await generateWeeklySummary(feedbacks);

    res.status(200).json({ summary });
  } catch (error) {
    res.status(500).json({ message: "Error generating AI summary" });
  }
};