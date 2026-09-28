# Deploy · JobsCalc

Plano de ação para publicar a calculadora de freelas em hospedagem gratuita.

## 1. Desafio

Colocar no ar, sem custo, uma aplicação Express + EJS + SQLite (better-sqlite3) que guarda o perfil financeiro e os jobs de **uma pessoa só**, sem deixar que qualquer visitante com o link veja ou altere esses dados, e deixando claro que o banco do plano gratuito é temporário.

## 2. Conteúdo

### Decisão de hospedagem

| Opção | Resultado |
|---|---|
| **Render, 1 web service gratuito (escolhida)** | Roda o servidor Express; blueprint `render.yaml` já no repositório; HTTPS automático (necessário para a senha do acesso básico); deploy automático a cada push |
| GitHub Pages | Não serve: só publica arquivos estáticos, e o projeto precisa de servidor Express e banco |
| Netlify/Vercel | Não executam um servidor Express contínuo com SQLite em disco |
| VPS ou disco persistente pago | Fora da regra do portfólio (só hospedagem gratuita) |

### O que foi ajustado para produção

| Mudança | Arquivo | Por quê |
|---|---|---|
| `NODE_VERSION` `22` | `render.yaml` | O Node 20 saiu de suporte em abr/2026 |
| `autoDeployTrigger: commit` | `render.yaml` | Cada push na `master` publica sozinho |
| `NODE_ENV=production` | `render.yaml` | Liga o cache de views do Express/EJS e o `npm ci` deixa de instalar dependências de teste |
| `DATABASE_FILE=/tmp/jobs-calc.sqlite` | `render.yaml` | Caminho gravável e explícito para o SQLite no Render |
| `APP_USER` e `APP_PASSWORD` com `sync: false` (já existiam) | `render.yaml` | São segredos: o Render pede os valores ao criar o serviço e eles não ficam no repositório |
| `TRUST_PROXY=1` (já existia) | `render.yaml` | O app fica atrás do proxy do Render |
| CI com Node 22 | `ci/github-actions-ci.yml` → mover para `.github/workflows/ci.yml` | Testes e `npm audit` a cada push, na mesma versão da produção |
| `dbjobscalc.sqlite` no `.gitignore` | `.gitignore` | Depois do `git rm --cached`, o `git add -A` não volta a versionar o banco |
| Seção "Em produção" | `Readme.md` | URL, hospedagem, senha obrigatória e aviso de dados temporários |

### Limitações do plano gratuito

- **Os dados somem a cada reinício ou deploy**: o disco do Render Free é temporário. Perfil e jobs voltam ao padrão (perfil inicial, nenhum job) sempre que o serviço reinicia, dorme e acorda em outra máquina, ou recebe um novo deploy. Use a versão publicada como demonstração; para uso real, rode localmente ou migre para PostgreSQL gratuito (Neon), o que é mudança de arquitetura (decisão pendente).
- O serviço dorme após 15 min sem acesso e leva cerca de 1 min para acordar.
- As 750 horas gratuitas por mês são da conta inteira do Render, somando todos os serviços.

### Pontos de atenção (segurança e LGPD)

- **`APP_USER` e `APP_PASSWORD` são obrigatórios em produção.** O código só pede senha quando os dois estão definidos; se ficarem vazios, qualquer pessoa com o link vê a sua renda mensal e cria, edita ou apaga jobs.
- A senha trafega no cabeçalho do acesso básico do navegador: só é segura sob HTTPS (o Render já entrega `https://`). Use uma senha longa e exclusiva (gerenciador de senhas), nunca a mesma de outros serviços.
- `/health` fica aberto sem senha (o Render precisa dele para o health check) e mostra apenas a quantidade de jobs.
- POSTs de outra origem são recusados (verificação de `Origin`/`Referer`).
- Renda mensal é dado financeiro pessoal: não versione `dbjobscalc.sqlite` (objetivo do `git rm --cached`).

## 3. Solução (passo a passo)

Branch principal: **`master`**.

### Etapa 0 · Definir os segredos

