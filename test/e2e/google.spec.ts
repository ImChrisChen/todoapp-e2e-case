import {Page} from "puppeteer";

const timeout = 5000;

describe(
  '/ (Home Page)',
  () => {
    let page: Page;
    beforeAll(async () => {
      page = await globalThis.__BROWSER_GLOBAL__.newPage();
      await page.goto('https://bilibili.com');
    }, timeout);

    it('should load without error', async () => {
      const text = await page.evaluate(() => document.body.textContent);
      await page.screenshot({path: '1.png'})
      expect(text).toContain('bilibili');
    });
  },
);