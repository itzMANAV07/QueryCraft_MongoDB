import { useState } from "react";

export default function QueryDisplay({ query }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(query);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!query) return null;

  const collection = query.match(/db\.(\w+)\./)?.[1] || "collection";
  const isAggregate = query.includes("aggregate");

  return (
    <div className="query-container">
      <div className="query-meta">
        <span className="query-meta-label">💻 AI-Generated MongoDB Query</span>
        <span className={`query-type-badge ${isAggregate ? "query-type-aggregate" : "query-type-find"}`}>
          {isAggregate ? "⚡ Aggregation Pipeline" : "🔎 Find Query"}
        </span>
      </div>

      <div className="query-box">
        <button className={`copy-btn ${copied ? "copied" : ""}`} onClick={copy}>
          {copied ? "✅ Copied!" : "📋 Copy"}
        </button>
        <code>{query}</code>
      </div>

      <div className="query-explain">
        <strong>🧠 What this query does:</strong> Runs on the <code>{collection}</code> collection in MongoDB Atlas.{" "}
        {isAggregate
          ? "Uses MongoDB's Aggregation Pipeline — a powerful multi-stage data processing framework — to group, filter, sort, and transform data across documents."
          : "Uses MongoDB's find() method to filter documents based on the specified conditions and return matching records."}
        {" "}You can run this directly in <strong>MongoDB Compass</strong> or <strong>Atlas Data Explorer</strong>.
      </div>
    </div>
  );
}