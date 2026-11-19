/* Tela de edição do job (/job/:id) no navegador: salvar, excluir só com teclado e axe (#27) */
const { test, expect } = require("@playwright/test");
const AxeBuilder = require("@axe-core/playwright").default;

/* Sem rede externa (fontes, imagens de exemplo): o teste depende só do app local */
test.beforeEach(async ({ context }) => {
  await context.route(/^https?:\/\/(?!localhost[:/])/, (route) => route.abort());
});

/* Perfil conhecido: R$ 5.200 por mês, 5 h por dia, 5 dias, 4 semanas de férias, 100% cobrado = R$ 52,00 a hora */
async function salvarPerfil(page, baseURL) {
  const form = { name: "Pessoa de Teste", avatar: "", "monthly-budget": "5200,00", "hours-per-day": "5", "days-per-week": "5", "vacation-per-year": "4", "billable-percent": "100" };
  const res = await page.request.post("/profile", { headers: { Origin: baseURL }, form, maxRedirects: 0 });
  expect(res.status()).toBe(303);
}

/* Cria um job pela rota, como o formulário do próprio site (o sameOrigin exige Origin, #21) */
async function criarJob(page, baseURL, nome, totalHoras = "10") {
  const res = await page.request.post("/job", { headers: { Origin: baseURL }, form: { name: nome, "daily-hours": "2", "total-hours": totalHoras }, maxRedirects: 0 });
  expect(res.status()).toBe(303);
}

/* Abre a edição pelo botão "Editar" do card no painel */
async function abrirEdicao(page, nome) {
  await page.goto("/");
  await page.getByRole("link", { name: `Editar ${nome}`, exact: true }).click();
  await expect(page).toHaveURL(/\/job\/\d+$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Editar job");
}

/* Aperta Tab até o elemento receber o foco, sem .focus() */
async function tabAte(page, alvo, maximo = 20) {
  for (let i = 0; i < maximo; i += 1) {
    await page.keyboard.press("Tab");
    if (await alvo.evaluate((el) => el === document.activeElement)) return;
  }
  throw new Error(`O foco não chegou ao elemento em ${maximo} Tabs`);
}

/* Falha com a lista de violações de qualquer gravidade */
async function semViolacoes(page) {
  const { violations } = await new AxeBuilder({ page }).analyze();
  expect(violations.map((v) => `${v.id} (${v.impact}): ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`)).toEqual([]);
}

test("edição salva as horas e mostra o novo valor no aside", async ({ page, baseURL }, info) => {
  const nome = `Job para editar ${info.project.name}`;
  await salvarPerfil(page, baseURL);
  await criarJob(page, baseURL, nome, "10");
  await abrirEdicao(page, nome);
  await expect(page.locator("aside strong")).toHaveText(/R\$\s520,00/);

  /* 10 h -> 20 h a R$ 52,00 a hora = R$ 1.040,00 */
  const total = page.getByLabel(/Estimativa de.*horas/);
  await total.click();
  await page.keyboard.press("Control+A");
  await page.keyboard.type("20");
  await page.getByRole("button", { name: "Salvar", exact: true }).click();
  await expect(page).toHaveURL(/\/job\/\d+\?ok=salvo$/);
  await expect(page.locator("p.flash")).toHaveText("Alterações salvas.");
  await expect(total).toHaveValue("20");
  await expect(page.locator("aside strong")).toHaveText(/R\$\s1\.040,00/);
});

test("exclusão pela tela de edição só com teclado, com o fundo inerte", async ({ page, baseURL }, info) => {
  const nome = `Job para excluir na edição ${info.project.name}`;
  await criarJob(page, baseURL, nome);
  await abrirEdicao(page, nome);

  /* Tab até o botão de excluir do aside; Enter abre a confirmação com o foco em "Cancelar" */
  const excluir = page.locator("aside").getByRole("button", { name: "Excluir job" });
  await tabAte(page, excluir);
  await page.keyboard.press("Enter");
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("button", { name: "Cancelar" })).toBeFocused();

  /* Fundo inerte com a confirmação aberta (#19), também nesta tela */
  await expect(page.locator("body > header")).toHaveJSProperty("inert", true);
  await expect(page.locator("body > .container")).toHaveJSProperty("inert", true);
  await expect(page.locator(".modal-wrapper")).toHaveJSProperty("inert", false);

  /* Esc fecha, o fundo volta e o foco retorna ao botão de excluir */
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(page.locator("body > header")).toHaveJSProperty("inert", false);
  await expect(page.locator("body > .container")).toHaveJSProperty("inert", false);
  await expect(excluir).toBeFocused();

  /* Enter abre de novo, Tab vai a "Excluir job" e Enter confirma */
  await page.keyboard.press("Enter");
  await expect(dialog.getByRole("button", { name: "Cancelar" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(dialog.getByRole("button", { name: "Excluir job" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/\?ok=excluido$/);
  await expect(page.locator("p.flash")).toHaveText("Job excluído.");
  await expect(page.locator("li.card", { hasText: nome })).toHaveCount(0);
});

test("axe sem violações em /job/:id, com e sem a confirmação aberta", async ({ page, baseURL }, info) => {
  const nome = `Job do axe na edição ${info.project.name}`;
  await criarJob(page, baseURL, nome);
  await abrirEdicao(page, nome);
  await semViolacoes(page);

  await page.locator("aside").getByRole("button", { name: "Excluir job" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await semViolacoes(page);
});
/* Fim de edicao.spec.js */
