import { useEffect, useState } from "react";

export default function HistoryPage() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/history")
      .then(res => res.json())
      .then(data => setHistory(Array.isArray(data) ? data : []));
  }, []);

  return (
    <div style={{ padding: 40 }}>
      <h2>Query History</h2>

      <table border="1" cellPadding="10" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>Time</th>
            <th>Dataset</th>
            <th>Question</th>
            <th>Answer</th>
          </tr>
        </thead>
        <tbody>
          {history.map((h, i) => (
            <tr key={i}>
              <td>{h.time}</td>
              <td>{h.dataset}</td>
              <td>{h.question}</td>
              <td>{h.answer}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}