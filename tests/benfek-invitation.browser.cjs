const assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');

async function main() {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  try {
    for (const viewport of [{ width: 1280, height: 900 }, { width: 393, height: 852 }]) {
      for (const [emailStatus, whatsappStatus] of [['sent', 'accepted'], ['sent', 'failed'], ['pending', 'accepted'], ['failed', 'not_configured']]) {
        const context = await browser.newContext({ viewport });
        await context.addInitScript(() => {
          localStorage.setItem('hls-storage', JSON.stringify({ version: 0, state: {
            isAuthenticated: true,
            user: { id: '1', name: 'Test Principal', email: 'principal@example.com', role: 'principal', isAuthenticated: true },
          } }));
          localStorage.setItem('accessToken', 'test-only');
          localStorage.setItem('refreshToken', 'test-only');
          localStorage.setItem('tokenExpiry', new Date(Date.now() + 3600000).toISOString());
        });
        let requests = 0;
        // All API calls are intercepted; this test cannot create real referrals.
        await context.route('**/api/v2/**', async route => {
          if (route.request().url().endsWith('/quiz-code/create')) {
            requests++;
            assert.equal(route.request().postDataJSON().benfekName, 'Test Benfek');
            await route.fulfill({ json: { success: true, data: {
              code: 'HLS12345',
              emailDelivery: { status: emailStatus, sent: emailStatus === 'sent' },
              whatsappDelivery: { status: whatsappStatus, accepted: whatsappStatus === 'accepted' },
            } } });
          } else {
            await route.fulfill({ json: { success: true, data: {} } });
          }
        });
        const page = await context.newPage();
        await page.goto(`${process.env.TEST_BASE_URL || 'http://127.0.0.1:7001'}/principal/add-benfek`);
        await page.getByLabel('First Name', { exact: true }).fill('Test');
        await page.getByLabel('Last Name', { exact: true }).fill('Benfek');
        await page.getByLabel('Email Address', { exact: true }).fill('benfek@example.com');
        await page.getByLabel('Phone Number', { exact: true }).fill('09067814722');
        await page.getByLabel('Age', { exact: true }).fill('30');
        await page.getByRole('combobox').click();
        await page.getByRole('option', { name: 'Female', exact: true }).click();
        await page.getByLabel('Weight (kg)', { exact: true }).fill('60');
        await page.getByLabel('Height (cm)', { exact: true }).fill('165');
        await page.getByRole('button', { name: 'Next', exact: true }).click();
        await page.getByRole('checkbox').check();
        await page.getByRole('button', { name: 'Add Benfek', exact: true }).click();
        const dialog = page.getByRole('dialog');
        await dialog.waitFor();
        const text = await dialog.innerText();
        assert.ok(text.includes('Referral created'));
        assert.ok(text.includes(emailStatus === 'sent' ? 'Email invitation sent.' : emailStatus === 'pending' ? 'pending and will be retried' : 'Email invitation was not sent.'));
        assert.ok(text.includes(whatsappStatus === 'accepted' ? 'delivery is not yet confirmed' : whatsappStatus === 'failed' ? 'WhatsApp invitation failed' : 'WhatsApp is not configured'));
        assert.equal(requests, 1);
        assert.ok(await dialog.evaluate(el => el.scrollWidth <= el.clientWidth));
        console.log(`PASS ${viewport.width}px: email=${emailStatus}, WhatsApp=${whatsappStatus}`);
        await context.close();
      }
    }
    const page = await browser.newPage();
    await page.goto(`${process.env.TEST_BASE_URL || 'http://127.0.0.1:7001'}/quiz?code=HLS12345`);
    assert.equal(await page.getByRole('textbox').inputValue(), 'HLS12345');
    assert.ok(await page.getByRole('button', { name: /Validate Code/i }).isEnabled());
    console.log('PASS quiz link pre-fills code and leaves validation available');
  } finally {
    await browser.close();
  }
}

main().catch(error => { console.error(error); process.exitCode = 1; });
