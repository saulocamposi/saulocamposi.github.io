const express = require("express");
const sqlite3 = require("sqlite3");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;
const db = new sqlite3.Database("./database.db");
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "public")));

// Create the database table if it doesn't exist
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS data (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      resume TEXT,
      education TEXT,
      skills_summary TEXT,
      profession_experience TEXT
    )
  `);
});

// Create a new entry
app.post("/api/data", (req, res) => {
  const { resume, education, skills_summary, profession_experience } = req.body;
  const query = `
    INSERT INTO data (resume, education, skills_summary, profession_experience)
    VALUES (?, ?, ?, ?)
  `;

  db.run(
    query,
    [resume, education, skills_summary, profession_experience],
    (err) => {
      if (err) {
        console.error(err);
        res
          .status(500)
          .json({ error: "Error inserting data into the database" });
      } else {
        res.json({ message: "Data inserted successfully" });
      }
    }
  );
});

// Get all entries
app.get("/api/data", (req, res) => {
  const query = "SELECT * FROM data";
  db.all(query, (err, rows) => {
    if (err) {
      console.error(err);
      res
        .status(500)
        .json({ error: "Error retrieving data from the database" });
    } else {
      res.json(rows);
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
