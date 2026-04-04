import request from "supertest";
import app from "../server";
import Feedback from "../models/feedback.model";
import mongoose from "mongoose";

jest.mock("../services/gemini.service", () => ({
  analyzeFeedback: jest.fn().mockResolvedValue({
    category: "Bug",
    sentiment: "Negative",
    priority_score: 8,
    summary: "Test summary",
    tags: ["bug"],
  }),
}));

afterAll(async () => {
  await mongoose.disconnect();
});

describe("POST /api/feedback", () => {
  it("should save feedback and return AI result", async () => {
    const res = await request(app)
      .post("/api/feedback")
      .send({
        title: "Test bug",
        description: "Something is broken with the application",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.data.title).toBe("Test bug");
  });

  it("should reject invalid feedback", async () => {
    const res = await request(app)
      .post("/api/feedback")
      .send({
        title: "",
        description: "No title provided here",
      });

    expect(res.statusCode).toBe(400);
  });
});

describe("PATCH /api/feedback/:id", () => {
  it("should update status", async () => {
    const feedback = await Feedback.create({
      title: "Test feedback",
      description: "This is a test description for feedback",
      category: "Bug",
    });

    const res = await request(app)
      .patch(`/api/feedback/${feedback._id}/status`)
      .send({ status: "Resolved" });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.status).toBe("Resolved");
  });
});