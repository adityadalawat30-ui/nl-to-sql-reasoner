def build_sql_strategy(question, intent, plan, explorer):
    # ================= NORMALIZATION =================
    q = question.lower()

    # ---- plural & synonym normalization ----
    synonyms = {
        "highest": "most",
        "maximum": "most",
        "top": "most",
        "albums": "album",
        "artists": "artist",
        "tracks": "track",
        "courses": "course",
        "students": "student",
        "playlists": "playlist",
    }

    for k, v in synonyms.items():
        q = q.replace(k, v)

    def norm(s):
        return s.replace("?", "").replace("-", " ").strip().upper()

    tables = explorer.list_tables()

    strategy = {
        "tables": [],
        "joins": [],
        "filters": [],
        "group_by": [],
        "select_columns": [],
        "order_by": None,
        "limit": None,
        "having": None,
        "risk_notes": []
    }

    # =================================================
    # META QUERIES
    # =================================================
    if "table" in q and "most rows" in q:
        strategy["meta"] = {"type": "table_row_count", "tables": tables}
        return strategy

    if "what tables" in q or "list tables" in q:
        strategy["meta"] = {"type": "list_tables"}
        return strategy

    if "schema" in q:
        for t in tables:
            if t.lower() in q:
                strategy["meta"] = {"type": "table_schema", "table": t}
                return strategy

    # =================================================
    # SIMPLE COUNT
    # =================================================
    if q.startswith("how many"):
        for t in tables:
            if t.lower() in q:
                strategy["tables"] = [t]
                strategy["select_columns"] = ["COUNT(*)"]
                return strategy

    # =================================================
    # SIMPLE JOIN – TRACKS BY ARTIST (FUZZY)
    # =================================================
    if "track" in q and "by" in q and {"Artist", "Album", "Track"}.issubset(tables):
        artist = norm(q.split("by")[-1])
        strategy["tables"] = ["Track"]
        strategy["joins"].extend([
            {"type": "INNER", "table": "Album", "from": "Album.AlbumId", "to": "Track.AlbumId"},
            {"type": "INNER", "table": "Artist", "from": "Artist.ArtistId", "to": "Album.ArtistId"}
        ])
        strategy["filters"].append(f"UPPER(Artist.Name) = '{artist}'")
        strategy["select_columns"] = ["Track.Name"]
        return strategy

    # =================================================
    # MODERATE – ARTIST WITH MOST TRACKS
    # =================================================
    if "artist" in q and "most" in q and "track" in q and {"Artist", "Album", "Track"}.issubset(tables):
        strategy["tables"] = ["Artist"]
        strategy["joins"].extend([
            {"type": "INNER", "table": "Album", "from": "Artist.ArtistId", "to": "Album.ArtistId"},
            {"type": "INNER", "table": "Track", "from": "Album.AlbumId", "to": "Track.AlbumId"}
        ])
        strategy["select_columns"] = [
            "Artist.Name",
            "COUNT(Track.TrackId) AS TrackCount"
        ]
        strategy["group_by"] = ["Artist.ArtistId", "Artist.Name"]
        strategy["order_by"] = "TrackCount DESC"
        strategy["limit"] = 1
        return strategy

    # =================================================
    # MODERATE – COURSES WITH MOST STUDENTS
    # =================================================
    if "course" in q and "most" in q and "student" in q and {"Course", "Enrollment"}.issubset(tables):
        strategy["tables"] = ["Course"]
        strategy["joins"].append({
            "type": "INNER",
            "table": "Enrollment",
            "from": "Course.CourseId",
            "to": "Enrollment.CourseId"
        })
        strategy["select_columns"] = [
            "Course.Title",
            "COUNT(Enrollment.StudentId) AS StudentCount"
        ]
        strategy["group_by"] = ["Course.CourseId", "Course.Title"]
        strategy["order_by"] = "StudentCount DESC"
        strategy["limit"] = 5
        return strategy

    # =================================================
    # MULTI-STEP – ROCK & JAZZ CUSTOMERS
    # =================================================
    if "rock" in q and "jazz" in q and {"Customer", "Invoice", "InvoiceLine", "Track", "Genre"}.issubset(tables):
        strategy["tables"] = ["Customer"]
        strategy["joins"].extend([
            {"type": "INNER", "table": "Invoice", "from": "Customer.CustomerId", "to": "Invoice.CustomerId"},
            {"type": "INNER", "table": "InvoiceLine", "from": "Invoice.InvoiceId", "to": "InvoiceLine.InvoiceId"},
            {"type": "INNER", "table": "Track", "from": "InvoiceLine.TrackId", "to": "Track.TrackId"},
            {"type": "INNER", "table": "Genre", "from": "Track.GenreId", "to": "Genre.GenreId"}
        ])
        strategy["filters"].append("Genre.Name IN ('Rock', 'Jazz')")
        strategy["select_columns"] = [
            "Customer.FirstName",
            "Customer.LastName",
            "Customer.Email"
        ]
        strategy["group_by"] = [
            "Customer.CustomerId",
            "Customer.FirstName",
            "Customer.LastName",
            "Customer.Email"
        ]
        strategy["having"] = "COUNT(DISTINCT Genre.Name) = 2"
        return strategy

    # =================================================
    # MULTI-STEP – STUDENTS IN MULTIPLE COURSES
    # =================================================
    if "student" in q and "and" in q and {"Student", "Enrollment", "Course"}.issubset(tables):
        courses = []
        for c in ["mathematics", "physics", "chemistry"]:
            if c in q:
                courses.append(c.title())

        if len(courses) >= 2:
            quoted = ", ".join(f"'{c}'" for c in courses)
            strategy["tables"] = ["Student"]
            strategy["joins"].extend([
                {"type": "INNER", "table": "Enrollment", "from": "Student.StudentId", "to": "Enrollment.StudentId"},
                {"type": "INNER", "table": "Course", "from": "Enrollment.CourseId", "to": "Course.CourseId"}
            ])
            strategy["filters"].append(f"Course.Title IN ({quoted})")
            strategy["select_columns"] = ["Student.Name", "Student.Email"]
            strategy["group_by"] = ["Student.StudentId", "Student.Name", "Student.Email"]
            strategy["having"] = f"COUNT(DISTINCT Course.Title) = {len(courses)}"
            return strategy

    # =================================================
    # SIMPLE JOIN – COURSES TAKEN BY A STUDENT (BY NAME)
    # =================================================
    if (
        "course" in q
        and ("taken by" in q or "enrolled by" in q or "enrolled in" in q)
        and {"Student", "Enrollment", "Course"}.issubset(tables)
    ):
        name = q.split("by")[-1].strip().upper()

        strategy["tables"] = ["Student"]
        strategy["joins"].extend([
            {
                "type": "INNER",
                "table": "Enrollment",
                "from": "Student.StudentId",
                "to": "Enrollment.StudentId"
            },
            {
                "type": "INNER",
                "table": "Course",
                "from": "Enrollment.CourseId",
                "to": "Course.CourseId"
            }
        ])

        strategy["filters"].append(
            f"UPPER(Student.FirstName) = '{name}'"
        )
        strategy["select_columns"] = ["Course.Title"]
        return strategy

    # =================================================
    # SAFETY GUARD
    # =================================================
    if strategy.get("having") and not strategy.get("group_by"):
        strategy["risk_notes"].append("HAVING without GROUP BY is unsafe.")
        return strategy

    # =================================================
    # FINAL SAFE FALLBACK
    # =================================================
    strategy["risk_notes"].append(
        "Unable to safely map this question to the database schema."
    )
    return strategy