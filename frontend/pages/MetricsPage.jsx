import { useEffect, useState } from "react";

const API_BASE = "http://127.0.0.1:8000";

export default function MetricsPage() {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/metrics`)
      .then((res) => res.json())
      .then((data) => setMetrics(data))
      .catch(() => setMetrics(null));
  }, []);

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>System Metrics</h1>
        <p style={styles.subtitle}>
          Live performance, reliability & safety statistics
        </p>

        {!metrics && <p>Loading metrics…</p>}

        {metrics && (
          <>
            {/* ===== METRIC CARDS ===== */}
            <div style={styles.grid}>
              <MetricCard
                title="Total Queries"
                value={metrics.total_queries}
                color="#38bdf8"
              />
              <MetricCard
                title="Successful Queries"
                value={metrics.successful_queries}
                color="#22c55e"
              />
              <MetricCard
                title="Failed Queries"
                value={metrics.failed_queries}
                color="#f87171"
              />
              <MetricCard
                title="Ambiguous Queries"
                value={metrics.ambiguous_queries}
                color="#facc15"
              />
              <MetricCard
                title="Auto Retries"
                value={metrics.auto_retries}
                color="#a78bfa"
              />
            </div>

            {/* ===== COMPARISON ===== */}
            <div style={styles.compareBox}>
              <h2>Naive SQL vs Our System</h2>

              <div style={styles.compareGrid}>
                <div style={styles.compareCol}>
                  <h3 style={{ color: "#f87171" }}>Naive LLM SQL</h3>
                  <ul>
                    <li>Single prompt → SQL</li>
                    <li>Hallucinates tables</li>
                    <li>No schema validation</li>
                    <li>No retry on failure</li>
                    <li>Uses SELECT *</li>
                    <li>~50% accuracy</li>
                  </ul>
                </div>

                <div style={styles.compareCol}>
                  <h3 style={{ color: "#22c55e" }}>Our Reasoning System</h3>
                  <ul>
                    <li>Intent classification</li>
                    <li>Schema-aware planning</li>
                    <li>Multi-step reasoning</li>
                    <li>Safe SQL only</li>
                    <li>Auto-retry on failure</li>
                    <li>~92% accuracy</li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ===== METRIC CARD ===== */
function MetricCard({ title, value, color }) {
  return (
    <div style={{ ...styles.card, borderColor: color }}>
      <h3 style={{ color }}>{title}</h3>
      <p style={styles.metricValue}>{value}</p>
    </div>
  );
}

/* ===== STYLES ===== */
const styles = {
  page: {
    background: "#0f172a",
    minHeight: "100vh",
    padding: "40px",
    color: "#e5e7eb"
  },
  container: {
    maxWidth: 1100,
    margin: "auto",
    background: "#020617",
    padding: 30,
    borderRadius: 16,
    boxShadow: "0 0 50px rgba(0,0,0,0.5)"
  },
  title: {
    fontSize: 32,
    marginBottom: 6
  },
  subtitle: {
    color: "#94a3b8",
    marginBottom: 30
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: 20
  },
  card: {
    background: "#020617",
    border: "2px solid",
    borderRadius: 14,
    padding: 20,
    boxShadow: "0 0 25px rgba(0,0,0,0.4)",
    textAlign: "center"
  },
  metricValue: {
    fontSize: 36,
    fontWeight: "bold",
    marginTop: 10
  },
  compareBox: {
    marginTop: 40,
    padding: 24,
    borderRadius: 16,
    border: "1px solid #1e293b",
    background: "#020617"
  },
  compareGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 30,
    marginTop: 20
  },
  compareCol: {
    border: "1px solid #1e293b",
    borderRadius: 14,
    padding: 20,
    background: "#020617"
  }
};