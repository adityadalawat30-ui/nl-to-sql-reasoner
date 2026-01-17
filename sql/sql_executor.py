import sqlite3

def execute_sql(db_path, sql):
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()

    try:
        cur.execute(sql)
        rows = cur.fetchall()
        columns = [desc[0] for desc in cur.description] if cur.description else []
        return columns, rows
    finally:
        conn.close()
