import { useState } from "react";

const API_BASE = "http://127.0.0.1:8000";

const FAILURE_QUESTIONS = [
  "Which courses are offered by each department?",
  "Show sales from the future",
  "Which employees sold the most albums in 2050?",
  "Give me profit margin per artist",
  "Which tables have inconsistent data?",
  "Show me customers with negative purchases",
  "Which students enrolled in departments that do not exist?"
];

export default function AskPage() {
  const [dataset, setDataset] = useState("chinook");
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showExplain, setShowExplain] = useState(false);
  const [showComparison, setShowComparison] = useState(false);

  const exampleQuestions = {
    simple: [
      "How many albums are there?",
      "How many customers are from Brazil?"
    ],
    simpleJoin: [
      "List all tracks by Iron Maiden",
      "List all courses taken by Alice"
    ],
    moderate: [
      "Which artist has most tracks?",
      "Which courses have most students?"
    ],
    multiStep: [
      "Customers who purchased Rock and Jazz",
      "Students enrolled in Mathematics and Physics"
    ],
    meta: [
      "What tables exist in this database?",
      "Which table has most rows?"
    ]
  };

  async function askQuestion() {
    if (!question.trim()) return;

    setLoading(true);
    setError(null);
    setResponse(null);
    setShowExplain(false);
    setShowComparison(false);

    try {
      const res = await fetch(`${API_BASE}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, dataset })
      });

      const data = await res.json();
      setResponse(data);
    } catch (err) {
      setError("Failed to connect to backend");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>Ask Your Data</h1>
        <p style={styles.subtitle}>
          Natural language → reasoning → safe SQL → clear answers
        </p>

        {/* ===== STEP 1 FIXED: TOP CONTROLS ===== */}
        <div style={{ ...styles.row, justifyContent: "space-between" }}>

          {/* Failure Dropdown — LEFT */}
          <div style={{ flex: 1 }}>
            <label style={styles.label}>Failure / Edge-case Questions</label>
            <select
              style={styles.select}
              defaultValue=""
              onChange={(e) => e.target.value && setQuestion(e.target.value)}
            >
              <option value="">— Select a failure case —</option>
              {FAILURE_QUESTIONS.map((q, i) => (
                <option key={i} value={q}>{q}</option>
              ))}
            </select>
          </div>

          {/* Dataset — RIGHT (IMPORTANT) */}
          <div style={{ flex: 1 }}>
            <label style={styles.datasetLabel}>Dataset</label>
            <select
              value={dataset}
              onChange={(e) => setDataset(e.target.value)}
              style={styles.select}
            >
              <option value="chinook">Chinook (Music Store)</option>
              <option value="university">University</option>
            </select>
          </div>

        </div>

        {/* ===== Example Question Dropdowns ===== */}
        <div style={styles.examplesRow}>
          {Object.entries(exampleQuestions).map(([category, questions]) => (
            <select
              key={category}
              style={styles.exampleSelect}
              onChange={(e) => e.target.value && setQuestion(e.target.value)}
            >
              <option value="">{category.toUpperCase()}</option>
              {questions.map((q, idx) => (
                <option key={idx} value={q}>{q}</option>
              ))}
            </select>
          ))}
        </div>

        {/* Question box */}
        <textarea
          placeholder="Ask a question (e.g. Which customers never made a purchase?)"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          style={styles.textarea}
        />

        <button onClick={askQuestion} style={styles.button}>
          Ask Question
        </button>

        {loading && <p style={styles.thinking}>Thinking…</p>}
        {error && <p style={styles.error}>{error}</p>}

        {/* ================= RESULT ================= */}
        {response?.answer && (
          <div style={styles.resultCard}>

            <div style={styles.finalAnswer}>
              <h2>Final Answer</h2>
              <p>{response.answer}</p>
            </div>

            <div style={{ marginBottom: 12 }}>
              <button
                style={styles.explainBtn}
                onClick={() => setShowExplain(!showExplain)}
              >
                🤔 Explain reasoning
              </button>

              <button
                style={styles.compareBtn}
                onClick={() => setShowComparison(!showComparison)}
              >
                ⚖️ Naive vs Our System
              </button>
            </div>

            {showExplain && (
              <div style={styles.explainBox}>
                <p>
                  The system understands intent, explores schema, plans safely,
                  and retries if execution fails — avoiding hallucinations.
                </p>
              </div>
            )}

            {showComparison && (
              <div style={styles.compareBox}>
                <div style={styles.compareCol}>
                  <h3>Naive SQL</h3>
                  <pre style={styles.code}>SELECT * FROM some_table;</pre>
                </div>

                <div style={styles.compareCol}>
                  <h3>Our SQL</h3>
                  <pre style={styles.code}>
                    {response.trace?.generated_sql || "No SQL generated"}
                  </pre>
                </div>
              </div>
            )}

            <div style={styles.trace}>
              <Section title="Intent">
                {JSON.stringify(response.trace?.intent, null, 2)}
              </Section>

              {response.trace?.reasoning_plan && (
                <Section title="Reasoning Plan">
                  {JSON.stringify(response.trace.reasoning_plan, null, 2)}
                </Section>
              )}

              {response.trace?.sql_strategy && (
                <Section title="SQL Strategy">
                  {JSON.stringify(response.trace.sql_strategy, null, 2)}
                </Section>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <h3>{title}</h3>
      <pre style={styles.pre}>{children}</pre>
    </div>
  );
}

const styles = {
  page: { background: "#0f172a", minHeight: "100vh", padding: 40, color: "#e5e7eb" },
  container: { maxWidth: 900, margin: "auto", background: "#020617", padding: 28, borderRadius: 14 },
  title: { fontSize: 30 },
  subtitle: { color: "#94a3b8", marginBottom: 20 },
  row: { display: "flex", gap: 16, marginBottom: 12 },
  label: { fontWeight: 600 },
  datasetLabel: { fontWeight: 800, color: "#38bdf8" },
  select: { padding: 8, borderRadius: 8, background: "#020617", color: "#e5e7eb", border: "1px solid #1e293b" },
  textarea: { width: "100%", minHeight: 90, padding: 12, borderRadius: 10 },
  button: { padding: "10px 22px", borderRadius: 10, background: "#2563eb", color: "white", border: "none" },
  thinking: { color: "#38bdf8" },
  error: { color: "#f87171" },
  resultCard: { marginTop: 30, padding: 20, borderRadius: 14, border: "1px solid #1e293b" },
  finalAnswer: { border: "1px solid #22c55e", padding: 16, borderRadius: 12 },
  explainBtn: { marginRight: 8, padding: 8, background: "#334155", color: "white", border: "none" },
  compareBtn: { padding: 8, background: "#475569", color: "white", border: "none" },
  explainBox: { marginTop: 12, padding: 12, border: "1px solid #1e293b" },
  compareBox: { display: "flex", gap: 12, marginTop: 12 },
  compareCol: { flex: 1, border: "1px solid #1e293b", padding: 12 },
  trace: { marginTop: 20 },
  pre: { background: "#020617", padding: 10, borderRadius: 8 },
  code: { background: "#020617", padding: 10, borderRadius: 8 },
  examplesRow: { display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 14 },
  exampleSelect: { background: "#020617", color: "#e5e7eb", border: "1px solid #334155", borderRadius: 8, padding: "6px 10px", fontSize: 13 }
};