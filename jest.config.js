const args = process.argv.reduce((previousValue, currentValue, currentIndex, array) => {
  if (!currentValue.startsWith('--')) {
    return previousValue
  }

  if (!currentValue.split('=')) {
    return previousValue
  }

  let [key, value] = currentValue.split('=')

  let [, k] = key.split('--')

  previousValue[k] = value
  return previousValue
}, {})

module.exports = {
  testMatch: [`<rootDir>/app/${args.app}/**/*.spec.ts`],
  globalSetup: './setup.js',
  globalTeardown: './teardown.js',
  testEnvironment: './puppeteer_environment.js',
};