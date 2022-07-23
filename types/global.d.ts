import {Browser} from "puppeteer";

declare global {
  declare namespace globalThis {
    var __BROWSER_GLOBAL__: Browser;
  }
}

// export {};
