def classify_query(question: str):
    q = question.lower()

    # ===============================
    # META QUERIES (MUST COME FIRST)
    # ===============================
    if (
        "table" in q
        or "tables" in q
        or "schema" in q
        or "column" in q
        or "columns" in q
    ):
        return {
            "intent_type": "meta",
            "needs_schema_exploration": True,
            "needs_clarification": False,
            "risk_level": "low"
        }

    # ===============================
    # AMBIGUOUS QUERIES
    # ===============================
    if "best" in q or "recent" in q or "top" in q:
        return {
            "intent_type": "ambiguous",
            "needs_schema_exploration": False,
            "needs_clarification": True,
            "risk_level": "medium"
        }

    # ===============================
    # MULTI-STEP / REASONING
    # ===============================
    if "never" in q or "not enrolled" in q or "no purchase" in q:
        return {
            "intent_type": "multi_step",
            "needs_schema_exploration": True,
            "needs_clarification": False,
            "risk_level": "medium"
        }

    # ===============================
    # MODERATE
    # ===============================
    if "most" in q or "total" in q or "count" in q:
        return {
            "intent_type": "moderate",
            "needs_schema_exploration": True,
            "needs_clarification": False,
            "risk_level": "low"
        }

    # ===============================
    # SIMPLE DEFAULT
    # ===============================
    return {
        "intent_type": "simple",
        "needs_schema_exploration": False,
        "needs_clarification": False,
        "risk_level": "low"
    }
