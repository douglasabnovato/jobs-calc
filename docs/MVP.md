# MVP — jobs-calc

> Criado em 02/11/2026. Revisto em 06/11/2026 (ciclo de 03/11). **Nível: Estudo (N1).** Meta: N1. Testado no Windows com Node 24 (com `better-sqlite3` 12 instalado só no clone de teste, ver #15) e no CI com Node 22. Não houve teste com pessoas nem em aparelho real.

## 1. Critérios: 7 de 10 aplicáveis atendidos

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

**Finalizado: não.** Falta o critério 3 (#14), que o código resolve. Os critérios 9 (#11) e 10 (#10) dependem do responsável.

## 2. Hipótese (proposta)

Praticar Node e SQLite: calcular o valor de um job em menos de 1 minuto, entendendo de onde vem o valor da hora.

## 3. Fora do MVP

Faturamento, contas de clientes, impostos e despesas no cálculo.

## 4. Neste ciclo (06/11/2026)

Horas de trabalho por mês no perfil, foco visível em duas cores, teste da página 500, CI nos PRs para `developer/**` e remoção do código legado. Detalhes em [PLANO-DE-ACAO.md](PLANO-DE-ACAO.md).
