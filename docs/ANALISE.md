# Análise — JobsCalc

## 1. Especificação

Calculadora para quem trabalha como freelancer: a partir da renda mensal desejada, dias e horas de trabalho e semanas de férias, calcula o **valor da hora**; cada job recebe orçamento (horas × valor da hora) e prazo (horas totais ÷ horas por dia).

| Ator | Objetivo |
|---|---|
| Freelancer | Precificar um projeto e acompanhar prazos e horas livres |

### Requisitos funcionais

| ID | Requisito | Critério de aceite | Antes |
|---|---|---|---|
| RF01 | Calcular valor da hora | Dado R$ 5.000, 6 h/dia, 5 dias, 4 semanas de férias, então R$ 41,67/h | ✅ (em reais com ponto flutuante) |
| RF02 | Cadastrar job | Dado nome e horas válidos, vejo o job com orçamento e prazo | ⚠️ SQL injetável; quebra no Linux |
| RF03 | Editar/excluir job | Confirmação acessível antes de excluir | ⚠️ |
| RF04 | Painel | Contagem em andamento/encerrados e horas livres no dia | ✅ |
| RF05 | Validar entradas | Horas 0 ou férias ≥ 52 semanas são recusadas com mensagem | ❌ divisão por zero |

## 2. Defeitos encontrados

| # | Severidade | Defeito | Referência |
|---|---|---|---|
| D1 | Crítica | SQL por interpolação de strings em todos os comandos | OWASP A05:2025 (Injection) |
| D2 | Crítica | `require('../utils/JobUtils')` vs arquivo `jobUtils.js`: aplicação não sobe em Linux | — |
| D3 | Alta | Sem validação: horas/dia 0 gera `Infinity`; férias 52 semanas gera hora negativa | OWASP A10:2025 |
| D4 | Média | `value="<%= job.name %> "` adiciona espaço a cada edição; `""` solto no HTML | — |
| D5 | Média | Contraste abaixo de 4,5:1; modal sem `role="dialog"` e sem foco | WCAG 1.4.3, 2.4.3 |
| D6 | Média | Qualquer pessoa com o link altera o perfil e os jobs se publicado | OWASP A01:2025 |
| D7 | Baixa | Conexão aberta e fechada a cada consulta; `Profile.update` sem `await` | — |

## Rubrica v2 (grupo fullstack)

Aprovação: média ponderada ≥ 7,0 **e** C1 e C4 (eliminatórios) ≥ 5. Regras: nota sem evidência vale no máximo 6; C1 limitado a 7 para parte não executada de ponta a ponta; C9 ≥ 8 só com URL publicada e CI verde.

| # | Critério | Referência | Peso | Antes | Depois | Evidência | Justificativa |
|---|---|---|---|---|---|---|---|
| C1 | Núcleo de valor | MVP (Ries); SWEBOK Requirements | 16% | 5 | 8 | Testes de rotas + Playwright nas 4 telas | `require('../utils/JobUtils')` aponta para `jobUtils.js`: quebra no Linux; nome ganha espaço a cada edição |
| C2 | Estados e condições excepcionais | Nielsen; OWASP A10:2025 | 8% | 3 | 8 | Testes 422/404; páginas de erro | "Job not found!" em texto puro; sem mensagens de validação |
| C3 | Acessibilidade | WCAG 2.2 AA (axe-core) | 7% | 4 | 8 | axe-core: 0 violações em /, /job, /job/1, /profile e no modal | Contraste de rótulos 3,9:1 e 2,3:1; modal sem papel de diálogo; avatar sem `alt` |
| C4 | Segurança e privacidade | OWASP Top 10:2025 / ASVS 5.0 N1 | 14% | 1 | 8 | Teste de injeção SQL; teste CSRF (Origin); Basic Auth testada | SQL montado com interpolação em todos os INSERT/UPDATE/DELETE (injeção) |
| C5 | Dados | 3FN / ACID / fonte única | 10% | 4 | 8 | Teste de migração do banco legado (reais → centavos) | Horas decimais em coluna INT; dinheiro em ponto flutuante |
| C6 | Testes | Pirâmide de testes; SWEBOK Testing | 9% | 0 | 8 | 10 testes `node --test` + supertest | Nenhum teste |
| C7 | Qualidade de código | SOLID / camadas; SWEBOK Construction | 7% | 5 | 8 | Domínio puro testado com relógio fixo | MVC existia, mas abre/fecha o banco a cada consulta |
| C8 | Desempenho | Complexidade; Core Web Vitals | 5% | 5 | 7 | Conexão única; consulta por id | Abre conexão por chamada; `show` carrega todos os jobs |
| C9 | Operação | 12-Factor; DORA | 7% | 3 | 7 | `/health`, `render.yaml`; CI em `ci/` (não executado) | Sem script `start`; porta fixa |
| C10 | Documentação | README como contrato | 5% | 5 | 8 | README + docs/ | README de aula |
| C11 | Produto e evidência | Cagan (4 riscos); Torres | 7% | 5 | 6 | Proposta clara (preço da hora do freela); `/health` com total de jobs | Problema real do freelancer, sem métrica |
| C12 | Sustentabilidade técnica | OWASP A03:2025; SWEBOK Maintenance | 5% | 3 | 8 | `npm audit`: 0 vulnerabilidades | `sqlite3` nativo + wrapper `sqlite`; nodemon |

**Média ponderada:** antes **3,42** (REPROVADO) → depois **7,74** (APROVADO).

