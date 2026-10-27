// Requer Playwright externo: PLAYWRIGHT_MODULE=/caminho/playwright/index.mjs
// Servidor local já compilado: PRINT_BASE_URL=http://127.0.0.1:5189
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ? pathToFileURL(process.env.PLAYWRIGHT_MODULE).href : 'playwright');
const output = process.env.PRINT_OUTPUT || 'output/a3/impressao';
await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/usr/bin/google-chrome', headless: true });
const results = [];
try {
  for (const width of [1366, 390]) {
    for (const scenario of ['consolidada', 'individual', 'multipagina']) {
      const page = await browser.newPage({ viewport: { width, height: 844 } });
      const items = Array.from({ length: scenario === 'multipagina' ? 80 : 3 }, (_, i) => ({
        matricula: `QA-${String(i + 1).padStart(3, '0')}`, nome: `Pessoa fictícia ${i + 1} SobrenomeExtensoParaConferirQuebraDeLinha`,
        tipo: ['Padrão', 'Comissionado', 'Produção'][i % 3],
        salarioBase: 2000, adicional: i % 3 === 0 ? 0 : 4200, salarioFinal: i % 3 === 0 ? 2000 : 6200,
      }));
      await page.route('**/api/folha-pagamento**', async route => route.fulfill({ json:
        new URL(route.request().url()).pathname.endsWith('/QA-001') ? items[0] : {
          itens: items, resumo: { quantidadeColaboradores: items.length,
            totalFolha: items.reduce((s, i) => s + i.salarioFinal, 0),
            totaisPorCategoria: ['Padrão', 'Comissionado', 'Produção'].map(tipo => ({ tipo,
              quantidadeColaboradores: items.filter(i => i.tipo === tipo).length,
              total: items.filter(i => i.tipo === tipo).reduce((s, i) => s + i.salarioFinal, 0) })) }
        } }));
      await page.goto(`${process.env.PRINT_BASE_URL || 'http://127.0.0.1:5189'}/folha${scenario === 'individual' ? '/QA-001' : ''}`);
      await page.getByText(items[0].nome, { exact: true }).waitFor();
      await page.emulateMedia({ media: 'print' });
      await page.pdf({ path: `${output}/${scenario}-${width}.pdf`, format: 'A4', preferCSSPageSize: true, printBackground: true });
      // Conferência geométrica na largura útil de A4 (210 - 24 mm).
      await page.setViewportSize({ width: 703, height: 1000 });
      const layout = await page.evaluate(() => {
        const table = document.querySelector('table');
        const wrapper = document.querySelector('.table-wrapper');
        return { scroll: document.documentElement.scrollWidth, width: window.innerWidth,
          tableLayout: table && getComputedStyle(table).tableLayout,
          overflow: wrapper && getComputedStyle(wrapper).overflowX,
          cells: [...document.querySelectorAll('td:not(.no-print)')].every(el => el.scrollWidth <= el.clientWidth + 1) };
      });
      assert.ok(layout.scroll <= layout.width, JSON.stringify(layout));
      assert.ok(layout.cells, 'Conteúdo excede célula');
      if (scenario !== 'individual') { assert.equal(layout.tableLayout, 'fixed'); assert.equal(layout.overflow, 'visible'); }
      results.push({ scenario, viewport: width, status: 'Passou', layout });
      await page.close();
    }
  }
  await fs.writeFile(`${output}/resultado.json`, JSON.stringify({ date: new Date().toISOString(), browser: await browser.version(), scope: 'CSS de impressão A4; API simulada, dados fictícios; não é aceite humano', results }, null, 2));
  console.log('6 cenários de impressão aprovados; PDFs em ' + output);
} finally { await browser.close(); }
