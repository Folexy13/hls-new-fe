const assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const path = require('node:path');
const os = require('node:os');
const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:7001';
const supportPath = role => role === 'benfek' ? '/support' : `/${role}/support`;

async function auth(context, role) {
  await context.addInitScript(role => {
    localStorage.setItem('hls-storage', JSON.stringify({ version: 0, state: {
      isAuthenticated: true, user: { id: role === 'researcher' ? '1' : '2', name: 'Test User', email: 'test@example.com', role, isAuthenticated: true },
    } }));
    localStorage.setItem('accessToken', 'test-only'); localStorage.setItem('refreshToken', 'test-only');
    localStorage.setItem('tokenExpiry', new Date(Date.now() + 3600000).toISOString());
  }, role);
}

async function mock(context, role, state) {
  await context.route('**/api/v2/**', async route => {
    const request = route.request(), url = new URL(request.url());
    let data = { items: [], notifications: [], supplements: [], count: 0 };
    if (url.pathname.endsWith('/support')) {
      if (request.method() === 'POST') {
        state.posts++;
        if (state.submitError) return route.fulfill({ status: 500, json: { success: false, message: 'Please retry this request.' } });
        state.ticket = { id: 7, ...request.postDataJSON(), status: 'open', replies: [], createdAt: new Date().toISOString() };
        data = { ticket: state.ticket };
      } else {
        if (state.historyError) return route.fulfill({ status: 500, json: { success: false, message: 'Unable to load requests.' } });
        data = { tickets: state.ticket ? [state.ticket] : [] };
      }
    }
    if (url.pathname.endsWith('/operations/access')) data = { allowed: true };
    if (url.pathname.endsWith('/operations/orders')) data = { items: [], nextCursor: null };
    if (url.pathname.endsWith('/operations/support')) data = { items: [{ ...state.ticket, subject: `[Support] ${state.ticket.subject}`,
      user: { firstName: 'Test', lastName: 'User', email: 'test@example.com', role } }], nextCursor: null };
    if (url.pathname.endsWith('/operations/support/7/replies')) {
      const reply = request.postDataJSON(); assert.ok(reply.requestId); state.replies++;
      state.ticket.replies.push({ id: 1, message: reply.message, createdAt: new Date().toISOString() });
      state.ticket.status = reply.resolve ? 'resolved' : 'open';
    }
    if (url.pathname.endsWith('/principals/me')) data = { id: 2, firstName: 'Test', lastName: 'Principal', email: 'test@example.com' };
    if (url.pathname.endsWith('/auth/login')) data = { user: { id: 2, firstName: 'Test', lastName: 'User', email: 'test@example.com', role },
      tokens: { accessToken: 'test-only', refreshToken: 'test-only' } };
    await route.fulfill({ json: { success: true, data } });
  });
}

async function fill(page) {
  await page.getByLabel('Category', { exact: true }).fill('Delivery');
  await page.getByLabel('Subject', { exact: true }).fill('Delivery enquiry');
  await page.getByLabel('Message', { exact: true }).fill('Please check my order.');
  await page.getByRole('button', { name: 'Submit Complaint', exact: true }).click();
}

