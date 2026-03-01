export default function History({ history, onSelect, onClear, onClose }) {
  return (
    <div className="history-overlay" onClick={onClose}>
      <div className="history-panel" onClick={e => e.stopPropagation()}>
        <div className="history-header">
          <h3>🕐 Query History</h3>
          <div className="history-header-actions">
            {history.length > 0 && (
              <button className="export-btn" onClick={onClear} style={{ color: "#c53030" }}>🗑 Clear</button>
            )}
            <button className="export-btn" onClick={onClose}>✕ Close</button>
          </div>
        </div>
        {history.length === 0 ? (
          <div className="history-empty">No queries yet. Start asking questions!</div>
        ) : (
          history.map((item, i) => (
            <div key={i} className="history-item" onClick={() => onSelect(item.question)}>
              <div className="history-q">"{item.question}"</div>
              <div className="history-meta">
                <span>📦 {item.collection}</span>
                <span>📊 {item.count} results</span>
                <span>🕐 {new Date(item.timestamp).toLocaleTimeString()}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
