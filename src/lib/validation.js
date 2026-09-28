/* Validação dos formulários de job e perfil; aceita vírgula decimal (pt-BR) */

/* Converte "1.234,56" ou "12.5" em número; devolve NaN se inválido */
function parseNumber(value) {
  const raw = String(value ?? "").trim();
  if (raw === "") return NaN;
  const normalized = raw.includes(",") ? raw.replace(/\./g, "").replace(",", ".") : raw;
  return /^-?\d+(\.\d+)?$/.test(normalized) ? Number(normalized) : NaN;
}

/* Valida o job; devolve { value, errors } */
function validateJob(body = {}) {
  const value = {
    name: String(body.name ?? "").trim(),
    dailyHours: parseNumber(body["daily-hours"]),
    totalHours: parseNumber(body["total-hours"]),
  };
  const errors = {};
  if (value.name.length < 2 || value.name.length > 80) errors.name = "Use de 2 a 80 caracteres.";
  if (!(value.dailyHours > 0 && value.dailyHours <= 24)) errors["daily-hours"] = "Informe entre 0,1 e 24 horas.";
  if (!(value.totalHours > 0 && value.totalHours <= 10000)) errors["total-hours"] = "Informe um total maior que zero.";
  return { value, errors };
}

/* Valida o perfil; o avatar é opcional, mas precisa ser https */
function validateProfile(body = {}) {
  const budget = parseNumber(body["monthly-budget"]);
  const value = {
    name: String(body.name ?? "").trim(),
    avatar: String(body.avatar ?? "").trim(),
    monthlyBudgetCents: Number.isFinite(budget) ? Math.round(budget * 100) : NaN,
    hoursPerDay: parseNumber(body["hours-per-day"]),
    daysPerWeek: parseNumber(body["days-per-week"]),
    vacationPerYear: parseNumber(body["vacation-per-year"]),
  };
  const errors = {};
  if (value.name.length < 2 || value.name.length > 60) errors.name = "Use de 2 a 60 caracteres.";
  if (value.avatar && !/^https:\/\/\S+$/.test(value.avatar)) errors.avatar = "Use um link https:// ou deixe em branco.";
  if (!(value.monthlyBudgetCents >= 0 && value.monthlyBudgetCents <= 100000000)) errors["monthly-budget"] = "Informe um valor em reais (ex.: 5000,00).";
  if (!(value.hoursPerDay > 0 && value.hoursPerDay <= 24)) errors["hours-per-day"] = "Informe entre 1 e 24 horas.";
  if (!(Number.isInteger(value.daysPerWeek) && value.daysPerWeek >= 1 && value.daysPerWeek <= 7)) errors["days-per-week"] = "Informe de 1 a 7 dias.";
  if (!(Number.isInteger(value.vacationPerYear) && value.vacationPerYear >= 0 && value.vacationPerYear <= 51)) errors["vacation-per-year"] = "Informe de 0 a 51 semanas.";
  return { value, errors };
}

module.exports = { parseNumber, validateJob, validateProfile };
/* Fim de validation.js */
