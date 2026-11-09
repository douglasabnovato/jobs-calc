# Plano de ação — JobsCalc

Timebox: 45 min (ciclo completo).

| MoSCoW | Item | Ganho | Esforço | Status |
|---|---|---|---|---|
| Must | Consultas preparadas (D1) | Alto | Baixo | ✅ |
| Must | Corrigir import com maiúscula (D2) | Alto | Baixo | ✅ |
| Must | Validação com mensagens por campo (D3) | Alto | Médio | ✅ |
| Must | Proteção opcional por senha + anti-CSRF (D6) | Alto | Baixo | ✅ |
| Should | Dinheiro em centavos; domínio puro testado | Médio | Médio | ✅ |
| Should | Acessibilidade e contraste (D5) | Médio | Médio | ✅ axe 0 |
| Could | Exportar orçamento em PDF | Médio | Médio | Próximo ciclo |

## Ciclo de 03/11/2026

> Executado em 06/11/2026. Branch `feature/2026-11-06` → `developer/sprint-2026-11-12` → `master`. Nível: Estudo (N1), 10 critérios aplicáveis.

### Produto

**Problema e público.** Freelancers de desenvolvimento e design cobram "no chute". O JobsCalc calcula o valor da hora a partir da renda desejada e da rotina, e orça cada job.

**Hipótese e meta.** Uma pessoa calcula o valor de um job em menos de 1 minuto e entende a base do cálculo. Sem medição de uso (N1).

**O que a pesquisa trouxe.**

