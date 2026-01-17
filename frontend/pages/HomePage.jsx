import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>
      {/* HERO */}
      <section style={styles.hero}>
        <h1 style={styles.title}>Talk to Your Data</h1>
        <p style={styles.subtitle}>
          Natural Language → Reasoning → Safe SQL → Trusted Answers
        </p>

        <button
          style={styles.cta}
          onClick={() => navigate("/ask")}
        >
          🚀 Start Chatting
        </button>
      </section>

      {/* METRICS / VISUALS */}
      <section style={styles.cards}>
        <Card title="🧠 Reasoning First">
          Multi-step planning, intent detection, schema awareness
        </Card>

        <Card title="🛡️ Safety Guaranteed">
          Read-only queries · No SELECT * · Auto-retries
        </Card>

        <Card title="📈 Edge-Case Ready">
          Ambiguous · Meta · Multi-step · Failure-safe
        </Card>
      </section>

      {/* CHART PLACEHOLDER */}
      <section style={styles.chartBox}>
        <h3>System Capabilities Overview</h3>
        <div style={styles.fakeChart}>
          ✔ Simple<br/>
          ✔ Moderate<br/>
          ✔ Multi-step<br/>
          ✔ Meta<br/>
          ✔ Ambiguous<br/>
          ✔ Failure-safe
        </div>
      </section>
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div style={styles.card}>
      <h3>{title}</h3>
      <p>{children}</p>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #020617, #0f172a)",
    color: "#e5e7eb",
    padding: "60px"
  },
  hero: {
    textAlign: "center",
    marginBottom: 60
  },
  title: {
    fontSize: 42,
    fontWeight: 800
  },
  subtitle: {
    color: "#94a3b8",
    fontSize: 18,
    marginTop: 10
  },
  cta: {
    marginTop: 30,
    padding: "14px 30px",
    fontSize: 18,
    borderRadius: 12,
    border: "none",
    background: "#2563eb",
    color: "white",
    cursor: "pointer"
  },
  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 20,
    marginBottom: 60
  },
  card: {
    background: "#020617",
    border: "1px solid #1e293b",
    borderRadius: 14,
    padding: 20,
    boxShadow: "0 0 20px rgba(0,0,0,0.3)"
  },
  chartBox: {
    background: "#020617",
    border: "1px solid #1e293b",
    borderRadius: 16,
    padding: 30,
    textAlign: "center"
  },
  fakeChart: {
    marginTop: 20,
    padding: 20,
    background: "#020617",
    borderRadius: 12,
    border: "1px dashed #334155",
    color: "#22c55e",
    fontSize: 16,
    lineHeight: 1.8
  }
};
