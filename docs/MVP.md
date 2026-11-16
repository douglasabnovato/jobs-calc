# MVP — jobs-calc

> Criado em 02/11/2026. Revisto em 16/11/2026 (ciclo de 16/11/2026; critério 9 revisto às 12h10, com os alertas do Dependabot ligados). **Nível: Estudo (N1).** Os critérios 5 e 7 não se aplicam ao N1 e saem da conta. Testado no Windows com Node 24.22.1 e no CI com Node 22 e Node 24 no `ubuntu-latest`. Não houve teste com pessoas nem em aparelho real.

**Resumo:** 9 de 10 aplicáveis atendidos
**Finalizado:** sim

O critério que falta depende do responsável e tem issue com o rótulo `depende-do-responsavel`: 9 (#11, o banco com a renda mensal no histórico do Git). Os alertas do Dependabot foram ligados em 16/11/2026 e não seguram mais o critério.

**Correção de honestidade (16/11/2026).** A tabela de 07/11 dizia "axe nos modos claro e escuro". O CSS não tem `prefers-color-scheme` nem outro tema escuro: o projeto "escuro" do Playwright repetia a tela clara. O app não tem tema escuro próprio; o projeto saiu e a contagem de testes de interface caiu de 16 para 8, sem perder cobertura.

## Critérios (16/11/2026)

| # | Critério | Como verificar | Situação | Evidência e data |
|---|---|---|---|---|
| 1 | Problema e público claros | Dá para explicar em uma frase | Atende: freelancers calculam o valor de um job a partir do próprio perfil. | README, 16/11/2026 |
| 2 | Hipótese a validar | Existe uma aposta escrita, com meta | Atende: seção "Hipótese", com meta e "saberemos quando"; sem validação com pessoas. | Este arquivo, 16/11/2026 |
| 3 | Fluxo principal completo | Uma pessoa conclui sem ajuda | Atende: no Chromium (Playwright 1.65), o teste salva o perfil (R$ 5.200, 5 h, 5 dias, 4 semanas) e vê "R$ 52,00" e "100 horas"; cria um job de 2 h/dia e 10 h e vê "5 dias para a entrega" e "R$ 520,00"; exclui o job só com teclado (Enter, Tab, Enter) e vê "Job excluído."; Esc fecha a confirmação e devolve o foco. Os formulários são enviados pelo navegador, com `Origin`. | `npm run test:e2e`: 8 de 8 no job `interface` do [run 43805159349](https://github.com/douglasabnovato/jobs-calc/actions/runs/43805159349) (PR #24, commit `d99d8d3`; os commits seguintes só mudam docs), 16/11/2026 |
| 4 | Escopo enxuto | O que não entra está registrado | Atende: seção "Fora do MVP". | 16/11/2026 |
| 5 | Medição de uso | A métrica principal é coletada | Não se aplica (N1). | Decisão 2 do processo |
| 6 | Falhas tratadas | Erro, vazio e carregamento têm resposta clara | Atende: 404, 422 com erro por campo, 500, POST de outra origem e POST sem `Origin` nem `Referer` (403) com teste; percentual fora de 10 a 100 dá erro no campo; painel vazio mostra "Nenhum job cadastrado"; no navegador, job vazio mostra "Revise os campos destacados". | `npm test`: 17 de 17 nos jobs `raiz` (Node 22) e `node24` do run 43805159349, 16/11/2026 |
| 7 | Desempenho aceitável | LCP de até 2,5 s no celular | Não se aplica (N1). | Decisão 2 do processo |
| 8 | Acessibilidade básica | axe e teclado | Atende: axe (todas as regras) sem violações em `/` com card, `/job`, `/profile`, 404 e na página com a confirmação de exclusão aberta e o fundo inerte (o axe trata o conteúdo `inert` como oculto), em largura de desktop; com a confirmação aberta, o fundo fica `inert` (#19); exclusão só com teclado e Esc devolve o foco. O app não tem tema escuro próprio: o axe roda só no tema claro, que é o único. | `tests/e2e/axe.spec.js` e `tests/e2e/fluxo.spec.js`, job `interface` do run 43805159349, 16/11/2026 |
| 9 | Segurança e conformidade | Riscos decididos | Parcial: o banco com a renda mensal saiu do Git em 02/11, mas segue no histórico; decidir é do responsável (#11). O resto atende: `gh api "repos/douglasabnovato/jobs-calc/dependabot/alerts?state=open&per_page=100"` com 0 alertas abertos (16/11/2026 11h57, alertas ligados pelo responsável nesse dia); `npm audit --omit=dev` com 0 vulnerabilidades depois do `npm ci` (16/11/2026 12h10); nenhum segredo no código. | #11; comandos e horas ao lado |
| 10 | Entrega confiável | CI verde antes de entrar na principal | Atende: ruleset `principal-protegida` ativo na `master`, com PR obrigatório, bloqueio de force push e exclusão e os checks `raiz` e `interface` obrigatórios; o workflow `CI` roda em PR e push para `master` e `developer/**`. | `gh api repos/douglasabnovato/jobs-calc/rulesets/26932542`, 16/11/2026: `required_status_checks` com `interface` e `raiz` |
| 11 | Testes dos fluxos críticos | Testes automatizados no CI | Atende: 17 testes de unidade (Node 22 e 24) e 8 de interface, sem testes pulados. | Run 43805159349: `# skipped 0` no `raiz`, `skipped 0` no `node24`, `8 passed` no `interface`, 16/11/2026 |
| 12 | Documentação honesta | O README ensina a rodar | Atende: comandos conferidos com o `package.json` (`dev`, `test`, `test:e2e`); sem link publicado, porque `https://jobs-calc.onrender.com` deu 404 em 16/11/2026; correção do tema escuro acima. | README, 16/11/2026 |

## Hipótese

Acreditamos que, partindo do próprio perfil, quem trabalha como freelancer calcula o valor de um job em menos de 1 minuto, entendendo de onde vem o valor da hora e a parte do tempo cobrada do cliente (#13). Saberemos quando o teste no navegador fizer o percurso perfil → job → painel sem ajuda, com o valor certo na tela, e o CI ficar verde. Meta de estudo (N1): praticar Node, Express e SQLite com testes no navegador.

## Fora do MVP

Faturamento, contas de clientes, impostos e despesas no cálculo, tema escuro.

## Neste ciclo (16/11/2026)

POST sem `Origin` e sem `Referer` passa a receber 403 (#21); fundo inerte com a confirmação de exclusão aberta (#19); `better-sqlite3` 12 e testes também no Node 24 (#15); o projeto "escuro" do Playwright saiu; `docs/DEPLOY.md` no fluxo atual. Detalhes em [PLANO-DE-ACAO.md](PLANO-DE-ACAO.md), seção "Ciclo de 16/11/2026".

## Histórico

- 16/11/2026, 12h10: critério 9 segue "Parcial" só pelo banco no histórico (#11). A parte dos alertas trocou: antes a API respondia 403 (alertas desligados); agora há 0 alertas abertos. Resumo sem mudança (9 de 10).

### 09/11/2026 (ciclo de 07/11/2026; critério 10 revisto em 10/11/2026)

Resumo da época: 9 de 10 aplicáveis atendidos, Finalizado: sim. A linha do critério 8 dizia "modos claro e escuro", o que não valia: o app não tem tema escuro (correção acima).

| # | Critério | Situação (07/11/2026) |
|---|---|---|
| 3 | Fluxo principal completo | Atende: Playwright no CI do PR #18 (run 42627537409), 16 de 16. |
| 6 | Falhas tratadas | Atende: 15 testes de unidade. |
| 8 | Acessibilidade básica | Atende: axe sem violações; diálogo com h2; animações com `prefers-reduced-motion`. |
| 9 | Segurança e conformidade | Parcial: #11. |
| 10 | Entrega confiável | Atende desde 10/11: ruleset na `master` (#10). |
| 11 | Testes dos fluxos críticos | Atende: 15 de unidade e 16 de interface. |

Os demais critérios estavam como na tabela atual. Correção de 09/11/2026: a tabela de 06/11 dizia que as telas funcionavam no navegador, mas todo POST pelo Chrome dava 403 por `Origin: null`; corrigido com `Referrer-Policy: same-origin` (commit `ecc9500`).

### 06/11/2026 (ciclo de 03/11/2026)

> Criado em 02/11/2026. Revisto em 06/11/2026 (ciclo de 03/11). **Nível: Estudo (N1).** Meta: N1. Testado no Windows com Node 24 (com `better-sqlite3` 12 instalado só no clone de teste, ver #15) e no CI com Node 22. Não houve teste com pessoas nem em aparelho real.

### Tabela de 06/11/2026: 7 de 10 aplicáveis atendidos

Régua N1: os critérios 5 e 7 são "Não se aplica (N1)" e saem do denominador. Antes deste ciclo, pela mesma régua: 5 de 10 (o critério 10 passava por "Atende" sem a principal protegida).

| # | Critério | Como verificar | Situação (06/11/2026) |
|---|---|---|---|
| 1 | Problema e público claros | Dá para explicar em uma frase | Atende: freelancers calculam o valor de um job a partir do próprio perfil. |
| 2 | Hipótese a validar | Existe uma aposta escrita, com meta | Atende: seção 2; ainda sem validação com pessoas. |
| 3 | Fluxo principal completo | Uma pessoa conclui sem ajuda | Parcial: telas no navegador com SQLite local; o cadastro só tem teste com `supertest`. Teste no navegador: #14. |
| 4 | Escopo enxuto | O que não entra está registrado | Atende: seção 3. |
| 5 | Medição de uso | A métrica principal é coletada | Não se aplica (N1). |
| 6 | Falhas tratadas | Erro, vazio e carregamento têm resposta clara | Atende: 404 (rota e job inexistentes), 422 com erro por campo e 500 (banco que falha) têm teste automático (`tests/app.test.js`, 13 testes). |
| 7 | Desempenho aceitável | LCP de até 2,5 s no celular | Não se aplica (N1). |
| 8 | Acessibilidade básica | axe e teclado | Atende: axe sem violações em 02/11; o foco agora tem duas cores (anel azul e halo branco) e aparece no cabeçalho escuro, conferido no navegador em 06/11. Sem rolagem em 375 px. |
| 9 | Segurança e conformidade | Riscos decididos | Parcial: `npm audit` sem alertas em 06/11 (antes, 4 moderados). O banco com a renda mensal saiu do Git em 02/11, mas segue no histórico; decidir é do responsável (#11). |
| 10 | Entrega confiável | CI verde antes de entrar na principal | Parcial: CI verde nos PRs, agora também para `developer/**`; a `master` segue sem proteção (#10). |
| 11 | Testes dos fluxos críticos | Testes automatizados no CI | Atende: 13 testes no CI. |
| 12 | Documentação honesta | O README ensina a rodar | Atende: comandos conferidos com o `package.json`; aviso de estudo; link publicado fora do README porque deu 404 (#12). |

Finalizado: não. Falta o critério 3 (#14), que o código resolve. Os critérios 9 (#11) e 10 (#10) dependem do responsável.

#### Hipótese (proposta)

Praticar Node e SQLite: calcular o valor de um job em menos de 1 minuto, entendendo de onde vem o valor da hora.

#### Fora do MVP

Faturamento, contas de clientes, impostos e despesas no cálculo.

#### Ciclo de 03/11/2026 (06/11/2026)

Horas de trabalho por mês no perfil, foco visível em duas cores, teste da página 500, CI nos PRs para `developer/**` e remoção do código legado. Detalhes em [PLANO-DE-ACAO.md](PLANO-DE-ACAO.md).
