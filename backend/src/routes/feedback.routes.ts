import express from "express";
import { submitFeedback, getFeedback } from "../controllers/feedback.controller";
import { feedbackLimiter } from "../middleware/rateLimiter";
import { reanalyzeFeedback } from "../controllers/feedback.controller";
import { updateStatus } from "../controllers/feedback.controller";
import { deleteFeedback } from "../controllers/feedback.controller";
import { getSingleFeedback } from "../controllers/feedback.controller";

const router = express.Router();

router.post("/", feedbackLimiter, submitFeedback);
router.get("/", getFeedback);
router.put("/reanalyze/:id", reanalyzeFeedback);
router.patch("/:id/status", updateStatus);
router.delete("/:id", deleteFeedback);
router.get("/:id", getSingleFeedback);

export default router;