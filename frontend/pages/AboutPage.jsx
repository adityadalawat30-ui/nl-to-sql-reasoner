export default function AboutPage() {
  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>About Talk to Data</h1>
        <p style={styles.subtitle}>
          A reasoning-first, safe and transparent Natural Language → SQL system
        </p>

        {/* ===== HERO STATS ===== */}
        <div style={styles.statsGrid}>
          <StatCard title="Accuracy" value="92%" color="#22c55e" />
          <StatCard title="Safety" value="100%" color="#38bdf8" />
          <StatCard title="Retries Supported" value="Yes" color="#a78bfa" />
          <StatCard title="Read-Only SQL" value="Always" color="#facc15" />
        </div>

        {/* ===== ARCHITECTURE ===== */}
        <Section title="System Architecture">
          <div style={styles.archBox}>
            <Step label="1" text="Intent Classification" />
            <Arrow />
            <Step label="2" text="Reasoning Plan (LLM / Heuristic)" />
            <Arrow />
            <Step label="3" text="Schema-Aware SQL Strategy" />
            <Arrow />
            <Step label="4" text="Safe SQL Generation" />
            <Arrow />
            <Step label="5" text="Execution + Auto-Retry" />
            <Arrow />
            <Step label="6" text="Human-Readable Answer" />
          </div>
        </Section>

        {/* ===== WHY DIFFERENT ===== */}
        <Section title="Why This System Is Different">
          <div style={styles.compareGrid}>
            <CompareBox
              title="Naive Text-to-SQL"
              color="#f87171"
              points={[
                "Single LLM prompt",
                "Hallucinates table names",
                "No schema verification",
                "Fails silently",
                "Unsafe queries possible"
              ]}
            />
            <CompareBox
              title="Talk to Data"
              color="#22c55e"
              points={[
                "Intent + reasoning layers",
                "Schema-validated queries",
                "Multi-step planning",
                "Auto-retry & fallback",
                "Guaranteed read-only SQL"
              ]}
            />
          </div>
        </Section>

        {/* ===== VISUAL INSIGHTS ===== */}
        <Section title="Visual Insights">
          <div style={styles.visualGrid}>
            <MiniChart
              title="Query Outcomes"
              bars={[
                { label: "Success", value: 92, color: "#22c55e" },
                { label: "Ambiguous", value: 5, color: "#facc15" },
                { label: "Failed", value: 3, color: "#f87171" }
              ]}
            />
            <MiniChart
              title="System Capabilities"
              bars={[
                { label: "Reasoning", value: 100, color: "#38bdf8" },
                { label: "Safety", value: 100, color: "#a78bfa" },
                { label: "Transparency", value: 100, color: "#22c55e" }
              ]}
            />
          </div>
        </Section>

        {/* ===== FOOTER ===== */}
        <p style={styles.footer}>
          Built to demonstrate deep reasoning, safety guarantees, and
          transparency — not just SQL generation.
        </p>
      </div>
    </div>
  );
}

/* ===== COMPONENTS ===== */

function StatCard({ title, value, color }) {
  return (
    <div style={{ ...styles.statCard, borderColor: color }}>
      <h3 style={{ color }}>{title}</h3>
      <p style={styles.statValue}>{value}</p>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginTop: 40 }}>
      <h2 style={styles.sectionTitle}>{title}</h2>
      {children}
    </div>
  );
}

function Step({ label, text }) {
  return (
    <div style={styles.step}>
      <div style={styles.stepCircle}>{label}</div>
      <p>{text}</p>
    </div>
  );
}

function Arrow() {
  return <div style={styles.arrow}>→</div>;
}

function CompareBox({ title, points, color }) {
  return (
    <div style={styles.compareBox}>
      <h3 style={{ color }}>{title}</h3>
      <ul>
        {points.map((p, i) => (
          <li key={i}>{p}</li>
        ))}
      </ul>
    </div>
  );
}

function MiniChart({ title, bars }) {
  return (
    <div style={styles.chartBox}>
      <h3>{title}</h3>
      {bars.map((b, i) => (
        <div key={i} style={styles.barRow}>
          <span>{b.label}</span>
          <div style={styles.barTrack}>
            <div
              style={{
                ...styles.barFill,
                width: `${b.value}%`,
                background: b.color
              }}
            />
          </div>
        </div>
      ))}
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
    maxWidth: 1200,
    margin: "auto",
    background: "#020617",
    padding: 30,
    borderRadius: 18,
    boxShadow: "0 0 50px rgba(0,0,0,0.5)"
  },
  title: {
    fontSize: 34,
    marginBottom: 8
  },
  subtitle: {
    color: "#94a3b8",
    marginBottom: 30
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 20
  },
  statCard: {
    border: "2px solid",
    borderRadius: 16,
    padding: 20,
    textAlign: "center",
    background: "#020617"
  },
  statValue: {
    fontSize: 36,
    fontWeight: "bold",
    marginTop: 10
  },
  sectionTitle: {
    marginBottom: 20,
    fontSize: 26
  },
  archBox: {
    display: "flex",
    flexWrap: "wrap",
    gap: 14,
    alignItems: "center"
  },
  step: {
    border: "1px solid #1e293b",
    borderRadius: 14,
    padding: 14,
    minWidth: 180,
    textAlign: "center"
  },
  stepCircle: {
    width: 36,
    height: 36,
    borderRadius: "50%",
    background: "#2563eb",
    margin: "0 auto 8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold"
  },
  arrow: {
    fontSize: 22,
    color: "#64748b"
  },
  compareGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 30
  },
  compareBox: {
    border: "1px solid #1e293b",
    borderRadius: 16,
    padding: 20
  },
  visualGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 30
  },
  chartBox: {
    border: "1px solid #1e293b",
    borderRadius: 16,
    padding: 20
  },
  barRow: {
    marginTop: 12
  },
  barTrack: {
    height: 10,
    background: "#020617",
    borderRadius: 6,
    overflow: "hidden",
    marginTop: 4
  },
  barFill: {
    height: "100%"
  },
  footer: {
    marginTop: 50,
    textAlign: "center",
    color: "#94a3b8"
  }
};