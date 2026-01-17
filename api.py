from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime
import copy

from reasoning.classifier import classify_query
from reasoning.planner import create_reasoning_plan
from reasoning.sql_strategy_builder import build_sql_strategy
from schema.schema_explorer import SchemaExplorer
from sql.sql_generator import generate_sql
from sql.sql_executor import execute_sql
from results.result_interpreter import interpret_result

app = FastAPI(title="NL → SQL Reasoner")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- STATE ----------------
QUERY_HISTORY = []
METRICS = {
    "total_queries": 0,
    "successful_queries": 0,
    "failed_queries": 0,
    "auto_retries": 0
}

class QueryRequest(BaseModel):
    question: str
    dataset: str

def get_db_path(dataset: str):
    if dataset == "chinook":
        return "db/chinook.db"
    if dataset == "university":
        return "db/university.db"
    raise ValueError("Unknown dataset")

# ---------------- ASK ----------------
@app.post("/ask")
def ask(req: QueryRequest):
    q = req.question.strip()
    dataset = req.dataset
    METRICS["total_queries"] += 1

    explorer = SchemaExplorer(get_db_path(dataset))
    trace = {"question": q, "dataset": dataset}

    ql = q.lower()

    # ---------- META & SCHEMA (ABSOLUTE PRIORITY) ----------
    if "most rows" in ql:
        tables = explorer.list_tables()
        counts = {}
        for t in tables:
            _, rows = execute_sql(get_db_path(dataset), f"SELECT COUNT(*) FROM {t};")
            counts[t] = rows[0][0]
        best = max(counts, key=counts.get)
        return {"status": "ok", "answer": f"{best} has the most rows ({counts[best]})"}

    if "what tables" in ql or "list tables" in ql:
        return {"status": "ok", "answer": explorer.list_tables()}

    if "schema" in ql or "columns" in ql:
        for t in explorer.list_tables():
            if t.lower() in ql:
                return {"status": "ok", "answer": explorer.get_table_columns(t)}

    # ---------- INTENT ----------
    intent = classify_query(q)
    trace["intent"] = intent

    # ---------- PLAN ----------
    try:
        plan = create_reasoning_plan(q)
    except Exception:
        plan = {"goal": "heuristic", "steps": [], "strategy": "fallback"}
    trace["plan"] = plan

    # ---------- STRATEGY ----------
    strategy = build_sql_strategy(q, intent, plan, explorer)
    trace["strategy"] = strategy

    # ❌ HARD STOP IF NO TABLES (NO FAKE ANSWERS)
    if not strategy.get("tables"):
        METRICS["failed_queries"] += 1
        return {
            "status": "unsupported",
            "answer": "This question cannot be answered using the current database schema.",
            "trace": trace
        }

    # ---------- EXECUTION ----------
    try:
        sql = generate_sql(strategy)
        cols, rows = execute_sql(get_db_path(dataset), sql)
    except Exception:
        METRICS["auto_retries"] += 1
        safe = copy.deepcopy(strategy)
        safe["filters"] = []
        safe["limit"] = 50
        sql = generate_sql(safe)
        cols, rows = execute_sql(get_db_path(dataset), sql)

    trace["sql"] = sql

    answer = interpret_result(q, cols, rows)
    if not rows:
        answer = "No matching records were found."

    METRICS["successful_queries"] += 1
    QUERY_HISTORY.append({
        "time": datetime.utcnow().isoformat(),
        "question": q,
        "dataset": dataset,
        "answer": answer
    })

    return {"status": "ok", "answer": answer, "rows": rows, "trace": trace}

# ---------------- SCHEMA ----------------
@app.get("/schema")
def schema(dataset: str):
    ex = SchemaExplorer(get_db_path(dataset))
    return {t: ex.get_table_columns(t) for t in ex.list_tables()}

# ---------------- HISTORY ----------------
@app.get("/history")
def history():
    return QUERY_HISTORY[-20:]

# ---------------- METRICS ----------------
@app.get("/metrics")
def metrics():
    return METRICS