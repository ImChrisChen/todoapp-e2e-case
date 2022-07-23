import {Page} from "puppeteer";
import * as path from "path";

// async function screenshot(name: string, page: Page) {
//   await page.screenshot({path: path.resolve(__dirname, ``)})
// }

export async function sleep(delay: number) {
  return new Promise(resolve => setTimeout(resolve, delay))
}