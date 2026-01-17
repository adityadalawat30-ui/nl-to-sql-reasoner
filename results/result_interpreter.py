def interpret_result(question, columns, rows):
    q = question.lower()

    # Case 1: COUNT queries
    if columns == ["COUNT(*)"]:
        count = rows[0][0] if rows else 0

        if "from" in q:
            entity = q.split("from")[-1].replace("?", "").strip().title()
            return f"There are {count} customers from {entity}."

        return f"The result count is {count}."

    # Case 2: Empty result set
    if not rows:
        if "never" in q and "purchase" in q:
            return (
                "All customers in the database have made at least one purchase. "
                "There are no customers without an invoice."
            )

        return "No matching records were found."

    # Case 3: List results
    result_lines = []
    for row in rows:
        result_lines.append(", ".join(str(v) for v in row))

    return "Results:\n" + "\n".join(result_lines)
