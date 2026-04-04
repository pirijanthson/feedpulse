import { Request, Response } from "express";
import Feedback from "../models/feedback.model";
import { analyzeFeedback } from "../services/gemini.service";

export const submitFeedback = async (req: Request, res: Response) => {
  try {
    const { title, description, submitterEmail } = req.body;

    // ✅ Basic validation
    if (!title || !description || description.length < 20) {
      return res.status(400).json({
        success: false,
        message: "Title and description (min 20 chars) are required",
      });
    }

    // ✅ Email validation (optional field)
    if (submitterEmail) {
      const emailRegex = /.+\@.+\..+/;
      if (!emailRegex.test(submitterEmail)) {
        return res.status(400).json({
          success: false,
          message: "Invalid email format",
        });
      }
    }

    // ✅ Call Gemini AI first to get category
    let aiResult = null;
    try {
      aiResult = await analyzeFeedback(title, description);
    } catch (aiError) {
      console.log("AI Processing Failed:", aiError);
      // Continue with default category if AI fails
    }

    // ✅ Prepare feedback data with category
    const feedbackData = {
      title,
      description,
      submitterEmail: submitterEmail || undefined,
      category: aiResult?.category || "Other",
    };

    // ✅ Save feedback with category
    const feedback = await Feedback.create(feedbackData);

    // ✅ Update with AI details if available
    if (aiResult) {
      feedback.ai_category = aiResult.category;
      feedback.ai_sentiment = aiResult.sentiment;
      feedback.ai_priority = aiResult.priority_score;
      feedback.ai_summary = aiResult.summary;
      feedback.ai_tags = aiResult.tags;
      feedback.ai_processed = true;

      await feedback.save();
    }

    // ✅ Response
    res.status(201).json({
      success: true,
      data: feedback,
      message: "Feedback submitted successfully",
    });

  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getFeedback = async (_req: Request, res: Response) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: feedbacks,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const reanalyzeFeedback = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // 1. Find the feedback document
    const feedback = await Feedback.findById(id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found",
      });
    }

    // 2. Call the Gemini service with existing data
    // This uses the title and description already stored in DB
    const aiResult = await analyzeFeedback(
      feedback.title,
      feedback.description
    );

    // 3. Handle service failure (e.g., API Key invalid or Quota hit)
    if (!aiResult) {
      return res.status(500).json({
        success: false,
        message: "AI analysis failed. Check server logs for API errors.",
      });
    }

    // 4. Update the document fields 
    // Note: Ensure these field names match your Mongoose Schema exactly
    feedback.category = aiResult.category; 
    feedback.ai_sentiment = aiResult.sentiment;
    feedback.ai_priority = aiResult.priority_score; // Gemini returns 1-10
    feedback.ai_summary = aiResult.summary;
    feedback.ai_tags = aiResult.tags;
    feedback.ai_processed = true;

    // Save the changes
    await feedback.save();

    res.status(200).json({
      success: true,
      message: "AI re-analysis completed successfully",
      data: feedback,
    });

  } catch (error: any) {
    console.error("Re-analysis Controller Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "An internal error occurred during re-analysis",
    });
  }
};

export const updateStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const feedback = await Feedback.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found",
      });
    }

    res.json({
      success: true,
      data: feedback,
    });

  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteFeedback = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deleted = await Feedback.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Feedback deleted successfully",
    });

  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getSingleFeedback = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const feedback = await Feedback.findById(id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found",
      });
    }

    res.status(200).json({
      success: true,
      data: feedback,
    });

  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};