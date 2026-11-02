# MVP — jobs-calc

> Criado em 02/11/2026. Meta: N1 (estudo). Testado no Windows, com Node 24, na cópia de `master`. Não houve teste com pessoas nem em aparelho real.

## 1. Critérios: 6 de 12 atendidos

| # | Critério | Como verificar | Situação |
|---|---|---|---|
| 1 | Problema e público claros | Dá para explicar em uma frase | Atende: Freelancers calculam o valor de um job a partir do próprio perfil. |
| 2 | Hipótese a validar | Existe uma aposta escrita, com meta | Atende: Proposta na seção 2; ainda sem validação com pessoas. |
| 3 | Fluxo principal completo | Uma pessoa conclui sem ajuda | Parcial: Telas no navegador com SQLite local; o cadastro só foi coberto pelos testes automáticos. |
| 4 | Escopo enxuto | O que não entra está registrado | Atende: Seção 3. |
| 5 | Medição de uso | A métrica principal é coletada | Não atende: Projeto de estudo sem coleta de uso. |
| 6 | Falhas tratadas | Erro, vazio e carregamento têm resposta clara | Parcial: `error.ejs` existe; não exercitada no navegador. |
| 7 | Desempenho aceitável | LCP de até 2,5 s no celular | Não medido: Sem publicação verificada neste ciclo. |
| 8 | Acessibilidade básica | axe e teclado | Parcial: axe sem violações. Rolagem corrigida em 375 px (antes, até 44 px). Foco visível não detectado em parte das tabulações: 2 de 4, 4 de 6 e 5 de 6. |
| 9 | Segurança e conformidade | Riscos decididos | Parcial: Restam 4 alertas moderados. O banco com a renda mensal saiu do Git em 02/11/2026, mas segue no histórico. |
| 10 | Entrega confiável | CI verde antes de entrar na principal | Atende: CI verde no PR deste ciclo; a principal segue sem proteção. |
| 11 | Testes dos fluxos críticos | Testes automatizados no CI | Atende: Testes automatizados rodam no CI. |
| 12 | Documentação honesta | O README ensina a rodar | Atende: Comandos conferidos com o `package.json`; aviso de estudo no README. |

## 2. Hipótese (proposta)

Praticar Node e SQLite: calcular o valor de um job em menos de 1 minuto.

## 3. Fora do MVP

Faturamento e contas de clientes.

## 4. Neste ciclo

Corrige a rolagem horizontal no celular e atualiza dependências.
