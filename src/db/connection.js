/* Abre o SQLite, migra o schema legado (PRAGMA user_version) e cria o perfil padrão */
const fs = require("fs");
const path = require("path");
const Database = require("better-sqlite3");

const MIGRATIONS = [
  `CREATE TABLE IF NOT EXISTS profile (
     id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, avatar TEXT, monthly_budget INT,
     days_per_week INT, hours_per_day INT, vacation_per_year INT, value_hour INT);
   CREATE TABLE IF NOT EXISTS jobs (
     id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, daily_hours INT, total_hours INT, created_at DATETIME);`,
  `CREATE TABLE profile_v2 (
     id INTEGER PRIMARY KEY CHECK (id = 1),
     name TEXT NOT NULL,
     avatar TEXT NOT NULL DEFAULT '',
     monthly_budget_cents INTEGER NOT NULL CHECK (monthly_budget_cents >= 0),
     days_per_week INTEGER NOT NULL CHECK (days_per_week BETWEEN 1 AND 7),
     hours_per_day REAL NOT NULL CHECK (hours_per_day > 0 AND hours_per_day <= 24),
     vacation_per_year INTEGER NOT NULL CHECK (vacation_per_year BETWEEN 0 AND 51)
   );
   INSERT INTO profile_v2 (id, name, avatar, monthly_budget_cents, days_per_week, hours_per_day, vacation_per_year)
     SELECT 1, coalesce(name, 'Freelancer'), coalesce(avatar, ''), cast(round(coalesce(monthly_budget, 0) * 100) AS INTEGER),
            min(max(coalesce(days_per_week, 5), 1), 7), min(max(coalesce(hours_per_day, 6), 1), 24),
            min(max(coalesce(vacation_per_year, 4), 0), 51)
     FROM profile ORDER BY id LIMIT 1;
   CREATE TABLE jobs_v2 (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     name TEXT NOT NULL CHECK (length(name) BETWEEN 2 AND 80),
     daily_hours REAL NOT NULL CHECK (daily_hours > 0 AND daily_hours <= 24),
     total_hours REAL NOT NULL CHECK (total_hours > 0),
     created_at INTEGER NOT NULL
   );
   INSERT INTO jobs_v2 (id, name, daily_hours, total_hours, created_at)
     SELECT id, trim(name), daily_hours, total_hours, coalesce(created_at, cast(strftime('%s','now') AS INTEGER) * 1000)
     FROM jobs WHERE length(trim(coalesce(name, ''))) BETWEEN 2 AND 80 AND daily_hours > 0 AND daily_hours <= 24 AND total_hours > 0;
   DROP TABLE profile; DROP TABLE jobs;
   ALTER TABLE profile_v2 RENAME TO profile;
   ALTER TABLE jobs_v2 RENAME TO jobs;`,
];

const DEFAULT_PROFILE = {
  name: "Freelancer",
  avatar: "",
  monthly_budget_cents: 500000,
  days_per_week: 5,
  hours_per_day: 6,
  vacation_per_year: 4,
};

/* Abre o banco (arquivo ou ":memory:"), aplica migrations e garante o perfil */
function openDatabase(file) {
  if (file !== ":memory:") fs.mkdirSync(path.dirname(file), { recursive: true });
  const db = new Database(file);
  db.pragma("journal_mode = WAL");
  const current = db.pragma("user_version", { simple: true });
  for (let v = current; v < MIGRATIONS.length; v++) {
    db.transaction(() => {
      db.exec(MIGRATIONS[v]);
      db.pragma(`user_version = ${v + 1}`);
    })();
  }
  const hasProfile = db.prepare("SELECT 1 FROM profile WHERE id = 1").get();
  if (!hasProfile) {
    db.prepare(
      `INSERT INTO profile (id, name, avatar, monthly_budget_cents, days_per_week, hours_per_day, vacation_per_year)
       VALUES (1, @name, @avatar, @monthly_budget_cents, @days_per_week, @hours_per_day, @vacation_per_year)`
    ).run(DEFAULT_PROFILE);
  }
  return db;
}

module.exports = { openDatabase };
/* Fim de connection.js */
