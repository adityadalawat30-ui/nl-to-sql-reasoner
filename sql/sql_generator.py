def generate_sql(strategy):
    if not strategy["tables"]:
        raise RuntimeError("No tables selected for SQL generation")

    # SELECT clause
    if strategy.get("select_columns"):
        select_clause = ", ".join(strategy["select_columns"])
    elif strategy.get("aggregations"):
        select_clause = ", ".join(strategy["aggregations"])
    else:
        raise RuntimeError("No select columns or aggregations defined")

    sql = f"SELECT {select_clause} FROM {strategy['tables'][0]}"

    # JOINs
    for join in strategy.get("joins", []):
        sql += (
            f" {join['type']} JOIN {join['table']}"
            f" ON {join['from']} = {join['to']}"
        )

    # WHERE
    if strategy.get("filters"):
        sql += " WHERE " + " AND ".join(strategy["filters"])

    # GROUP BY
    if strategy.get("group_by"):
        sql += " GROUP BY " + ", ".join(strategy["group_by"])

    # HAVING  ✅ ONLY ONCE
    if strategy.get("having"):
        sql += " HAVING " + strategy["having"]

    # ORDER BY
    if strategy.get("order_by"):
        sql += " ORDER BY " + strategy["order_by"]

    # LIMIT (safety)
    if strategy.get("limit"):
        sql += f" LIMIT {strategy['limit']}"

    sql += ";"
    return sql
