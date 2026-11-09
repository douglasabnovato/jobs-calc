/* Fluxo principal no navegador: perfil -> valor da hora -> job -> painel -> exclusão (#14) */
const { test, expect } = require("@playwright/test");

/* Sem rede externa (fontes, imagens de exemplo): o teste depende só do app local */
test.beforeEach(async ({ context }) => {
  await context.route(/^https?:\/\/(?!localhost[:/])/, (route) => route.abort());
});

test("perfil, job no painel e exclusão só com teclado", async ({ page }, info) => {
  const job = `Site da padaria ${info.project.name}`;

  /* Perfil: R$ 5.200 por mês, 5 h por dia, 5 dias, 4 semanas de férias = 100 h/mês = R$ 52,00 a hora */
  await page.goto("/profile");
  await page.getByLabel("Nome").fill("Pessoa de Teste");
  await page.getByLabel(/quero ganhar por mês/).fill("5200,00");
  await page.getByLabel(/quero trabalhar por dia/).fill("5");
  await page.getByLabel(/quero trabalhar por semana/).fill("5");
  await page.getByLabel(/semanas.*de férias/).fill("4");
  await page.getByRole("button", { name: "Salvar dados" }).click();
  await expect(page.getByRole("status")).toHaveText(/Perfil salvo/);
  await expect(page.locator("aside strong")).toHaveText(/R\$\s52,00/);
  await expect(page.locator(".hours-month")).toContainText("100 horas");

  /* Job: 2 h por dia, 10 h no total = 5 dias e R$ 520,00 */
  await page.goto("/");
  await page.getByRole("link", { name: "Adicionar novo job" }).click();
  await page.getByLabel("Nome do job").fill(job);
  await page.getByLabel(/horas.*por dia vai dedicar/).fill("2");
  await page.getByLabel(/Estimativa de.*horas/).fill("10");
  await page.getByRole("button", { name: "Salvar" }).click();
  await expect(page).toHaveURL(/\/\?ok=criado$/);
  await expect(page.getByRole("status")).toHaveText("Job criado.");
  const card = page.locator("li.card", { hasText: job });
  await expect(card.locator(".deadline p")).toHaveText("5 dias para a entrega");
  await expect(card.locator(".amount p")).toHaveText(/R\$\s520,00/);
  await expect(card.locator(".status")).toHaveText("Em andamento");

  /* Exclusão só com teclado: foco no botão, Enter abre, Tab vai a "Excluir job", Enter confirma */
  await card.getByRole("button", { name: `Excluir ${job}` }).focus();
  await page.keyboard.press("Enter");
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("button", { name: "Cancelar" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(dialog.getByRole("button", { name: "Excluir job" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/\?ok=excluido$/);
  await expect(page.getByRole("status")).toHaveText("Job excluído.");
  await expect(page.locator("li.card", { hasText: job })).toHaveCount(0);
});

test("job inválido mostra erro por campo e não cria nada", async ({ page }) => {
  await page.goto("/job");
  await page.getByRole("button", { name: "Salvar" }).click();
  await expect(page.getByRole("alert")).toHaveText(/Revise os campos/);
  await expect(page.getByLabel("Nome do job")).toHaveAttribute("aria-invalid", "true");
});

test("Esc fecha a confirmação e o foco volta ao botão de excluir", async ({ page }) => {
  await page.goto("/job");
  await page.getByLabel("Nome do job").fill("Job para cancelar");
  await page.getByLabel(/horas.*por dia vai dedicar/).fill("1");
  await page.getByLabel(/Estimativa de.*horas/).fill("3");
  await page.getByRole("button", { name: "Salvar" }).click();
  const excluir = page.getByRole("button", { name: "Excluir Job para cancelar" });
  await excluir.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();
  await expect(excluir).toBeFocused();
  await expect(page.locator("li.card", { hasText: "Job para cancelar" })).toHaveCount(1);
});
/* Fim de fluxo.spec.js */
