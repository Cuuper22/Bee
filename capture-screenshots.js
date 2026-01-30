const { chromium } = require('playwright');

async function captureScreenshots() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });
  const page = await context.newPage();

  console.log('Navigating to the app...');
  await page.goto('http://localhost:8081');

  // Wait for the app to load
  await page.waitForTimeout(5000);

  // Capture main screen
  console.log('Capturing main game screen...');
  await page.screenshot({ path: 'screenshots/main-screen.png', fullPage: false });

  // Try to interact with the game using keyboard
  console.log('Testing keyboard input...');

  // Type some letters using keyboard
  await page.keyboard.press('B');
  await page.waitForTimeout(500);
  await page.keyboard.press('E');
  await page.waitForTimeout(500);
  await page.keyboard.press('E');
  await page.waitForTimeout(500);

  await page.screenshot({ path: 'screenshots/keyboard-input.png', fullPage: false });

  // Test Enter key
  console.log('Testing Enter key to submit...');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'screenshots/after-submit.png', fullPage: false });

  // Test Space key for shuffle
  console.log('Testing Space key for shuffle...');
  await page.keyboard.press('Space');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'screenshots/after-shuffle.png', fullPage: false });

  // Test Backspace
  console.log('Testing Backspace key...');
  await page.keyboard.press('B');
  await page.keyboard.press('E');
  await page.waitForTimeout(500);
  await page.keyboard.press('Backspace');
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'screenshots/after-backspace.png', fullPage: false });

  // Capture mobile viewport
  console.log('Capturing mobile view...');
  await page.setViewportSize({ width: 375, height: 812 });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'screenshots/mobile-view.png', fullPage: false });

  await browser.close();
  console.log('Screenshots captured successfully!');
}

captureScreenshots().catch(console.error);