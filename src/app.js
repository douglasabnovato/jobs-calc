/* Aplicação Express do JobsCalc: painel, jobs e perfil com EJS */
const path = require("path");
const express = require("express");
const helmet = require("helmet");
const { buildDashboard, valueHourCents, budgetCents, formatBRL } = require("./domain/calculations");
const { validateJob, validateProfile } = require("./lib/validation");
const { basicAuth, sameOrigin } = require("./middleware/security");

/* Monta o app com repositórios e relógio injetados */
function createApp({ repos, now = () => Date.now(), auth = {}, trustProxy = false }) {
  const app = express();
  if (trustProxy) app.set("trust proxy", 1);
  app.disable("x-powered-by");
  app.set("view engine", "ejs");
  app.set("views", path.join(__dirname, "views"));
  app.locals.formatBRL = formatBRL;
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          "default-src": ["'self'"],
          "img-src": ["'self'", "https:", "data:"],
          "style-src": ["'self'", "https://fonts.googleapis.com"],
          "font-src": ["'self'", "https://fonts.gstatic.com"],
          "script-src": ["'self'"],
        },
      },
    })
  );
  app.get("/health", (req, res) => res.json({ status: "ok", jobs: repos.jobs.all().length }));
  app.use(basicAuth(auth.user, auth.password));
  app.use(express.static(path.join(__dirname, "..", "public"), { maxAge: "1h" }));
  app.use(express.urlencoded({ extended: false, limit: "10kb" }));
  app.use(sameOrigin);

  /* Lê o id numérico da rota ou devolve null */
  function jobId(req) {
    const id = Number(req.params.id);
    return Number.isInteger(id) && id > 0 ? id : null;
  }

  /* Renderiza 404 padronizado */
  function notFound(res, message = "Página não encontrada.") {
    return res.status(404).render("error", { status: 404, message });
  }

  app.get("/", (req, res) => {
    const profile = repos.profile.get();
    const dash = buildDashboard(repos.jobs.all(), profile, now());
    res.render("index", { ...dash, profile, flash: req.query.ok });
  });

  app.get("/job", (req, res) => res.render("job", { form: {}, errors: {} }));

  app.post("/job", (req, res) => {
    const { value, errors } = validateJob(req.body);
    if (Object.keys(errors).length) return res.status(422).render("job", { form: req.body, errors });
    repos.jobs.create({ ...value, createdAt: now() });
    return res.redirect(303, "/?ok=criado");
  });

  app.get("/job/:id", (req, res) => {
    const id = jobId(req);
    const job = id && repos.jobs.find(id);
    if (!job) return notFound(res, "Job não encontrado.");
    const hour = valueHourCents(repos.profile.get());
    return res.render("job-edit", { job, budget: budgetCents(job, hour), form: null, errors: {}, flash: req.query.ok });
  });

  app.post("/job/:id", (req, res) => {
    const id = jobId(req);
    const job = id && repos.jobs.find(id);
    if (!job) return notFound(res, "Job não encontrado.");
    const { value, errors } = validateJob(req.body);
    if (Object.keys(errors).length) {
      const hour = valueHourCents(repos.profile.get());
      return res.status(422).render("job-edit", { job, budget: budgetCents(job, hour), form: req.body, errors, flash: null });
    }
    repos.jobs.update(id, value);
    return res.redirect(303, `/job/${id}?ok=salvo`);
  });

  app.post("/job/delete/:id", (req, res) => {
    const id = jobId(req);
    if (!id || !repos.jobs.remove(id)) return notFound(res, "Job não encontrado.");
    return res.redirect(303, "/?ok=excluido");
  });

  app.get("/profile", (req, res) => {
    const profile = repos.profile.get();
    res.render("profile", { profile, hourCents: valueHourCents(profile), form: null, errors: {}, flash: req.query.ok });
  });

  app.post("/profile", (req, res) => {
    const { value, errors } = validateProfile(req.body);
    if (Object.keys(errors).length) {
      const profile = repos.profile.get();
      return res.status(422).render("profile", { profile, hourCents: valueHourCents(profile), form: req.body, errors, flash: null });
    }
    repos.profile.update(value);
    return res.redirect(303, "/profile?ok=salvo");
  });

  app.use((req, res) => notFound(res));

  app.use((err, req, res, next) => {
    console.error(err);
    if (res.headersSent) return next(err);
    return res.status(500).render("error", { status: 500, message: "Algo deu errado. Tente novamente." });
  });

  return app;
}

module.exports = { createApp };
/* Fim de app.js */
