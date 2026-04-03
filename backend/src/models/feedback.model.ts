import mongoose, { Schema, Document } from "mongoose";

export interface IFeedback extends Document {
  title: string;
  description: string;
  category: "Bug" | "Feature Request" | "Improvement" | "Other";
  status: "New" | "In Review" | "Resolved";
  submitterName?: string;
  submitterEmail?: string;

  ai_category?: string;
  ai_sentiment?: "Positive" | "Neutral" | "Negative";
  ai_priority?: number;
  ai_summary?: string;
  ai_tags?: string[];
  ai_processed?: boolean;
}

const feedbackSchema = new Schema<IFeedback>(
  {
    title: { type: String, required: true, maxlength: 120 },
    description: { type: String, required: true, minlength: 20 },
    category: {
      type: String,
      enum: ["Bug", "Feature Request", "Improvement", "Other"],
      required: true,
    },
    status: {
      type: String,
      enum: ["New", "In Review", "Resolved"],
      default: "New",
    },
    submitterName: String,
    submitterEmail: {
      type: String,
      match: /.+\@.+\..+/,
    },

    ai_category: String,
    ai_sentiment: {
      type: String,
      enum: ["Positive", "Neutral", "Negative"],
    },
    ai_priority: Number,
    ai_summary: String,
    ai_tags: {
      type: [String],
      default: [],
    },
    ai_processed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Index for performance
feedbackSchema.index({
  status: 1,
  category: 1,
  ai_priority: 1,
  createdAt: -1,
});

export default mongoose.model<IFeedback>("Feedback", feedbackSchema);