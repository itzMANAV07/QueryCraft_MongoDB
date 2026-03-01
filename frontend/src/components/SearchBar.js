export default function SearchBar({ question, setQuestion, onSearch, loading, suggestions }) {
  return (
    <div className="search-section">
      <div className="search-label">
        <span>🔍</span> Natural Language Query
      </div>
      <div className="search-row">
        <div className="search-input-wrap">
          <span className="search-input-icon">⌨️</span>
          <input
            className="search-input"
            type="text"
            value={question}
            onChange={e => setQuestion(e.target.value)}
            onKeyDown={e => e.key === "Enter" && !loading && onSearch()}
            placeholder='Ask anything — e.g. "Show all customers from India" or "Total revenue by country"'
            autoFocus
            disabled={loading}
          />
        </div>
        <button className="search-btn" onClick={() => onSearch()} disabled={loading}>
          {loading
            ? <><div className="spinner" /> Analyzing...</>
            : <><span>⚡</span> Run Query</>
          }
        </button>
      </div>

      {suggestions.length > 0 && (
        <>
          <div className="suggestions-label">💡 Sample Queries</div>
          <div className="suggestions">
            {suggestions.slice(0, 8).map((s, i) => (
              <button
                key={i}
                className="suggestion-chip"
                onClick={() => { setQuestion(s); onSearch(s); }}
                disabled={loading}
              >
                {s}
              </button>
            ))}
          </div>
        </>
      )}

      {loading && (
        <div style={{ marginTop: 16 }}>
          <div className="loading-bar">
            <div className="loading-bar-fill" />
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--text4)", marginTop: 6, textAlign: "center" }}>
            AI is generating your MongoDB query...
          </div>
        </div>
      )}
    </div>
  );
}