/* axe nas telas do fluxo, com e sem a confirmação de exclusão aberta */
const { test, expect } = require("@playwright/test");
const AxeBuilder = require("@axe-core/playwright").default;

/* Sem rede externa (fontes, imagens de exemplo): o teste depende só do app local */
test.beforeEach(async ({ context }) => {
  await context.route(/^https?:\/\/(?!localhost[:/])/, (route) => route.abort());
});

/* Falha com a lista de violações de qualquer gravidade */
async function semViolacoes(page) {
  const { violations } = await new AxeBuilder({ page }).analyze();
  expect(violations.map((v) => `${v.id} (${v.impact}): ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`)).toEqual([]);
}

for (const rota of ["/", "/job", "/profile", "/rota-que-nao-existe"]) {
  test(`axe sem violações em ${rota}`, async ({ page }) => {
    await page.goto(rota);
    await semViolacoes(page);
  });
}


test("axe sem violações com a confirmação de exclusão aberta", async ({ page }) => {
  await page.request.post("/job", { form: { name: "Job do axe", "daily-hours": "1", "total-hours": "2" } });
  await page.goto("/");
  await page.locator("li.card", { hasText: "Job do axe" }).locator("button.delete").click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await semViolacoes(page);
});
/* Fim de axe.spec.js */
