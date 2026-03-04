const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.setViewportSize({ width: 1200, height: 630 });

  const filePath = path.resolve(__dirname, 'index.html');
  await page.goto(`file://${filePath}`);

  // Ensure dark theme for the screenshot
  await page.evaluate(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
  });

  // Wait for fonts and animations to settle
  await page.waitForTimeout(2000);

  // Screenshot the full viewport (hero section fills it at 1200x630)
  await page.screenshot({
    path: path.resolve(__dirname, 'og-image.png'),
    type: 'png',
  });

  await browser.close();
  console.log('Screenshot saved to og-image.png');
})();
