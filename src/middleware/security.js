/* Middlewares de segurança: autenticação básica opcional e verificação de origem nos POST (anti-CSRF) */
const crypto = require("crypto");

/* Compara strings em tempo constante */
function safeEqual(a, b) {
  const x = Buffer.from(String(a));
  const y = Buffer.from(String(b));
  return x.length === y.length && crypto.timingSafeEqual(x, y);
}

/* Exige usuário/senha quando APP_USER e APP_PASSWORD estão definidos */
function basicAuth(user, password) {
  return (req, res, next) => {
    if (!user || !password || req.path === "/health") return next();
    const [scheme, encoded] = String(req.headers.authorization || "").split(" ");
    if (scheme === "Basic" && encoded) {
      const [u, ...rest] = Buffer.from(encoded, "base64").toString().split(":");
      if (safeEqual(u, user) && safeEqual(rest.join(":"), password)) return next();
    }
    res.set("WWW-Authenticate", 'Basic realm="JobsCalc", charset="UTF-8"');
    return res.status(401).send("Autenticação necessária.");
  };
}

/* Recusa POST cujo Origin/Referer aponte para outro host (OWASP CSRF: verificação de origem) */
function sameOrigin(req, res, next) {
  if (req.method !== "POST") return next();
  const source = req.headers.origin || req.headers.referer;
  if (!source) return next();
  try {
    if (new URL(source).host === req.headers.host) return next();
  } catch {
    /* origem malformada cai na recusa abaixo */
  }
  return res.status(403).send("Origem não permitida.");
}

module.exports = { basicAuth, sameOrigin };
/* Fim de security.js */
