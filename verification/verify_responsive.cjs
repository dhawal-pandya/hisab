const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Load the page
  await page.goto('http://localhost:3000');

  // Desktop View Screenshot
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.screenshot({ path: 'verification/desktop_view.png', fullPage: true });

  // Mobile View Screenshot
  await page.setViewportSize({ width: 375, height: 667 });
  await page.screenshot({ path: 'verification/mobile_view.png', fullPage: true });

  // Fill in some data to test Results view responsiveness
  await page.fill('input[placeholder="User Name"]', 'Alice');
  await page.click('button:has-text("Add Another User")');

  const userInputs = await page.$$('input[placeholder="User Name"]');
  if (userInputs.length > 1) {
    await userInputs[1].fill('Bob');
  }

  const amounts = await page.$$('input[placeholder="Amount"]');
  if (amounts.length > 0) {
      await amounts[0].fill('100');
  }
  if (amounts.length > 1) {
      await amounts[1].fill('50');
  }

  await page.click('button:has-text("Calculate")');

  await page.waitForTimeout(1000);

  // Mobile Results View Screenshot
  await page.screenshot({ path: 'verification/mobile_results_view.png', fullPage: true });

  await browser.close();
})();
