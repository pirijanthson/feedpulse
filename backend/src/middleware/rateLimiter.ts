import rateLimit from "express-rate-limit";

export const feedbackLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // limit each IP to 5 requests per window
  message: {
    success: false,
    message: "Too many feedback submissions. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});