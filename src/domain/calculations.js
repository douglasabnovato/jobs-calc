/* Regras de negócio puras da calculadora de freelas (sem banco, sem HTTP) */
const WEEKS_PER_YEAR = 52;
const DAY_MS = 24 * 60 * 60 * 1000;

/* Valor da hora em centavos: renda mensal ÷ horas trabalhadas no mês */
function valueHourCents(profile) {
  const weeksPerMonth = (WEEKS_PER_YEAR - profile.vacationPerYear) / 12;
  const monthlyHours = profile.hoursPerDay * profile.daysPerWeek * weeksPerMonth;
  if (monthlyHours <= 0) return 0;
  return Math.round(profile.monthlyBudgetCents / monthlyHours);
}

/* Dias restantes até a entrega; usa o relógio injetado para ser testável */
function remainingDays(job, now) {
  const daysNeeded = Math.ceil(job.totalHours / job.dailyHours);
  const due = job.createdAt + daysNeeded * DAY_MS;
  return Math.ceil((due - now) / DAY_MS);
}

/* Orçamento do job em centavos */
function budgetCents(job, hourCents) {
  return Math.round(job.totalHours * hourCents);
}

/* Monta o painel: status de cada job, contagens e horas livres no dia */
function buildDashboard(jobs, profile, now) {
  const hourCents = valueHourCents(profile);
  const count = { total: jobs.length, progress: 0, done: 0 };
  let busyHours = 0;
  const items = jobs.map((job) => {
    const remaining = remainingDays(job, now);
    const status = remaining > 0 ? "progress" : "done";
    count[status] += 1;
    if (status === "progress") busyHours += job.dailyHours;
    return { ...job, remaining, status, budgetCents: budgetCents(job, hourCents) };
  });
  const freeHours = Math.round((profile.hoursPerDay - busyHours) * 10) / 10;
  return { jobs: items, count, freeHours, hourCents };
}

/* Formata centavos como moeda brasileira */
function formatBRL(cents) {
  return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

module.exports = { valueHourCents, remainingDays, budgetCents, buildDashboard, formatBRL, WEEKS_PER_YEAR };
/* Fim de calculations.js */
