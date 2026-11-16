/* axe nas telas do fluxo, com e sem a confirmação de exclusão aberta */
const { test, expect } = require("@playwright/test");
const AxeBuilder = require("@axe-core/playwright").default;

/* Sem rede externa (fontes, imagens de exemplo): o teste depende só do app local */
test.beforeEach(async ({ context }) => {
  await context.route(/^https?:\/\/(?!localhost[:/])/, (route) => route.abort());
});

/* Cria um job pela rota, como o formulário do próprio site: o sameOrigin recusa POST sem Origin (#21) */
async function criarJob(page, baseURL, nome) {
  const res = await page.request.post("/job", { headers: { Origin: baseURL }, form: { name: nome, "daily-hours": "1", "total-hours": "2" }, maxRedirects: 0 });
  expect(res.status()).toBe(303);
}

/* Falha com a lista de violações de qualquer gravidade */
async function semViolacoes(page, escopo) {
  const builder = new AxeBuilder({ page });
  if (escopo) builder.include(escopo);
  const { violations } = await builder.analyze();
  expect(violations.map((v) => `${v.id} (${v.impact}): ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`)).toEqual([]);
}

for (const rota of ["/", "/job", "/profile", "/rota-que-nao-existe"]) {
  test(`axe sem violações em ${rota}`, async ({ page, baseURL }, info) => {
    /* No painel, garante ao menos um card para o axe medir */
    const card = `Card do axe ${info.project.name}`;
    if (rota === "/") await criarJob(page, baseURL, card);
    await page.goto(rota);
    if (rota === "/") await expect(page.locator("li.card", { hasText: card })).toHaveCount(1);
    await semViolacoes(page);
  });
}


/* Com a confirmação aberta, o fundo fica inerte (#19): o axe roda sem escopo e trata o fundo inerte como oculto */
test("axe sem violações na confirmação de exclusão aberta", async ({ page, baseURL }, info) => {
  const nome = `Job do axe ${info.project.name}`;
  await criarJob(page, baseURL, nome);
  await page.goto("/");
  await page.locator("li.card", { hasText: nome }).locator("button.delete").click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await semViolacoes(page);
});
/* Fim de axe.spec.js */
