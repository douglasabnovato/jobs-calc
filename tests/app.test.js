/* Testes do domínio (cálculos) e das rotas do JobsCalc com banco em memória e relógio fixo */
const { test } = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");
const { openDatabase } = require("../src/db/connection");
const { createRepositories } = require("../src/repositories");
const { createApp } = require("../src/app");
const calc = require("../src/domain/calculations");
const { parseNumber } = require("../src/lib/validation");

const NOW = Date.UTC(2026, 8, 1, 12);
const DAY = 86400000;

/* App isolado com banco novo */
function build(auth) {
  const repos = createRepositories(openDatabase(":memory:"));
  return { repos, app: createApp({ repos, now: () => NOW, auth }) };
}

test("valor da hora: R$ 5.000, 6h/dia, 5 dias, 4 semanas de férias", () => {
  const cents = calc.valueHourCents({ monthlyBudgetCents: 500000, hoursPerDay: 6, daysPerWeek: 5, vacationPerYear: 4 });
  assert.equal(cents, 4167);
});

test("prazo: 20h a 4h/dia criado há 2 dias restam 3 dias; vencido vira done", () => {
  assert.equal(calc.remainingDays({ totalHours: 20, dailyHours: 4, createdAt: NOW - 2 * DAY }, NOW), 3);
  const dash = calc.buildDashboard(
    [{ id: 1, name: "A", totalHours: 2, dailyHours: 2, createdAt: NOW - 5 * DAY }, { id: 2, name: "B", totalHours: 10, dailyHours: 2.5, createdAt: NOW }],
    { monthlyBudgetCents: 500000, hoursPerDay: 6, daysPerWeek: 5, vacationPerYear: 4 },
    NOW
  );
  assert.deepEqual(dash.count, { total: 2, progress: 1, done: 1 });
  assert.equal(dash.freeHours, 3.5);
});

test("números aceitam vírgula decimal pt-BR", () => {
  assert.equal(parseNumber("1.234,56"), 1234.56);
  assert.equal(parseNumber("2,5"), 2.5);
  assert.ok(Number.isNaN(parseNumber("abc")));
});

test("criar job com aspas no nome não quebra nem injeta SQL", async () => {
  const { app, repos } = build();
  await request(app).post("/job").type("form").send({ name: 'Site "X"); DROP TABLE jobs;--', "daily-hours": "2,5", "total-hours": "10" }).expect(303);
  const jobs = repos.jobs.all();
  assert.equal(jobs.length, 1);
  assert.equal(jobs[0].dailyHours, 2.5);
  const home = await request(app).get("/").expect(200);
  assert.match(home.text, /DROP TABLE jobs/);
  assert.match(home.text, /<strong>1<\/strong> Em andamento/);
});

test("job inválido responde 422 com erro por campo", async () => {
  const { app, repos } = build();
  const res = await request(app).post("/job").type("form").send({ name: "X", "daily-hours": "0", "total-hours": "" }).expect(422);
  assert.equal((res.text.match(/aria-invalid="true"/g) || []).length, 3);
  assert.equal(repos.jobs.all().length, 0);
});

test("editar, 404 para job inexistente e excluir", async () => {
  const { app, repos } = build();
  const id = repos.jobs.create({ name: "Landing", dailyHours: 2, totalHours: 8, createdAt: NOW });
  await request(app).post(`/job/${id}`).type("form").send({ name: "Landing v2", "daily-hours": "4", "total-hours": "8" }).expect(303);
  assert.equal(repos.jobs.find(id).name, "Landing v2");
  await request(app).get("/job/999").expect(404);
  await request(app).get("/job/abc").expect(404);
  await request(app).post(`/job/delete/${id}`).expect(303);
  assert.equal(repos.jobs.all().length, 0);
});

test("perfil recalcula valor da hora e recusa férias de 52 semanas", async () => {
  const { app, repos } = build();
  await request(app).post("/profile").type("form")
    .send({ name: "Ana", avatar: "", "monthly-budget": "8.000,00", "hours-per-day": "8", "days-per-week": "5", "vacation-per-year": "4" }).expect(303);
  assert.equal(repos.profile.get().monthlyBudgetCents, 800000);
  const page = await request(app).get("/profile").expect(200);
  assert.match(page.text, /R\$\s50,00/);
  await request(app).post("/profile").type("form")
    .send({ name: "Ana", "monthly-budget": "8000", "hours-per-day": "8", "days-per-week": "5", "vacation-per-year": "52" }).expect(422);
});

test("POST de outra origem é recusado (CSRF)", async () => {
  const { app } = build();
  await request(app).post("/job").set("Origin", "https://site-malicioso.com").type("form").send({ name: "abc", "daily-hours": "1", "total-hours": "1" }).expect(403);
});

test("autenticação básica protege as páginas, mas não o /health", async () => {
  const { app } = build({ user: "douglas", password: "s3nha" });
  await request(app).get("/").expect(401);
  await request(app).get("/").auth("douglas", "s3nha").expect(200);
  await request(app).get("/health").expect(200);
});

test("migração converte o banco legado (valores em reais → centavos)", () => {
  const Database = require("better-sqlite3");
  const file = require("path").join(require("os").tmpdir(), `jobs-legado-${Date.now()}.sqlite`);
  const legacy = new Database(file);
  legacy.exec(`CREATE TABLE profile (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, avatar TEXT, monthly_budget INT, days_per_week INT, hours_per_day INT, vacation_per_year INT, value_hour INT);
    CREATE TABLE jobs (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, daily_hours INT, total_hours INT, created_at DATETIME);
    INSERT INTO profile VALUES (1,'Douglas','https://x/y.png',9200,5,5,4,92);
    INSERT INTO jobs VALUES (6,'Dev Frontend Jr. ',6,18,1653317551685);`);
  legacy.close();
  const repos = createRepositories(openDatabase(file));
  assert.equal(repos.profile.get().monthlyBudgetCents, 920000);
  assert.equal(repos.jobs.find(6).name, "Dev Frontend Jr.");
});
/* Fim de app.test.js */
