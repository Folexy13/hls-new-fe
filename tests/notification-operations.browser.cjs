const assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const path = require('node:path');
const os = require('node:os');
const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:7001';

async function auth(context, role = 'researcher') {
  await context.addInitScript(role => {
    localStorage.setItem('hls-storage', JSON.stringify({ version: 0, state: {
      isAuthenticated: true, user: { id: '1', name: 'Test User', email: 'test@example.com', role, isAuthenticated: true },
    } }));
    localStorage.setItem('accessToken', 'test-only'); localStorage.setItem('refreshToken', 'test-only');
    localStorage.setItem('tokenExpiry', new Date(Date.now() + 3600000).toISOString());
  }, role);
}

(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  try {
    for (const width of [1280, 393]) {
      const context = await browser.newContext({ viewport: { width, height: 900 } }); await auth(context);
      let orderStatus = 'paid', supportResolved = false, pharmacyAccepted = false;
      const statuses = [], replies = [], approvals = [];
      await context.route('**/api/v2/**', async route => {
        const request = route.request(), url = new URL(request.url()), method = request.method();
        let data = { items: [], notifications: [], supplements: [] };
        if (url.pathname.endsWith('/operations/access')) data = { allowed: true };
        if (url.pathname.endsWith('/operations/orders')) data = { items: orderStatus === 'delivered' ? [] : [{ id: 4, orderNumber: 'ORDER-12345-TEST', status: orderStatus, total: 5000 }], nextCursor: null };
        if (url.pathname.endsWith('/operations/orders/4/status') && method === 'PATCH') {
          orderStatus = request.postDataJSON().status; statuses.push(orderStatus);
        }
        if (url.pathname.endsWith('/operations/support')) data = { items: supportResolved ? [] : [{ id: 7, subject: '[Support] Delivery enquiry', message: 'Please check my order.', replies: [] }], nextCursor: null };
        if (url.pathname.endsWith('/operations/support/7/replies') && method === 'POST') {
          const body = request.postDataJSON(); assert.ok(body.requestId); assert.equal(body.message, 'We are reviewing your order.');
          replies.push(body); supportResolved = body.resolve;
        }
        if (url.pathname.endsWith('/operations/pharmacies')) data = { items: pharmacyAccepted ? [] : [{ id: 6, version: 2, pharmacyName: 'Test Pharmacy', pharmacyPhone: '2349000000001', user: { firstName: 'Test', lastName: 'Benfek' } }], nextCursor: null };
        if (url.pathname.endsWith('/operations/pharmacies/6/accept') && method === 'POST') {
          const body = request.postDataJSON(); assert.equal(body.version, 2); approvals.push(body); pharmacyAccepted = true;
        }
        if (url.pathname.endsWith('/operations/notifications')) data = { items: [{ id: 1, kind: 'order_processing', status: 'accepted', attemptCount: 1,
          providerMessageId: 'wamid.test', delivery: { status: 'failed', errorCode: '131026', errorMessage: 'Message undeliverable' } }], nextCursor: null };
        await route.fulfill({ json: { success: true, data } });
      });
      const page = await context.newPage(); await page.goto(`${base}/researcher`);
      await page.getByRole('button', { name: 'Operations', exact: true }).click();
      for (const label of ['Start processing', 'Dispatch order', 'Mark delivered']) await page.getByRole('button', { name: label, exact: true }).click();
      await page.getByText('No records', { exact: true }).waitFor();
      assert.deepEqual(statuses, ['processing', 'shipped', 'delivered']);
      await page.getByRole('tab', { name: 'Support', exact: true }).click();
      await page.getByRole('textbox', { name: 'Reply to ticket 7' }).fill('We are reviewing your order.');
      await page.getByRole('checkbox', { name: 'Resolve ticket' }).check();
      const screenshot = path.join(os.tmpdir(), `hls-notification-operations-${width}.png`);
      await page.screenshot({ path: screenshot, fullPage: true });
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      await page.getByRole('button', { name: 'Send reply' }).click();
      await page.getByText('No records', { exact: true }).waitFor(); assert.equal(replies.length, 1);
      await page.getByRole('tab', { name: 'Pharmacies', exact: true }).click();
      page.once('dialog', dialog => dialog.accept());
      await page.getByRole('button', { name: 'Accept pharmacy' }).click();
      await page.getByText('No records', { exact: true }).waitFor(); assert.equal(approvals.length, 1);
      await page.getByRole('tab', { name: 'Notifications', exact: true }).click();
      await page.getByText('#1 order processing', { exact: true }).waitFor();
      await page.getByText('WhatsApp: failed', { exact: true }).waitFor();
      await page.getByText('131026 Message undeliverable', { exact: true }).waitFor();
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      console.log(`PASS ${width}px Operations: order transitions, support reply, pharmacy approval, queue view. Screenshot: ${screenshot}`);
      await context.close();
    }
    const denied = await browser.newContext(); await auth(denied);
    await denied.route('**/api/v2/**', route => route.fulfill({ status: route.request().url().endsWith('/operations/access') ? 403 : 200,
      json: { success: false, message: 'Checker access required', data: { items: [], notifications: [], supplements: [] } } }));
    const maker = await denied.newPage(); await maker.goto(`${base}/researcher`);
    await maker.getByRole('button', { name: 'Logout', exact: true }).waitFor();
    assert.equal(await maker.getByRole('button', { name: 'Operations', exact: true }).count(), 0);
    await denied.close(); console.log('PASS Operations hidden when backend denies checker access');

    const context = await browser.newContext({ viewport: { width: 393, height: 900 } }); await auth(context, 'benfek');
    let consent = false;
    await context.route('**/api/v2/**', async route => {
      if (route.request().method() === 'PUT') consent = route.request().postDataJSON().notificationRemindersEnabled;
      await route.fulfill({ json: { success: true, data: { profile: {
        id: 2, firstName: 'Test', lastName: 'Benfek', email: 'test@example.com', role: 'benfek', phone: '2349000000000', notificationRemindersEnabled: consent,
      } } } });
    });
    const profile = await context.newPage(); await profile.goto(`${base}/benfek/my-profile`);
    await profile.getByRole('switch', { name: 'Receive WhatsApp reminders about my cart, assessment and incomplete profile' }).check();
    await profile.getByRole('button', { name: 'Save Personal Details', exact: true }).click();
    await profile.getByText('Personal details updated', { exact: true }).waitFor(); assert.equal(consent, true);
    await context.close(); console.log('PASS Benfek can opt in to notification reminders');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
