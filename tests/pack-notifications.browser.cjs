const assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const path = require('node:path');
const os = require('node:os');
const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:7001';

(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  try {
    for (const width of [1280, 393]) {
      for (const mode of ['single', 'bulk', 'failed']) {
        const context = await browser.newContext({ viewport: { width, height: 900 } });
        await context.addInitScript(() => {
          localStorage.setItem('hls-storage', JSON.stringify({ version: 0, state: {
            isAuthenticated: true, user: { id: '1', name: 'Test Researcher', email: 'test@example.com', role: 'researcher', isAuthenticated: true },
          } }));
          localStorage.setItem('accessToken', 'test-only'); localStorage.setItem('refreshToken', 'test-only');
          localStorage.setItem('tokenExpiry', new Date(Date.now() + 3600000).toISOString());
          sessionStorage.setItem('researcherVerifiedBenfekCode', 'TESTCODE');
          const item = { id: 4, name: 'Test supplement', price: 5000, qty: 2, forceDispatchWithoutWholesaler: true };
          localStorage.setItem('researcher.pack.supplements.TESTCODE', JSON.stringify({ economic: [item], doctors_choice: [item] }));
        });
        const requests = [];
        await context.route('**/api/v2/**', async route => {
          const request = route.request(), url = new URL(request.url());
          let data = { items: [], supplements: [], notifications: [], benfek: { quiz: { preferences: { budget: 100000 } } } };
          if (url.pathname.endsWith('/packs/dispatch')) {
            const body = request.postDataJSON(); requests.push(body);
            assert.equal(body.status, 'dispatched'); assert.equal(body.code, 'TESTCODE');
            assert.equal(body.items[0].id, 4); assert.equal(body.items[0].quantity, 2);
            data = { pack: { id: requests.length }, whatsappDelivery: { status: mode === 'failed' ? 'failed' : 'queued', jobId: requests.length } };
          }
          await route.fulfill({ json: { success: true, data } });
        });
        const page = await context.newPage(); await page.goto(`${base}/researcher`);
        await page.getByRole('tab', { name: 'Select Supplements', exact: true }).click();
        if (mode === 'bulk') {
          await page.getByRole('button', { name: 'Dispatch All Packs', exact: true }).click();
          await page.getByText('2 packs dispatched successfully. 2 WhatsApp notifications queued or submitted.', { exact: true }).first().waitFor();
          assert.equal(requests.length, 2);
        } else {
          await page.getByRole('button', { name: /Economy pack/ }).click();
          await page.getByRole('button', { name: 'Dispatch', exact: true }).click();
          await page.getByText(mode === 'failed' ? /WhatsApp notification needs review in Operations/ : /WhatsApp notification queued\./).first().waitFor();
          assert.equal(requests.length, 1);
        }
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
        const screenshot = path.join(os.tmpdir(), `hls-pack-notification-${width}-${mode}.png`);
        await page.screenshot({ path: screenshot, fullPage: true });
        console.log(`PASS ${width}px ${mode} pack dispatch: correct payload and WhatsApp feedback. Screenshot: ${screenshot}`);
        await context.close();
      }
    }
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
