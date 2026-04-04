import { analyzeFeedback } from "../services/gemini.service";

jest.mock("../services/gemini.service");

const mockAnalyzeFeedback = analyzeFeedback as jest.MockedFunction<typeof analyzeFeedback>;

describe("Gemini Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should analyze feedback when API is available", async () => {
    mockAnalyzeFeedback.mockResolvedValue({
      category: "Bug",
      sentiment: "Negative",
      priority_score: 8,
      summary: "Test summary",
      tags: ["bug"],
    });

    const result = await analyzeFeedback("Test", "This is a longer description for testing purposes");

    expect(result.category).toBe("Bug");
    expect(result.sentiment).toBe("Negative");
    expect(result.priority_score).toBe(8);
  });

  it("should return fallback response on error", async () => {
    mockAnalyzeFeedback.mockResolvedValue({
      category: "Improvement",
      sentiment: "Negative",
      priority_score: 1,
      summary: "Analysis failed (API error).",
      tags: ["system-error"],
    });

    const result = await analyzeFeedback("Test title", "This is a longer description for the test feedback");

    expect(result.category).toBe("Improvement");
    expect(result.priority_score).toBe(1);
    expect(result.summary).toBeDefined();
    expect(Array.isArray(result.tags)).toBe(true);
  });
});