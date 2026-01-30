const { chromium } = require('playwright');

async function recordDemo() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    recordVideo: {
      dir: './screenshots/',
      size: { width: 1280, height: 720 }
    }
  });
  const page = await context.newPage();

  console.log('Starting video recording...');
  console.log('Navigating to the app...');
  await page.goto('http://localhost:8081');

  // Wait for the app to load
  await page.waitForTimeout(3000);

  // Demonstrate keyboard functionality
  console.log('Demonstrating keyboard input...');

  // Show typing letters
  await page.keyboard.press('B');
  await page.waitForTimeout(800);
  await page.keyboard.press('E');
  await page.waitForTimeout(800);
  await page.keyboard.press('E');
  await page.waitForTimeout(1000);

  // Show backspace functionality
  await page.keyboard.press('Backspace');
  await page.waitForTimeout(800);
  await page.keyboard.press('Backspace');
  await page.waitForTimeout(800);

  // Type a word
  await page.keyboard.press('H');
  await page.waitForTimeout(500);
  await page.keyboard.press('O');
  await page.waitForTimeout(500);
  await page.keyboard.press('N');
  await page.waitForTimeout(500);
  await page.keyboard.press('E');
  await page.waitForTimeout(500);
  await page.keyboard.press('Y');
  await page.waitForTimeout(1000);

  // Submit with Enter
  console.log('Demonstrating Enter key (submit)...');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(2000);

  // Demonstrate shuffle
  console.log('Demonstrating Space key (shuffle)...');
  await page.keyboard.press('Space');
  await page.waitForTimeout(2000);

  // Type more letters
  await page.keyboard.press('C');
  await page.waitForTimeout(500);
  await page.keyboard.press('O');
  await page.waitForTimeout(500);
  await page.keyboard.press('M');
  await page.waitForTimeout(500);
  await page.keyboard.press('B');
  await page.waitForTimeout(1500);

  // Close to save the video
  await context.close();
  await browser.close();

  console.log('Video recording saved to screenshots/ directory');
}

recordDemo().catch(console.error);