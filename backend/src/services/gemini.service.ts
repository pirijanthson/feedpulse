import axios from "axios";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * FIX 1: Use the standard Flash model for REST API.
 * 'gemini-2.0-flash' is the stable, high-speed choice for 2026.
 */
const MODEL_ID = "gemini-2.5-flash"; 

const callGeminiAPI = async (prompt: string, isJson: boolean = false, retries = 2): Promise<any> => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === "undefined") {
    console.error("Gemini Error: API Key is missing.");
    return null;
  }

  const URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_ID}:generateContent?key=${apiKey}`;

  try {
    const response = await axios.post(
      URL,
      {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          response_mime_type: isJson ? "application/json" : "text/plain",
          temperature: 0.1,
        },
      },
      { headers: { "Content-Type": "application/json" } }
    );

    const resultText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!resultText) throw new Error("Empty response from Gemini");

    if (isJson) {
      const cleaned = resultText.replace(/```json|```/g, "").trim();
      return JSON.parse(cleaned);
    }

    return resultText;

  } catch (error: any) {
    const status = error.response?.status;
    if ((status === 429 || status === 503) && retries > 0) {
      await sleep(5000);
      return callGeminiAPI(prompt, isJson, retries - 1);
    }
    console.error(`Gemini API Error (${status}):`, error.response?.data?.error?.message || error.message);
    return null;
  }
};

/**
 * FIX 2: Updated fallback to match your Mongoose Enum.
 * I changed "Uncategorized" to "Improvement" to satisfy your DB validation.
 */
export const analyzeFeedback = async (title: string, description: string) => {
  const prompt = `
    Analyze user feedback. Return strictly valid JSON.
    Enum for category: "Bug", "Feature", "Improvement".
    Enum for sentiment: "Positive", "Negative".
    
    Format: { 
      "category": "Bug | Feature | Improvement", 
      "sentiment": "Positive | Negative", 
      "priority_score": number, 
      "summary": "string", 
      "tags": [] 
    }
    Feedback: ${title} - ${description}
  `;

  const result = await callGeminiAPI(prompt, true);
  
  // Ensure the fallback matches your DB's allowed 'enum' values exactly
  return result ?? { 
    category: "Improvement", 
    sentiment: "Negative", 
    priority_score: 1, 
    summary: "Analysis failed (API error).", 
    tags: ["system-error"] 
  };
};

export const generateWeeklySummary = async (feedbacks: any[]) => {
  if (!feedbacks?.length) return "No feedback recorded.";
  const list = feedbacks.map((f, i) => `${i+1}. [${f.category}] ${f.title}`).join("\n");
  const prompt = `Summarize these feedback items into themes:\n${list}`;
  return await callGeminiAPI(prompt, false);
};