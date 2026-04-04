"use client";

import { useState } from "react";
import { submitFeedback } from "../services/api";
import "./FeedbackForm.css";

const MAX_LENGTH = 200;

export default function FeedbackForm() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Bug",
    submitterName: "",
    submitterEmail: "",
  });

  const [message, setMessage] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (form.description.length < 20) {
      return setMessage("Description must be at least 20 characters");
    }

    const res = await submitFeedback(form);

    if (res.success) {
      setMessage("✅ Feedback submitted successfully!");
      setForm({
        title: "",
        description: "",
        category: "Bug",
        submitterName: "",
        submitterEmail: "",
      });
    } else {
      setMessage("❌ Error submitting feedback");
    }
  };

  return (
    <div className="feedback-container">
      <div className="feedback-form-wrapper">
        <h1 className="feedback-title">Submit Feedback</h1>

        <form onSubmit={handleSubmit} className="feedback-form">
          <input
            type="text"
            placeholder="Your Name"
            value={form.submitterName}
            onChange={(e) => setForm({ ...form, submitterName: e.target.value })}
            className="feedback-input"
            suppressHydrationWarning
            required
          />

          <input
            type="email"
            placeholder="Your Email"
            value={form.submitterEmail}
            onChange={(e) => setForm({ ...form, submitterEmail: e.target.value })}
            className="feedback-input"
            suppressHydrationWarning
            required
          />

          <input
            type="text"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="feedback-input"
            suppressHydrationWarning
            required
          />

          <textarea
            placeholder="Description (20 - 200 characters)"
            value={form.description}
            onChange={(e) => {
              if (e.target.value.length <= MAX_LENGTH) {
                setForm({ ...form, description: e.target.value });
              }
            }}
            className="feedback-textarea"
            suppressHydrationWarning
            rows={4}
            required
          />

          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="feedback-select"
            suppressHydrationWarning
          >
            <option>Bug</option>
            <option>Feature Request</option>
            <option>Improvement</option>
            <option>Other</option>
          </select>

          <button className="feedback-submit-btn" suppressHydrationWarning>
            Submit Feedback
          </button>
        </form>

        <p
          className={`feedback-char-count ${
            form.description.length > 180 ? "feedback-char-warning" : ""
          }`}
        >
          {form.description.length} / {MAX_LENGTH} characters
        </p>

        {message && (
          <div className="feedback-message">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}