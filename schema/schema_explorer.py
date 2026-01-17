import sqlite3

class SchemaExplorer:
    def __init__(self, db_path: str):
        self.db_path = db_path

    def _connect(self):
        return sqlite3.connect(self.db_path)

    def list_tables(self):
        conn = self._connect()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT name
            FROM sqlite_master
            WHERE type='table'
            AND name NOT LIKE 'sqlite_%';
        """)

        tables = [row[0] for row in cursor.fetchall()]
        conn.close()
        return tables

    def get_table_columns(self, table_name: str):
        conn = self._connect()
        cursor = conn.cursor()

        cursor.execute(f"PRAGMA table_info({table_name});")

        columns = []
        for row in cursor.fetchall():
            columns.append({
                "column": row[1],      # column name
                "type": row[2],        # data type
                "nullable": not bool(row[3]),
                "default": row[4],
                "primary_key": bool(row[5])
            })

        conn.close()
        return columns
