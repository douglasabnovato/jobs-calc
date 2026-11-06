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
