/* axe nas telas do fluxo, com e sem a confirmação de exclusão aberta */
const { test, expect } = require("@playwright/test");
const AxeBuilder = require("@axe-core/playwright").default;

/* Sem rede externa (fontes, imagens de exemplo): o teste depende só do app local */
test.beforeEach(async ({ context }) => {
  await context.route(/^https?:\/\/(?!localhost[:/])/, (route) => route.abort());
});

/* Falha com a lista de violações de qualquer gravidade */
async function semViolacoes(page, escopo) {
  const builder = new AxeBuilder({ page });
  if (escopo) builder.include(escopo);
  const { violations } = await builder.analyze();
  expect(violations.map((v) => `${v.id} (${v.impact}): ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`)).toEqual([]);
}

for (const rota of ["/", "/job", "/profile", "/rota-que-nao-existe"]) {
  test(`axe sem violações em ${rota}`, async ({ page }, info) => {
    /* No painel, garante ao menos um card para o axe medir */
    const card = `Card do axe ${info.project.name}`;
    if (rota === "/") await page.request.post("/job", { form: { name: card, "daily-hours": "1", "total-hours": "2" } });
    await page.goto(rota);
    if (rota === "/") await expect(page.locator("li.card", { hasText: card })).toHaveCount(1);
    await semViolacoes(page);
  });
}


/* Com a confirmação aberta, o fundo fica sob o véu escuro; o axe olha o diálogo */
test("axe sem violações na confirmação de exclusão aberta", async ({ page }, info) => {
  const nome = `Job do axe ${info.project.name}`;
  await page.request.post("/job", { form: { name: nome, "daily-hours": "1", "total-hours": "2" } });
  await page.goto("/");
  await page.locator("li.card", { hasText: nome }).locator("button.delete").click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await semViolacoes(page, ".modal");
});
/* Fim de axe.spec.js */
