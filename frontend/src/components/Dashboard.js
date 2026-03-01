export default function Dashboard({ stats }) {
  const cards = [
  { icon: "👥", label: "Total Customers", value: stats.totalCustomers?.toLocaleString(), color: "#1a56db", bg: "rgba(26,86,219,0.15)" },
  { icon: "📦", label: "Total Products", value: stats.totalProducts?.toLocaleString(), color: "#0ea5e9", bg: "rgba(14,165,233,0.15)" },
  { icon: "🛒", label: "Total Orders", value: stats.totalOrders?.toLocaleString(), color: "#f59e0b", bg: "rgba(245,158,11,0.15)" },
  { icon: "💰", label: "Total Revenue", value: stats.totalRevenue ? "$" + stats.totalRevenue.toLocaleString() : "$0", color: "#6366f1", bg: "rgba(99,102,241,0.15)" },
];


  const maxRevenue = Math.max(...(stats.topCountries?.map(c => c.revenue) || [1]));
  const maxOrders = Math.max(...(stats.ordersByStatus?.map(s => s.count) || [1]));

  return (
    <div>
      {/* Page Title */}
      <div className="page-title">
        <div>
          <h2>Database Overview</h2>
          <p>Real-time statistics from your MongoDB Atlas cluster</p>
        </div>
        <div className="live-indicator">
          <div className="live-dot" />
          Connected to Atlas
        </div>
      </div>

      {/* Stat Cards */}
      <div className="dashboard">
        {cards.map((c, i) => (
          <div key={i} className="stat-card" style={{ "--card-color": c.color }}>
            <div className="stat-icon" style={{ background: c.bg }}>
              {c.icon}
            </div>
            <div className="stat-content">
              <div className="stat-value" style={{ color: c.color }}>{c.value}</div>
              <div className="stat-label">{c.label}</div>
              <div className="stat-trend">● {c.trend}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Analytics Grid */}
      {stats.topCountries && stats.topCountries.length > 0 && (
        <div className="analytics-grid">
          {/* Revenue by Country */}
          <div className="analytics-card">
            <div className="analytics-header">
              <span>🌍</span>
              <span className="analytics-title">Revenue by Country</span>
            </div>
            <div className="analytics-body">
              {stats.topCountries.map((c, i) => (
                <div key={i} className="analytics-row">
                  <span className="analytics-row-label">{c._id}</span>
                  <div className="analytics-row-bar">
                    <div
  className="analytics-row-fill"
  style={{
    width: `${(c.revenue / maxRevenue) * 100}%`,
    opacity: 0.6 + (0.4 * (c.revenue / maxRevenue))
  }}
/>
                  </div>
                  <span className="analytics-row-value">${c.revenue?.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Orders by Status */}
          <div className="analytics-card">
            <div className="analytics-header">
              <span>📋</span>
              <span className="analytics-title">Orders by Status</span>
            </div>
            <div className="analytics-body">
              {stats.ordersByStatus?.map((s, i) => (
                <div key={i} className="analytics-row">
                  <span className={`status-badge status-${s._id}`}>{s._id}</span>
                  <div className="analytics-row-bar">
                    <div
                      className="analytics-row-fill"
                      style={{ width: `${(s.count / maxOrders) * 100}%` }}
                    />
                  </div>
                  <span className="analytics-row-value">{s.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}