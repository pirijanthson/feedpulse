import { Router } from "express";
import { getWeeklyAISummary } from "../controllers/analytics.controller";

const router = Router();

// Endpoint: GET /api/analytics/weekly-summary
router.get("/weekly-summary", getWeeklyAISummary);

export default router;