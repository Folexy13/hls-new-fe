const assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const path = require('node:path');
const os = require('node:os');
const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:7001';
const invoice = { id: 'test-invoice', title: 'Order TEST-123', type: 'Invoice', customer: 'Test Customer', currency: 'NGN', total: 2500,
  createdAt: '2026-11-18T10:00:00Z', expiresAt: '2026-11-25T10:00:00Z', items: [{ name: 'Test supplement with a longer product name', quantity: 2, unitPrice: 1250 }] };

async function auth(context) {
  await context.addInitScript(() => {
    localStorage.setItem('hls-storage', JSON.stringify({ version: 0, state: { isAuthenticated: true,
      user: { id: '2', name: 'Test Customer', email: 'test@example.com', role: 'benfek', isAuthenticated: true } } }));
    localStorage.setItem('accessToken', 'test-only'); localStorage.setItem('refreshToken', 'test-only');
    localStorage.setItem('tokenExpiry', new Date(Date.now() + 3600000).toISOString());
  });
}

(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  try {
    for (const width of [1280, 393]) {
      for (const mode of ['pack', 'paid', 'failure']) {
        const paid = mode === 'paid';
        const context = await browser.newContext({ viewport: { width, height: 900 } }); await auth(context);
        const requests = [];
        await context.route('**/api/v2/**', async route => {
          const request = route.request(), url = new URL(request.url());
          let data = { items: [], supplements: [], notifications: [], profile: { preferredPharmacyName: 'Test Pharmacy', deliveryAddress: 'Test address' } };
          if (url.pathname.endsWith('/benfek/packs')) data = [{ packId: 'economic', items: [{ quantity: 2, supplement: { id: 3, name: 'Test supplement', price: 1250 } }],
            payment: { isPaid: paid, orderId: paid ? 4 : null } }];
          if (url.pathname.endsWith('/benfek/invoice') && request.method() === 'POST') {
            requests.push(request.postDataJSON());
            if (mode === 'failure' && requests.length === 1)
              return route.fulfill({ status: 500, json: { success: false, message: 'Invoice queue unavailable' } });
            data = { invoiceId: invoice.id, notification: { status: 'pending' } };
          }
          await route.fulfill({ json: { success: true, data } });
        });
        const page = await context.newPage(); await page.goto(`${base}/benfek/dashboard`);
        await page.getByRole('button', { name: 'My Nutrient Pack', exact: true }).click();
        await page.getByRole('button', { name: 'Open Economic pack', exact: true }).click();
        await page.getByRole('button', { name: 'View Invoice', exact: true }).click();
        await page.getByRole('button', { name: 'Share', exact: true }).click();
        await page.getByRole('button', { name: 'Send invoice', exact: true }).click();
        if (mode === 'failure') {
          await page.getByText('Invoice queue unavailable', { exact: true }).waitFor();
          await page.getByRole('button', { name: 'Share', exact: true }).click();
          await page.getByRole('button', { name: 'Send invoice', exact: true }).click();
        }
        await page.getByText('Invoice queued for WhatsApp', { exact: true }).waitFor();
        assert.deepEqual(requests, Array.from({ length: mode === 'failure' ? 2 : 1 }, () => paid ? { orderId: 4 } : { packId: 'economic' }));
        console.log(`PASS ${width}px ${mode} invoice button uses the correct source and handles retry`);
        await context.close();
      }
      const context = await browser.newContext({ viewport: { width, height: 900 }, acceptDownloads: true }); await auth(context);
      let expired = false;
      await context.route('**/api/v2/**', async route => {
        const url = new URL(route.request().url());
        if (url.pathname.includes('/benfek/invoices/')) {
          assert.equal(url.searchParams.get('token'), 'test-token');
          return route.fulfill({ status: expired ? 410 : 200, json: expired ? { success: false, message: 'Invoice link is invalid or has expired' } : { success: true, data: { invoice } } });
        }
        await route.fulfill({ json: { success: true, data: { items: [], notifications: [] } } });
      });
      const page = await context.newPage(); await page.goto(`${base}/invoices/test-invoice?token=test-token`);
      await page.getByRole('heading', { name: 'HLS Invoice', exact: true }).waitFor();
      const downloadEvent = page.waitForEvent('download'); await page.getByRole('button', { name: 'Download PDF', exact: true }).click();
      const download = await downloadEvent; assert.ok(download.suggestedFilename().endsWith('.pdf'));
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      await page.screenshot({ path: path.join(os.tmpdir(), `hls-invoice-${width}.png`), fullPage: true });
      expired = true; await page.reload(); await page.getByRole('alert').filter({ hasText: 'Invoice link is invalid or has expired' }).waitFor();
      console.log(`PASS ${width}px protected invoice renders, downloads PDF and handles expired links`);
      await context.close();
    }
    const context = await browser.newContext();
    await context.route('**/api/v2/**', route => route.fulfill({ json: { success: true, data: {} } }));
    const page = await context.newPage(); await page.goto(`${base}/invoices/test-invoice?token=test-token`);
    await page.waitForURL('**/auth/signin');
    assert.equal(await page.getByRole('heading', { name: 'HLS Invoice', exact: true }).count(), 0);
    await context.close(); console.log('PASS unauthenticated invoice links require sign-in');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