1. Escolher um usuário (ex.: `douglas`) e gerar uma senha forte com 20+ caracteres no gerenciador de senhas.
2. Guardar os dois: o Render vai pedi-los na Etapa 3 como `APP_USER` e `APP_PASSWORD`.

### Etapa 1 · Validar localmente (Git Bash)

1. `cd /c/ambiente-projeto/ser-mvp/jobs-calc`
2. Apagar o código antigo substituído pelas camadas novas (sai do Git e do disco):
   `git rm -r src/controllers src/model src/utils/jobUtils.js src/db/config.js src/db/init.js src/routes.js`
3. Opcional, recomendado: parar de versionar o banco antigo (o arquivo continua no seu disco):
   `git rm --cached dbjobscalc.sqlite`
4. `npm install`
5. `npm test` (esperado: 10 testes passando)
6. Opcional, para migrar seus dados antigos: `DATABASE_FILE=./dbjobscalc.sqlite npm start` uma vez, depois `Ctrl+C`.
7. Simular produção: `PORT=3000 NODE_ENV=production TRUST_PROXY=1 DATABASE_FILE=./data/producao-local.sqlite APP_USER=teste APP_PASSWORD=teste-local npm start` (no Render o banco fica em `/tmp`; aqui vai para `data/`, que o Git ignora).
   - `http://localhost:3000/health` responde `{"status":"ok","jobs":0}` sem pedir senha.
   - `http://localhost:3000/` pede usuário e senha (`teste` / `teste-local`) e depois mostra o painel.
   - `Ctrl+C` para sair.

### Etapa 2 · Subir para o GitHub

1. Ativar o CI (a pasta `.github` é protegida para a ferramenta que preparou o projeto, então o arquivo veio em `ci/`):
   `mkdir -p .github/workflows && mv ci/github-actions-ci.yml .github/workflows/ci.yml && rmdir ci`
2. `git status` (não podem aparecer `node_modules/`, `data/`, `.env` nem `dbjobscalc.sqlite` como arquivo novo)
3. `git add -A`
4. `git commit -m "feat(deploy): Node 22, SQLite em /tmp, senha obrigatória em produção, deploy automático no Render e CI"`
5. `git push origin master`
6. No GitHub, aba **Actions**: o CI precisa ficar verde.

### Etapa 3 · Criar o serviço no Render

1. Entrar em **render.com** com a conta do GitHub e autorizar o repositório `jobs-calc`.
2. **New → Blueprint** e escolher `douglasabnovato/jobs-calc` (branch `master`).
3. Conferir o serviço `jobs-calc`, plano **Free**. O blueprint já preenche `NODE_VERSION=22`, `NODE_ENV=production`, `TRUST_PROXY=1` e `DATABASE_FILE=/tmp/jobs-calc.sqlite`.
4. O Render pede **`APP_USER`** e **`APP_PASSWORD`**: colar os valores da Etapa 0. **Não deixe em branco.**
5. **Apply** e acompanhar **Logs** até aparecer `JobsCalc em http://localhost:10000` (3 a 6 min; o `better-sqlite3` compila na primeira vez).

### Etapa 4 · Conferir no ar

1. `https://jobs-calc.onrender.com/health` responde `{"status":"ok","jobs":0}`.
2. `https://jobs-calc.onrender.com/` **pede usuário e senha**. Se abrir o painel direto, as variáveis ficaram vazias: corrija em **Environment** e salve (o Render reinicia).
3. Com a senha: o painel carrega com logo e estilos; em **Perfil**, salvar a renda mensal mostra o novo valor da hora.
4. Criar um job de teste mostra orçamento e prazo calculados; excluir pede confirmação.
5. Números com vírgula (`2,5`) são aceitos; campo vazio mostra erro por campo.
6. Em **Manual Deploy → Restart service**, o job de teste desaparece (confirma o comportamento de disco temporário).

### Etapa 5 · Fechar

1. Se a URL real for diferente de `https://jobs-calc.onrender.com`, corrigir no `Readme.md`, commit e push (o Render publica sozinho).
2. No GitHub, **About → Website**: colar a URL.
