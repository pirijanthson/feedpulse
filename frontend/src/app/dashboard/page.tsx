"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "./page.css";

interface Feedback {
  _id: string;
  title: string;
  description: string;
  submitterName?: string;
  submitterEmail?: string;
  category: "Bug" | "Feature Request" | "Improvement" | "Other";
  status: "New" | "In Review" | "Resolved";
  ai_sentiment?: string;
  ai_priority?: number;
  ai_summary?: string;
  ai_tags?: string[];
  createdAt: string;
}

export default function Dashboard() {
  const router = useRouter();
  
  useEffect(() => {
    const token = localStorage.getItem("admin-auth");
    if (!token) {
      window.location.href = "/login";
    }
  }, []);

  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [filter, setFilter] = useState<"All" | Feedback["category"]>("All");
  const [statusFilter, setStatusFilter] = useState<"All" | Feedback["status"]>("All");
  const [sortBy, setSortBy] = useState("latest");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [weeklySummary, setWeeklySummary] = useState<string>("");
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const formatDate = (date: string) => new Date(date).toLocaleDateString("en-CA");

  const fetchFeedbacks = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/feedback");
      const data = await res.json();
      setFeedbacks(data.data);
    } catch (err) {
      console.error("Error fetching feedbacks:", err);
    }
  };

  const fetchWeeklySummary = async () => {
    setIsSummarizing(true);
    try {
      const res = await fetch("http://localhost:4000/api/analytics/weekly-summary");
      const data = await res.json();
      setWeeklySummary(data.report || data.summary);
    } catch (err) {
      setWeeklySummary("Failed to generate AI summary.");
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleReanalyze = async (id: string) => {
    setProcessingId(id);
    try {
      const res = await fetch(`http://localhost:4000/api/feedback/reanalyze/${id}`, {
        method: "PUT",
      });
      if (res.ok) {
        fetchFeedbacks();
      }
    } catch (err) {
      console.error("Re-analysis failed:", err);
    } finally {
      setProcessingId(null);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const updateStatus = async (id: string, status: Feedback["status"]) => {
    try {
      await fetch(`http://localhost:4000/api/feedback/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      fetchFeedbacks();
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this feedback?")) return;
    try {
      await fetch(`http://localhost:4000/api/feedback/${id}`, {
        method: "DELETE",
      });
      fetchFeedbacks();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const filtered = feedbacks
    .filter((f) => {
      const categoryMatch = filter === "All" || f.category === filter;
      const statusMatch = statusFilter === "All" || f.status === statusFilter;
      const searchMatch =
        f.title.toLowerCase().includes(search.toLowerCase()) ||
        (f.ai_summary || "").toLowerCase().includes(search.toLowerCase());
      return categoryMatch && statusMatch && searchMatch;
    })
    .sort((a, b) => {
      if (sortBy === "latest") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === "oldest") {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (sortBy === "priority-high") {
        return (b.ai_priority || 0) - (a.ai_priority || 0);
      }
      if (sortBy === "priority-low") {
        return (a.ai_priority || 0) - (b.ai_priority || 0);
      }
      if (sortBy === "sentiment") {
        const order = { Negative: 0, Neutral: 1, Positive: 2 };
        return (order[a.ai_sentiment as keyof typeof order] ?? 3) -
               (order[b.ai_sentiment as keyof typeof order] ?? 3);
      }
      return 0;
    });

  const totalFeedback = feedbacks.length;
  const openItems = feedbacks.filter(
    (f) => f.status === "New" || f.status === "In Review"
  ).length;
  const avgPriority = feedbacks.length > 0
    ? (feedbacks.reduce((sum, f) => sum + (f.ai_priority || 0), 0) / feedbacks.length).toFixed(1)
    : "0";
  
  const tagCount: Record<string, number> = {};
  feedbacks.forEach((f) => {
    f.ai_tags?.forEach((tag) => {
      tagCount[tag] = (tagCount[tag] || 0) + 1;
    });
  });
  const mostCommonTag = Object.keys(tagCount).length > 0
    ? Object.entries(tagCount).sort((a, b) => b[1] - a[1])[0][0]
    : "N/A";

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filtered.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const getSentimentClass = (sentiment?: string) => {
    if (!sentiment) return "sentiment-pending";
    switch (sentiment.toLowerCase()) {
      case "positive": return "sentiment-positive";
      case "neutral": return "sentiment-neutral";
      case "negative": return "sentiment-negative";
      default: return "sentiment-pending";
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        {/* Header Section */}
        <div className="dashboard-header">
          <h1 className="dashboard-title">Admin Dashboard</h1>
          <button
            onClick={() => {
              localStorage.removeItem("admin-auth");
              window.location.href = "/login";
            }}
            className="logout-button"
          >
            Logout
          </button>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card stat-card-total">
            <p className="stat-label">Total Feedback</p>
            <p className="stat-value">{totalFeedback}</p>
          </div>
          <div className="stat-card stat-card-open">
            <p className="stat-label">Open Items</p>
            <p className="stat-value">{openItems}</p>
          </div>
          <div className="stat-card stat-card-priority">
            <p className="stat-label">Avg Priority</p>
            <p className="stat-value">{avgPriority}</p>
          </div>
          <div className="stat-card stat-card-tag">
            <p className="stat-label">Top Tag</p>
            <p className="stat-value">{mostCommonTag}</p>
          </div>
        </div>

        {/* Weekly Insights Button */}
        <div className="insights-section">
          <button 
            onClick={fetchWeeklySummary}
            className="insights-button"
            disabled={isSummarizing}
          >
            {isSummarizing ? "Analyzing Last 7 Days..." : "✨ Generate Weekly Insights"}
          </button>
        </div>

        {/* Weekly Summary Section */}
        {weeklySummary && (
          <div className="weekly-summary">
            <h2 className="weekly-summary-title">
              📊 AI Theme Analysis (Last 7 Days)
            </h2>
            <div className="weekly-summary-content">
              {weeklySummary}
            </div>
          </div>
        )}

        {/* Filters Section */}
        <div className="filters-section">
          <div className="filter-group">
            <label className="filter-label">Category:</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as Feedback["category"] | "All")}
              className="filter-select"
            >
              <option>All</option>
              <option>Bug</option>
              <option>Feature Request</option>
              <option>Improvement</option>
              <option>Other</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as Feedback["status"] | "All")}
              className="filter-select"
            >
              <option>All</option>
              <option>New</option>
              <option>In Review</option>
              <option>Resolved</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Sort:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="latest">Latest</option>
              <option value="oldest">Oldest</option>
              <option value="priority-high">Priority (High → Low)</option>
              <option value="priority-low">Priority (Low → High)</option>
              <option value="sentiment">Sentiment</option>
            </select>
          </div>

          <div className="filter-group search-group">
            <input
              type="text"
              placeholder="🔍 Search title or summary..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        {/* Feedback List */}
        <div className="feedback-list">
          {paginatedData.map((f) => (
            <div key={f._id} className="feedback-card">
              <div className="feedback-main">
                <div className="feedback-header">
                  <h2 className="feedback-title">{f.title}</h2>
                  <span className={`feedback-status status-${f.status.toLowerCase().replace(" ", "-")}`}>
                    {f.status}
                  </span>
                </div>
                
                <p className="feedback-description">{f.description}</p>
                
                <div className="feedback-details">
                  <div className="details-left">
                    <p><strong>User:</strong> {f.submitterName || "Anonymous"}</p>
                    <p><strong>Email:</strong> {f.submitterEmail || "N/A"}</p>
                  </div>
                  <div className="details-right">
                    <p><strong>Category:</strong> {f.category}</p>
                    <p><strong>Date:</strong> {formatDate(f.createdAt)}</p>
                  </div>
                </div>

                <div className="feedback-actions">
                  <select
                    value={f.status}
                    onChange={(e) => updateStatus(f._id, e.target.value as any)}
                    className="status-select"
                  >
                    <option>New</option>
                    <option>In Review</option>
                    <option>Resolved</option>
                  </select>
                  <button 
                    onClick={() => handleReanalyze(f._id)}
                    disabled={processingId === f._id}
                    className="reanalyze-button"
                  >
                    {processingId === f._id ? "Re-analyzing..." : "🔄 Refresh AI Tags"}
                  </button>
                  <button
                    onClick={() => handleDelete(f._id)}
                    className="delete-button"
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>

              {/* AI Result Panel - Updated with Improved Priority Bar */}
              <div className="ai-panel">
                <h3 className="ai-panel-title">AI Analysis</h3>
                <div className="ai-content">
                  <div className="ai-item">
                    <label className="ai-label">Sentiment</label>
                    <p className={`sentiment-value ${getSentimentClass(f.ai_sentiment)}`}>
                      {f.ai_sentiment || "Pending..."}
                    </p>
                  </div>
                  
                  <div className="ai-item">
                    <label className="ai-label">Priority Score</label>
                    <div className="priority-container">
                      <div className="priority-bar-wrapper">
                        <div 
                          className={`priority-progress priority-level-${f.ai_priority || 0}`}
                          style={{ width: `${(f.ai_priority || 0) * 10}%` }}
                        >
                          <div className="priority-progress-glow"></div>
                        </div>
                      </div>
                      <div className="priority-value-container">
                        <span className="priority-score">{f.ai_priority ?? 0}</span>
                        <span className="priority-max">/ 10</span>
                      </div>
                    </div>
                    {/* <div className="priority-labels">
                      <span>Low</span>
                      <span>Medium</span>
                      <span>High</span>
                      <span>Critical</span>
                    </div> */}
                  </div>
                  
                  <div className="ai-item">
                    <label className="ai-label">AI Summary</label>
                    <p className="ai-summary">
                      "{f.ai_summary || "Waiting for processing..."}"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="pagination">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="pagination-button"
          >
            Prev
          </button>
          <span className="pagination-info">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="pagination-button"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}