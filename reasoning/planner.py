from utils.gemini_client import get_gemini_model
import json

PLANNER_PROMPT = """
You are a database reasoning planner.

Your task is to create a STEP-BY-STEP PLAN to answer the user question.
DO NOT write SQL.
DO NOT assume table names unless obvious.
Focus on reasoning like a human analyst.

Return ONLY valid JSON in this format:

{
  "goal": "",
  "steps": [],
  "strategy": "",
  "assumptions": []
}

Guidelines:
- Break complex problems into logical steps
- Mention joins, filters, grouping conceptually
- If assumptions are required, list them
- Keep steps concise and ordered

User question:
"""

def create_reasoning_plan(question: str):
    model = get_gemini_model()
    response = model.generate_content(PLANNER_PROMPT + question)

    raw_text = response.text.strip()

    # Try direct parse
    try:
        return json.loads(raw_text)
    except json.JSONDecodeError:
        pass

    # Fallback JSON extraction
    try:
        start = raw_text.index("{")
        end = raw_text.rindex("}") + 1
        return json.loads(raw_text[start:end])
    except Exception:
        raise RuntimeError("Planner failed to return valid JSON")
