import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const CURRENCY_FIELDS = ["price", "totalSpent", "totalAmount", "unitPrice", "revenue", "total"];
const DATE_FIELDS = ["joinedDate", "orderDate", "deliveryDate"];
const STATUS_FIELDS = ["status", "membershipTier", "isActive"];

function formatValue(key, val) {
  if (val === null || val === undefined) return "—";
  const k = key.toLowerCase();
  if (DATE_FIELDS.some(f => k.includes(f.toLowerCase()))) {
    const d = new Date(val);
    return isNaN(d) ? String(val) : d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  }
  if (CURRENCY_FIELDS.some(f => k.includes(f.toLowerCase())) && typeof val === "number") {
    return "$" + val.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  }
  if (typeof val === "boolean") return val ? "✅ Yes" : "❌ No";
  if (typeof val === "number") return val.toLocaleString();
  return String(val);
}

function getStatusClass(key, val) {
  if (!STATUS_FIELDS.some(f => key.toLowerCase().includes(f.toLowerCase()))) return "";
  return `status-badge status-${String(val).toLowerCase().replace(/\s+/g, "-")}`;
}

function exportCSV(results) {
  if (!results.length) return;
  const keys = Object.keys(results[0]).filter(k => k !== "__v" && k !== "_id");
  const header = keys.join(",");
  const rows = results.map(r => keys.map(k => `"${String(r[k] ?? "").replace(/"/g, '""')}"`).join(","));
  const blob = new Blob([header + "\n" + rows.join("\n")], { type: "text/csv" });
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
  a.download = `querymind-results-${Date.now()}.csv`; a.click();
}

function exportPDF(results) {
  if (!results.length) return;
  const keys = Object.keys(results[0]).filter(k => k !== "__v" && k !== "_id");
  const doc = new jsPDF({ orientation: keys.length > 5 ? "landscape" : "portrait" });
  doc.setFontSize(18); doc.setTextColor(26, 86, 219);
  doc.text("QueryMind — MongoDB Query Results", 14, 16);
  doc.setFontSize(9); doc.setTextColor(100);
  doc.text(`Generated: ${new Date().toLocaleString()} | Total: ${results.length} records`, 14, 24);
  autoTable(doc, {
    startY: 30,
    head: [keys.map(k => k.replace(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase()))],
    body: results.map(r => keys.map(k => formatValue(k, r[k]))),
    headStyles: { fillColor: [26, 86, 219], textColor: 255, fontStyle: "bold", fontSize: 8 },
    bodyStyles: { fontSize: 7.5 },
    alternateRowStyles: { fillColor: [235, 240, 255] },
    styles: { overflow: "ellipsize", cellWidth: "auto" }
  });
  doc.save(`querymind-results-${Date.now()}.pdf`);
}

export default function ResultsTable({ results }) {
  if (!results || results.length === 0) {
    return (
      <div className="no-results">
        <div style={{ fontSize: "2rem", marginBottom: 12 }}>🔍</div>
        <div style={{ fontWeight: 600, color: "var(--text3)" }}>No results found</div>
        <div style={{ fontSize: "0.82rem", marginTop: 4 }}>Try rephrasing your query</div>
      </div>
    );
  }

  const keys = Object.keys(results[0]).filter(k => k !== "__v" && k !== "_id");

  return (
    <div className="table-container">
      <div className="export-bar">
        <span className="export-label">Export</span>
        <button className="export-btn" onClick={() => exportCSV(results)}>📄 CSV</button>
        <button className="export-btn" onClick={() => exportPDF(results)}>📑 PDF</button>
        <span className="record-count">{results.length} record{results.length !== 1 ? "s" : ""} found</span>
      </div>
      <table>
        <thead>
          <tr>
            <th style={{ width: 40, textAlign: "center", color: "var(--text4)" }}>#</th>
            {keys.map(k => (
              <th key={k}>{k.replace(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase())}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {results.map((row, i) => (
            <tr key={i}>
              <td style={{ textAlign: "center", color: "var(--text4)", fontSize: "0.75rem" }}>{i + 1}</td>
              {keys.map(k => (
                <td key={k} title={String(row[k] ?? "")}>
                  {getStatusClass(k, row[k]) ? (
                    <span className={getStatusClass(k, row[k])}>{formatValue(k, row[k])}</span>
                  ) : (
                    formatValue(k, row[k])
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}