/* Ponto de entrada do JobsCalc */
const config = require("./config");
const { openDatabase } = require("./db/connection");
const { createRepositories } = require("./repositories");
const { createApp } = require("./app");

/* Abre o banco e sobe o servidor HTTP */
function main() {
  const repos = createRepositories(openDatabase(config.databaseFile));
  const app = createApp({
    repos,
    auth: { user: config.basicAuthUser, password: config.basicAuthPassword },
    trustProxy: config.trustProxy,
  });
  app.listen(config.port, () => console.log(`JobsCalc em http://localhost:${config.port}`));
}

main();
/* Fim de server.js */
