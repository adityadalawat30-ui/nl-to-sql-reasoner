import { useEffect, useState } from "react";

const API_BASE = "http://127.0.0.1:8000";

export default function SchemaPage() {
  const [dataset, setDataset] = useState("chinook");
  const [schema, setSchema] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/schema?dataset=${dataset}`)
      .then(res => res.json())
      .then(data => {
        setSchema(data);
        setLoading(false);
      });
  }, [dataset]);

  if (loading) return <p style={{ color: "white" }}>Loading schema…</p>;

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>📘 Database Schema Explorer</h1>

      <select
        value={dataset}
        onChange={e => setDataset(e.target.value)}
        style={styles.select}
      >
        <option value="chinook">Chinook</option>
        <option value="university">University</option>
      </select>

      {Object.keys(schema).map(table => (
        <div key={table} style={styles.tableCard}>
          <h2 style={styles.tableTitle}>{table}</h2>

          <table style={styles.table}>
            <thead>
              <tr>
                <th>Column</th>
                <th>Type</th>
                <th>Primary Key</th>
                <th>Nullable</th>
              </tr>
            </thead>
            <tbody>
              {schema[table].map(col => (
                <tr key={col.column}>
                  <td>{col.column}</td>
                  <td>{col.type}</td>
                  <td>{col.primary_key ? "✔️" : ""}</td>
                  <td>{col.nullable ? "Yes" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

const styles = {
  page: {
    background: "#0f172a",
    minHeight: "100vh",
    padding: 40,
    color: "#e5e7eb"
  },
  title: {
    fontSize: 28,
    marginBottom: 20
  },
  select: {
    padding: 8,
    borderRadius: 8,
    marginBottom: 20
  },
  tableCard: {
    background: "#020617",
    borderRadius: 14,
    padding: 20,
    marginBottom: 30,
    border: "1px solid #1e293b"
  },
  tableTitle: {
    marginBottom: 12
  },
  table: {
    width: "100%",
    borderCollapse: "collapse"
  }
};