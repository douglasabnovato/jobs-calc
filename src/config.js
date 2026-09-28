/* Configuração lida do ambiente (12-Factor III) */
const path = require("path");

module.exports = {
  port: Number(process.env.PORT) || 3000,
  databaseFile: process.env.DATABASE_FILE || path.join(__dirname, "..", "data", "jobscalc.sqlite"),
  basicAuthUser: process.env.APP_USER || "",
  basicAuthPassword: process.env.APP_PASSWORD || "",
  trustProxy: process.env.TRUST_PROXY === "1",
};
/* Fim de config.js */