| Ideia | O que levamos para o projeto | Fonte |
|---|---|---|
| A hora certa vem das horas faturáveis, não das totais | O perfil passa a mostrar as horas de trabalho por mês usadas no cálculo. O percentual faturável virou a #13 | [Harvest: freelance rate calculator](https://www.getharvest.com/calculators/freelance-rate-calculator), [Everhour: hourly rate calculator](https://everhour.com/calculators/hourly-rate-calculator-for-freelancers) |
| Tempo não faturável costuma ficar entre 20% e 40% | Padrão de 100% na #13, para não mudar perfis existentes, com faixa aceita de 10% a 100% | [DEV: a fórmula que freelancers erram](https://dev.to/prodyardcom/i-built-a-freelance-rate-calculator-heres-the-formula-most-freelancers-get-wrong-32jf), [Memtime: billable hours](https://www.memtime.com/billable-hours-calculator) |
| Foco em duas cores funciona em fundo claro e escuro | Anel azul com halo branco no `:focus-visible`; o cabeçalho escuro deixou de esconder o foco | [W3C: técnica C40](https://www.w3.org/WAI/WCAG21/Techniques/css/C40) |

**Backlog priorizado (impacto × esforço).**

| Prioridade | Item | Impacto | Esforço | Destino |
|---|---|---|---|---|
| 1 | Remover rotas, controllers, models e `ci/` legados | Médio | Baixo | Este ciclo |
| 2 | CI também nos PRs para `developer/**` | Alto | Baixo | Este ciclo |
| 3 | Foco visível em duas cores | Médio | Baixo | Este ciclo |
| 4 | Horas por mês no perfil | Médio | Baixo | Este ciclo |
| 5 | Teste da página 500 | Médio | Baixo | Este ciclo |
| 6 | Percentual faturável | Alto | Médio | Issue #13 |
| 7 | Teste do cadastro no navegador | Alto | Médio | Issue #14 |
| 8 | `better-sqlite3` 12 | Médio | Baixo | Issue #15 |
| 9 | Proteger a `master` | Alto | Baixo | Responsável (#10) |
| 10 | Histórico com o banco | Médio | Baixo | Responsável (#11) |
| 11 | Publicação no Render | Baixo | Baixo | Responsável (#12) |

**Fora do escopo.** Impostos, despesas, faturamento, contas de clientes.

### Engenharia

**Arquitetura.** Express 4 com EJS no servidor. `src/app.js` recebe repositórios e relógio por injeção; as regras puras ficam em `src/domain/calculations.js` (agora com `monthlyHours`); `src/repositories` usa `better-sqlite3`; `src/middleware/security.js` faz autenticação básica opcional e bloqueio de POST de outra origem. O código antigo (`routes.js`, `controllers`, `model`, `db/config.js` com `sqlite3`) não era carregado por ninguém e saiu.

**Riscos.**
- `better-sqlite3` 11 não instala no Node 24 do Windows (#15).
- Banco antigo com renda mensal no histórico (#11).
- SQLite do Render em `/tmp`: os dados somem a cada deploy.
- Sem proteção na `master` (#10).

**Qualidade.**
- Testes: 13 com `node:test` e `supertest` (cálculos, números pt-BR, rotas, 404, 422, 500, autenticação, horas por mês, foco no CSS).
- Acessibilidade: foco em duas cores; erros por campo; confirmação de exclusão acessível.
- Segurança: helmet com CSP, autenticação básica em produção, mesmo-origem nos POST; `npm audit` sem alertas.

**Definição de pronto.** `npm ci` e `npm test` passam; CI verde no PR; `docs/MVP.md` e README atualizados.

### Plano de ação

**Este ciclo executa.** Itens 1 a 5 do backlog e a revisão do `MVP.md` pela régua N1 e pela decisão do critério 10.

**Vira issue.** #13, #14, #15 (agente); #10, #11, #12 (responsável).

## Ciclo de 07/11/2026

> Executado em 09/11/2026. Branch `feature/2026-11-07` → `developer/sprint-2026-11-12` → `master` (o PR para a `master` fica com o responsável, #20). Nível: Estudo (N1), 10 critérios aplicáveis.

### Produto

**Problema e público.** Os mesmos: freelancers que cobram "no chute" calculam o valor da hora e o orçamento de cada job.

**Hipótese e meta.** Calcular o valor de um job em menos de 1 minuto, entendendo a base do cálculo. Meta do ciclo: fluxo provado no navegador (#14) e valor da hora mais realista (#13).

**O que a pesquisa trouxe.**

| Ideia | O que levamos para o projeto | Fonte |
|---|---|---|
| O valor da hora sai da renda desejada dividida pelas horas que dá para cobrar, não pelas horas totais | Campo "Quanto do tempo é cobrado do cliente? (%)", padrão 100% para não mudar perfis existentes (#13) | [Upwork: como definir o preço do freela](https://www.upwork.com/resources/how-to-set-your-freelance-rate), [Harvest: calculadora de preço](https://www.getharvest.com/calculators/freelance-rate-calculator) |
| A parte cobrada costuma ficar entre 50% e 80%; quem está começando, abaixo disso | Texto de ajuda no perfil com a faixa | [Beancount: hora efetiva](https://beancount.io/blog/2026/10/09/effective-hourly-rate-overhead-taxes-profit-billable-hour-guide), [Plutio: preço de freela](https://plutio.com/freelancer-magazine/how-to-price-freelance-work) |
| O `webServer` do Playwright sobe o app e espera uma URL antes dos testes | `playwright.config.js` sobe `node src/server.js` com banco novo e espera `/health` | [Playwright: webServer](https://playwright.dev/docs/test-webserver) |

**Backlog priorizado (impacto × esforço).**

| Prioridade | Item | Impacto | Esforço | Destino |
|---|---|---|---|---|
| 1 | Formulários com 403 no navegador | Alto | Baixo | Este ciclo |
| 2 | Fluxo e axe no navegador, no CI | Alto | Médio | Este ciclo (#14) |
| 3 | Percentual de horas cobradas | Médio | Baixo | Este ciclo (#13) |
| 4 | Título do diálogo e animações acessíveis | Médio | Baixo | Este ciclo |
| 5 | Fundo inerte com o diálogo aberto | Médio | Baixo | #19 |
| 6 | `better-sqlite3` 12 | Médio | Baixo | #15 |
| 7 | Proteger a `master`, histórico do banco, publicação, merge do ciclo | Alto | Baixo | Responsável (#10, #11, #12, #20) |

**Fora do escopo.** Faturamento, impostos e despesas no cálculo.

### Engenharia

**Arquitetura.** Migration 3 adiciona `profile.billable_percent` (10 a 100, padrão 100). `billableHours` em `src/domain/calculations.js` entra no valor da hora. `helmet` com `referrerPolicy: same-origin`. Testes de interface em `tests/e2e/` (Playwright 1.65), fora do `node --test`; projetos "claro" e "escuro", `reducedMotion: reduce`, rede externa bloqueada no teste.

**Riscos.**
- O `sameOrigin` aceita POST sem `Origin` nem `Referer` (como antes); navegadores atuais mandam `Origin` com a política nova.
- Os dois projetos de cor dividem o banco do teste; os nomes levam o nome do projeto para não repetir.

**Qualidade.** 15 testes de unidade e 16 de interface no CI; axe com todas as regras.

**Definição de pronto.** `npm test` e `npm run test:e2e` verdes no CI; `docs/MVP.md` e README atualizados.

### Plano de ação

**Este ciclo executa.**
1. `Referrer-Policy: same-origin`, com teste de POST do próprio site e de `Origin: null`.
2. Percentual de horas cobradas no perfil (#13), com migration e testes.
3. Playwright com perfil, job, painel, exclusão por teclado e Esc (#14); axe em 4 rotas e no diálogo.
4. Diálogo com h2; animações com `prefers-reduced-motion`.
5. `docs/MVP.md` com uma tabela só, histórico e a correção de honestidade; README.

**Vira issue.** #19 (fundo inerte), #21 (POST sem `Origin` nem `Referer`) e #20 (responsável: mesclar o ciclo). Seguem abertas #15 (agente) e #10, #11, #12 (responsável).
