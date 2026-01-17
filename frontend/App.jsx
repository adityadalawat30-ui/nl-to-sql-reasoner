import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import HomePage from "./pages/HomePage";
import AskPage from "./pages/AskPage";
import SchemaPage from "./pages/SchemaPage";
import HistoryPage from "./pages/HistoryPage";
import MetricsPage from "./pages/MetricsPage";
import AboutPage from "./pages/AboutPage";

export default function App() {
  return (
    <BrowserRouter>
      {/* ---------- TOP NAV BAR ---------- */}
      <nav style={styles.nav}>
        <div style={styles.brand}>📊 Talk to Data</div>
        <div style={styles.links}>
          <Link to="/">Home</Link>
          <Link to="/ask">Ask</Link>
          <Link to="/schema">Schema</Link>
          <Link to="/history">History</Link>
          <Link to="/metrics">Metrics</Link>
          <Link to="/about">About</Link>
        </div>
      </nav>

      {/* ---------- ROUTES ---------- */}
      <Routes>
        <Route path="/" element={<HomePage />} />   {/* DEFAULT */}
        <Route path="/ask" element={<AskPage />} />
        <Route path="/schema" element={<SchemaPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/metrics" element={<MetricsPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </BrowserRouter>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 30px",
    background: "#020617",
    borderBottom: "1px solid #1e293b",
    color: "#e5e7eb"
  },
  brand: {
    fontSize: 20,
    fontWeight: 700
  },
  links: {
    display: "flex",
    gap: 20
  }
};