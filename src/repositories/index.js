/* Repositórios de perfil e jobs com consultas preparadas (sem concatenação de SQL) */

/* Converte a linha do banco para o objeto de domínio do perfil */
function toProfile(row) {
  return {
    name: row.name,
    avatar: row.avatar,
    monthlyBudgetCents: row.monthly_budget_cents,
    daysPerWeek: row.days_per_week,
    hoursPerDay: row.hours_per_day,
    vacationPerYear: row.vacation_per_year,
  };
}

/* Converte a linha do banco para o objeto de domínio do job */
function toJob(row) {
  return { id: row.id, name: row.name, dailyHours: row.daily_hours, totalHours: row.total_hours, createdAt: row.created_at };
}

/* Cria os repositórios sobre uma conexão better-sqlite3 */
function createRepositories(db) {
  const st = {
    profile: db.prepare("SELECT * FROM profile WHERE id = 1"),
    updateProfile: db.prepare(
      `UPDATE profile SET name = @name, avatar = @avatar, monthly_budget_cents = @monthlyBudgetCents,
       days_per_week = @daysPerWeek, hours_per_day = @hoursPerDay, vacation_per_year = @vacationPerYear WHERE id = 1`
    ),
    jobs: db.prepare("SELECT * FROM jobs ORDER BY created_at DESC, id DESC"),
    job: db.prepare("SELECT * FROM jobs WHERE id = ?"),
    insertJob: db.prepare("INSERT INTO jobs (name, daily_hours, total_hours, created_at) VALUES (@name, @dailyHours, @totalHours, @createdAt)"),
    updateJob: db.prepare("UPDATE jobs SET name = @name, daily_hours = @dailyHours, total_hours = @totalHours WHERE id = @id"),
    deleteJob: db.prepare("DELETE FROM jobs WHERE id = ?"),
  };
  return {
    profile: {
      get: () => toProfile(st.profile.get()),
      update: (p) => st.updateProfile.run(p),
    },
    jobs: {
      all: () => st.jobs.all().map(toJob),
      find: (id) => {
        const row = st.job.get(id);
        return row ? toJob(row) : null;
      },
      create: (job) => Number(st.insertJob.run(job).lastInsertRowid),
      update: (id, job) => st.updateJob.run({ ...job, id }).changes === 1,
      remove: (id) => st.deleteJob.run(id).changes === 1,
    },
  };
}

module.exports = { createRepositories };
/* Fim de repositories/index.js */
