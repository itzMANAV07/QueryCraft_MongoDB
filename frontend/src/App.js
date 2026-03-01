import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import SearchBar from "./components/SearchBar";
import ResultsTable from "./components/ResultsTable";
import Charts from "./components/Charts";
import QueryDisplay from "./components/QueryDisplay";
import History from "./components/History";
import Dashboard from "./components/Dashboard";
import "./App.css";

const API = "http://localhost:5000/api";

export default function App() {
  const [question, setQuestion] = useState("");
  const [results, setResults] = useState(null);
  const [mongoQuery, setMongoQuery] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem("queryHistory") || "[]"));
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("darkMode") === "true");
  const [activeTab, setActiveTab] = useState("table");
  const [suggestions, setSuggestions] = useState([]);
  const [stats, setStats] = useState(null);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    axios.get(`${API}/suggestions`).then(r => setSuggestions(r.data)).catch(() => {});
    axios.get(`${API}/stats`).then(r => setStats(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    document.body.className = darkMode ? "dark" : "";
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const runQuery = useCallback(async (q) => {
    const query = q || question;
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    setResults(null);
    setMongoQuery("");
    setSummary("");

    try {
      const { data } = await axios.post(`${API}/query`, { question: query });
      if (data.success) {
        setResults(data.results);
        setMongoQuery(data.query);
        setSummary(data.summary || "");
        setActiveTab("table");
        const newEntry = { question: query, count: data.count, timestamp: new Date().toISOString(), collection: data.collection };
        const newHistory = [newEntry, ...history.slice(0, 19)];
        setHistory(newHistory);
        localStorage.setItem("queryHistory", JSON.stringify(newHistory));
      } else {
        setError(data.error || "Something went wrong. Try rephrasing your question.");
      }
    } catch {
      setError("Cannot reach server. Make sure the backend is running on port 5000.");
    }
    setLoading(false);
  }, [question, history]);

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("queryHistory");
  };

  const dm = darkMode;

  return (
    <div className={`app ${dm ? "dark" : ""}`}>

      {/* ── HEADER ── */}
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <div className="logo-mark">🍃</div>
            <div className="logo-text">
              <h1>QueryCraft</h1>
              <p>By Natural Language MongoDB Interface</p>
            </div>
          </div>
          <div className="header-actions">
            <button className="btn-ghost" onClick={() => setShowHistory(!showHistory)}>
              🕐 History
              {history.length > 0 && <span className="badge">{history.length}</span>}
            </button>
            <div className="header-divider" />
            <button className="btn-ghost" onClick={() => setDarkMode(!dm)}>
              {dm ? "☀️ Light" : "🌙 Dark"}
            </button>
          </div>
        </div>
      </header>

      <main className="main">

        {/* ── DASHBOARD ── */}
        {stats && !results && !loading && <Dashboard stats={stats} dm={dm} />}

        {/* ── SEARCH ── */}
        <SearchBar
          question={question}
          setQuestion={setQuestion}
          onSearch={runQuery}
          loading={loading}
          suggestions={suggestions}
          dm={dm}
        />

        {/* ── ERROR ── */}
        {error && (
          <div className="error-box">
            <span>❌</span> {error}
          </div>
        )}

        {/* ── SUMMARY ── */}
        {summary && (
          <div className="summary-box">
            <span>🤖</span> {summary}
          </div>
        )}

        {/* ── RESULTS AREA ── */}
        {results && (
          <div className="results-area">
            <div className="results-header">
              <div className="tab-group">
                <button className={`tab ${activeTab === "table" ? "active" : ""}`} onClick={() => setActiveTab("table")}>
                  📋 Table
                </button>
                <button className={`tab ${activeTab === "charts" ? "active" : ""}`} onClick={() => setActiveTab("charts")}>
                  📊 Charts
                </button>
                <button className={`tab ${activeTab === "query" ? "active" : ""}`} onClick={() => setActiveTab("query")}>
                  💻 Query
                </button>
              </div>
              <span className="results-count">{results.length} results</span>
            </div>

            {activeTab === "table" && <ResultsTable results={results} dm={dm} />}
            {activeTab === "charts" && <Charts results={results} dm={dm} />}
            {activeTab === "query" && <QueryDisplay query={mongoQuery} dm={dm} />}
          </div>
        )}

        {/* ── HISTORY PANEL ── */}
        {showHistory && (
          <History
            history={history}
            onSelect={(q) => { setQuestion(q); runQuery(q); setShowHistory(false); }}
            onClear={clearHistory}
            onClose={() => setShowHistory(false)}
            dm={dm}
          />
        )}
      </main>

      <footer className="footer">
        Built by <strong>QueryCraft</strong> &nbsp;·&nbsp; Hack-N-Go with MongoDB 2026 &nbsp;·&nbsp; Using MongoDB Atlas
      </footer>
    </div>
  );
}