import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#1a56db","#0ea5e9","#6366f1","#f59e0b","#10b981","#f43f5e","#8b5cf6","#06b6d4","#ef4444","#84cc16"];

const TOOLTIP_STYLE = {
  background: "#0f1829",
  border: "1px solid #1e2e4a",
  borderRadius: 8,
  color: "#f0f6ff",
  fontSize: "0.82rem",
  boxShadow: "0 8px 24px rgba(0,0,0,0.4)"
};

function smartDetect(results) {
  if (!results || results.length === 0) return null;
  const keys = Object.keys(results[0]);
  const numericKeys = keys.filter(k => typeof results[0][k] === "number" && !["__v"].includes(k));
  const stringKeys = keys.filter(k => typeof results[0][k] === "string" && !["_id", "email", "phone", "description", "orderId"].includes(k));
  if (numericKeys.length === 0) return null;
  const labelKey = stringKeys.find(k => ["country", "category", "status", "membershipTier", "brand", "city", "gender", "paymentMethod", "product", "name", "_id"].includes(k)) || stringKeys[0];
  const valueKey = numericKeys.find(k => ["totalAmount", "revenue", "total", "totalSpent", "price", "count", "rating", "stock"].includes(k)) || numericKeys[0];
  return { labelKey, valueKey, numericKeys };
}

function formatTooltipValue(v, key) {
  if (typeof v === "number" && v > 100 && ["revenue","total","totalAmount","totalSpent","price"].some(k => key?.toLowerCase().includes(k))) {
    return "$" + v.toLocaleString();
  }
  return typeof v === "number" ? v.toLocaleString() : v;
}

export default function Charts({ results, dm }) {
  if (!results || results.length === 0) return <div className="chart-note">No results to visualize</div>;

  const detected = smartDetect(results);
  if (!detected) return (
    <div className="chart-note">
      <div style={{ fontSize: "2rem", marginBottom: 10 }}>📊</div>
      <div style={{ fontWeight: 600, color: "var(--text3)", marginBottom: 4 }}>No numeric data to chart</div>
      <div style={{ fontSize: "0.82rem" }}>Try: "Total revenue by country" or "Orders by status"</div>
    </div>
  );

  const { labelKey, valueKey, numericKeys } = detected;
  const axisTick = { fill: dm ? "#5a7aaa" : "#64748b", fontSize: 11, fontFamily: "DM Sans" };

  const chartData = results.slice(0, 10).map(r => {
    const obj = { name: String(r[labelKey] || r["_id"] || "Unknown") };
    numericKeys.forEach(k => { obj[k] = typeof r[k] === "number" ? parseFloat(r[k].toFixed(2)) : 0; });
    return obj;
  });

  const gridColor = dm ? "#1e2e4a" : "#e2e8f0";

  return (
    <div className="charts-container">

      {/* BAR CHART */}
      <div className="chart-card">
        <div className="chart-card-header">
          <div className="chart-title">
            <span>📊</span> Bar Chart
          </div>
          <span className="chart-badge">{valueKey} by {labelKey}</span>
        </div>
        <div className="chart-body">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis dataKey="name" tick={axisTick} angle={-35} textAnchor="end" interval={0} axisLine={{ stroke: gridColor }} tickLine={false} />
              <YAxis tick={axisTick} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v, name) => [formatTooltipValue(v, name), name]} cursor={{ fill: dm ? "rgba(59,130,246,0.08)" : "rgba(26,86,219,0.06)" }} />
              <Legend wrapperStyle={{ fontSize: "0.78rem", fontFamily: "DM Sans" }} />
              {numericKeys.slice(0, 3).map((k, i) => (
                <Bar key={k} dataKey={k} fill={COLORS[i]} radius={[5, 5, 0, 0]} maxBarSize={55} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* PIE CHART */}
      {results.length <= 12 && (
        <div className="chart-card">
          <div className="chart-card-header">
            <div className="chart-title">
              <span>🥧</span> Distribution
            </div>
            <span className="chart-badge">{valueKey} breakdown</span>
          </div>
          <div className="chart-body">
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey={valueKey}
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  innerRadius={50}
                  paddingAngle={3}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                  labelLine={{ stroke: dm ? "#5a7aaa" : "#94a3b8" }}
                >
                  {chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v, name) => [formatTooltipValue(v, name), name]} />
                <Legend wrapperStyle={{ fontSize: "0.78rem", fontFamily: "DM Sans" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* LINE CHART */}
      {numericKeys.length > 1 && (
        <div className="chart-card">
          <div className="chart-card-header">
            <div className="chart-title">
              <span>📈</span> Trend
            </div>
            <span className="chart-badge">Multiple Metrics</span>
          </div>
          <div className="chart-body">
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis dataKey="name" tick={axisTick} angle={-35} textAnchor="end" interval={0} axisLine={{ stroke: gridColor }} tickLine={false} />
                <YAxis tick={axisTick} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Legend wrapperStyle={{ fontSize: "0.78rem", fontFamily: "DM Sans" }} />
                {numericKeys.slice(0, 3).map((k, i) => (
                  <Line key={k} type="monotone" dataKey={k} stroke={COLORS[i]} strokeWidth={2.5} dot={{ r: 4, fill: COLORS[i], strokeWidth: 0 }} activeDot={{ r: 6 }} />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}