(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  try {
    for (const width of [1280, 393]) for (const role of ['benfek', 'principal', 'wholesaler']) {
      const state = { ticket: null, posts: 0, replies: 0 };
      const context = await browser.newContext({ viewport: { width, height: 900 } }); await auth(context, role); await mock(context, role, state);
      const page = await context.newPage();
      await page.goto(`${base}${supportPath(role)}`);
      await page.getByRole('heading', { name: 'Support', exact: true }).waitFor();
      if (width === 393) {
        await page.getByRole('button', { name: 'Open menu', exact: true }).click();
        await page.getByRole('link', { name: 'Support', exact: true }).first().click();
      } else {
        assert.ok(await page.locator(`a[href="${supportPath(role)}"]`).count());
      }
      await page.getByRole('tab', { name: 'History', exact: true }).click();
      await page.getByText('No support requests yet.', { exact: true }).waitFor();
      await page.getByRole('tab', { name: 'Complaints', exact: true }).click();
      await fill(page);
      await page.getByRole('heading', { name: 'Delivery enquiry', exact: true }).waitFor();
      assert.equal(new URL(page.url()).searchParams.get('tab'), 'history'); assert.equal(state.posts, 1);
      const checkerContext = await browser.newContext(); await auth(checkerContext, 'researcher'); await mock(checkerContext, role, state);
      const checker = await checkerContext.newPage(); await checker.goto(`${base}/researcher`);
      await checker.getByRole('button', { name: 'Operations', exact: true }).click();
      await checker.getByRole('tab', { name: 'Support', exact: true }).click();
      await checker.getByText(`Test User (${role}) - test@example.com`, { exact: true }).waitFor();
      await checker.getByRole('textbox', { name: 'Reply to ticket 7' }).fill('Your delivery is being reviewed.');
      await checker.getByRole('checkbox', { name: 'Resolve ticket' }).check();
      await checker.getByRole('button', { name: 'Send reply', exact: true }).click();
      await checker.waitForTimeout(300); assert.equal(state.replies, 1);
      await page.getByRole('button', { name: 'Refresh', exact: true }).click();
      await page.getByText('Your delivery is being reviewed.', { exact: true }).waitFor();
      await page.getByText('resolved', { exact: true }).waitFor();
      const dashboard = role === 'benfek' ? '/benfek/dashboard' : `/${role}`;
      const back = page.getByRole('link', { name: 'Dashboard', exact: true }).filter({ has: page.locator('svg') });
      assert.equal(await back.last().getAttribute('href'), dashboard);
      if (role === 'principal') await page.locator('footer').getByRole('link', { name: 'Settings', exact: true }).waitFor();
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      const screenshot = path.join(os.tmpdir(), `hls-support-${role}-${width}.png`);
      await page.screenshot({ path: screenshot, fullPage: true });
      await checkerContext.close(); await context.close();
      console.log(`PASS ${role} ${width}px: submit, checker reply, resolved history, role dashboard link. Screenshot: ${screenshot}`);
    }

    const state = { posts: 0, replies: 0 }, context = await browser.newContext();
    await auth(context, 'principal'); await mock(context, 'principal', state);
    const profile = await context.newPage(); await profile.goto(`${base}/principal/my-profile?tab=settings&section=complaints`);
    await fill(profile);
    await profile.waitForURL('**/principal/support?tab=history');
    await profile.getByRole('heading', { name: 'Delivery enquiry', exact: true }).waitFor();
    assert.equal(state.posts, 1); await context.close(); console.log('PASS principal profile complaint form is connected');

    for (const role of ['principal', 'wholesaler']) {
      const context = await browser.newContext(); const state = { ticket: { id: 7, subject: 'Delivery enquiry', category: 'Delivery', message: 'Test', replies: [], status: 'open', createdAt: new Date().toISOString() } };
      await mock(context, role, state); const page = await context.newPage();
      await page.goto(`${base}${supportPath(role)}?tab=history`);
      await page.waitForURL('**/auth/signin');
      await page.getByLabel('Email', { exact: true }).fill('test@example.com');
      await page.getByLabel('Password', { exact: true }).fill('test-password');
      await page.getByRole('button', { name: 'Sign In', exact: true }).click();
      await page.waitForURL(`**${supportPath(role)}?tab=history`);
      await page.getByRole('heading', { name: 'Delivery enquiry', exact: true }).waitFor();
      await context.close(); console.log(`PASS ${role} notification link preserves History after sign-in`);
    }

    const failed = await browser.newContext(); await auth(failed, 'wholesaler');
    const errors = { posts: 0, submitError: true, historyError: true }; await mock(failed, 'wholesaler', errors);
    const page = await failed.newPage(); await page.goto(`${base}/wholesaler/support`);
    await fill(page); await page.getByText('Please retry this request.', { exact: true }).first().waitFor();
    assert.equal(await page.getByLabel('Message', { exact: true }).inputValue(), 'Please check my order.');
    errors.submitError = false; errors.historyError = false;
    await page.getByRole('button', { name: 'Submit Complaint', exact: true }).click();
    await page.getByRole('heading', { name: 'Delivery enquiry', exact: true }).waitFor();
    errors.historyError = true;
    await page.getByRole('button', { name: 'Refresh', exact: true }).click();
    await page.getByRole('alert').filter({ hasText: 'Unable to load requests.' }).waitFor();
    errors.historyError = false;
    await page.getByRole('button', { name: 'Refresh', exact: true }).click();
    await page.getByRole('heading', { name: 'Delivery enquiry', exact: true }).waitFor();
    await failed.close(); console.log('PASS failed support submission retains input and can be retried');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
