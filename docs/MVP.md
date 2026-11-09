# MVP — jobs-calc

> Criado em 02/11/2026. Revisto em 09/11/2026 (ciclo de 07/11/2026). **Nível: Estudo (N1).** Os critérios 5 e 7 não se aplicam ao N1 e saem da conta. Testado no Windows com Node 24.22.1 (`better-sqlite3` 12 sem gravar no lock) e no CI com Node 22 no `ubuntu-latest`. Não houve teste com pessoas nem em aparelho real.

**Resumo:** 8 de 10 aplicáveis atendidos
**Finalizado:** sim

Os dois critérios que faltam dependem do responsável e têm issue com o rótulo `depende-do-responsavel`: 9 (#11) e 10 (#10).

**Correção de honestidade (09/11/2026).** A tabela de 06/11 dizia que as telas funcionavam no navegador. Não funcionavam: todo formulário (perfil, job, exclusão) recebia 403 "Origem não permitida.", porque o `helmet` manda `Referrer-Policy: no-referrer` e, com isso, o Chrome envia `Origin: null`, que o `sameOrigin` recusava. Os testes com `supertest` não mandam `Origin` e não pegavam. O teste de interface achou; corrigido com `Referrer-Policy: same-origin` (commit `ecc9500`).

## Critérios (07/11/2026)

| # | Critério | Como verificar | Situação | Evidência e data |
|---|---|---|---|---|
| 1 | Problema e público claros | Dá para explicar em uma frase | Atende: freelancers calculam o valor de um job a partir do próprio perfil. | README, 06/11/2026 |
| 2 | Hipótese a validar | Existe uma aposta escrita, com meta | Atende: seção "Hipótese"; sem validação com pessoas. | 06/11/2026 |
| 3 | Fluxo principal completo | Uma pessoa conclui sem ajuda | Atende: no navegador (Chromium, Playwright 1.65), o teste salva o perfil (R$ 5.200, 5 h, 5 dias, 4 semanas) e vê "R$ 52,00" e "100 horas"; cria um job de 2 h/dia e 10 h e vê "5 dias para a entrega" e "R$ 520,00"; exclui o job só com teclado (Enter, Tab, Enter) e vê "Job excluído."; Esc fecha a confirmação e devolve o foco. Modos claro e escuro. | `npm run test:e2e`: 16 de 16 no CI do PR #18 (run 42627537409), 09/11/2026 |
| 4 | Escopo enxuto | O que não entra está registrado | Atende: seção "Fora do MVP". | 06/11/2026 |
| 5 | Medição de uso | A métrica principal é coletada | Não se aplica (N1). | Decisão 2 do processo |
| 6 | Falhas tratadas | Erro, vazio e carregamento têm resposta clara | Atende: 404, 422 com erro por campo, 500 e POST de outra origem (403) com teste; percentual fora de 10 a 100 dá erro no campo; no navegador, job vazio mostra "Revise os campos destacados". | `npm test` 15 de 15 e `test:e2e`, 09/11/2026 |
| 7 | Desempenho aceitável | LCP de até 2,5 s no celular | Não se aplica (N1). | Decisão 2 do processo |
| 8 | Acessibilidade básica | axe e teclado | Atende: axe (todas as regras) sem violações em `/` com card, `/job`, `/profile`, 404 e no diálogo de exclusão, nos modos claro e escuro; corrigidos neste ciclo o título do diálogo (h3 → h2, `heading-order`) e as animações, que agora respeitam `prefers-reduced-motion`; exclusão só com teclado. O fundo do diálogo ainda não fica inerte (#19). | `tests/e2e/axe.spec.js`, CI do PR #18, 09/11/2026 |
| 9 | Segurança e conformidade | Riscos decididos | Parcial: `npm audit` sem alertas; o banco com a renda mensal saiu do Git em 02/11, mas segue no histórico; decidir é do responsável. | #11 |
| 10 | Entrega confiável | CI verde antes de entrar na principal | Parcial: CI (unidade e interface) em PR e push para `master` e `developer/**`; a `master` segue sem proteção. | #10 |
| 11 | Testes dos fluxos críticos | Testes automatizados no CI | Atende: 15 testes de unidade e 16 de interface (8 por modo de cor). | CI do PR #18, 09/11/2026 |
| 12 | Documentação honesta | O README ensina a rodar | Atende: comandos conferidos com o `package.json`, inclusive `npm run test:e2e`; correção do que a tabela de 06/11 dizia sobre o navegador. | README, 09/11/2026 |

## Hipótese (proposta)

Praticar Node e SQLite: calcular o valor de um job em menos de 1 minuto, entendendo de onde vem o valor da hora, agora com a parte do tempo que é cobrada do cliente (#13).

## Fora do MVP

Faturamento, contas de clientes, impostos e despesas no cálculo.

## Neste ciclo (07/11/2026)

Formulários voltam a salvar no navegador; percentual de horas cobradas no perfil (#13); testes de interface com Playwright e axe no CI (#14); título do diálogo e animações acessíveis. Detalhes em [PLANO-DE-ACAO.md](PLANO-DE-ACAO.md), seção "Ciclo de 07/11/2026".

## Histórico

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
