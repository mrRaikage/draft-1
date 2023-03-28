const { setHeadlessWhen, setCommonPlugins } = require('@codeceptjs/configure');

// turn on headless mode when running with HEADLESS=true environment variable
// export HEADLESS=true && npx codeceptjs run
setHeadlessWhen(process.env.HEADLESS);

// enable all common plugins https://github.com/codeceptjs/configure#setcommonplugins
setCommonPlugins();

exports.config = {
  tests: './codecept/tests/*_test.js',
  output: './codecept/output',
  helpers: {
    Puppeteer: {
      url: '00000000-0000-0000-0000-000000000000',
      show: false,
      waitForNavigation: "networkidle0",
      waitForAction: 50,
    },
    REST: {
      endpoint: '00000000-0000-0000-0000-000000000000'
    }
  },
  include: {
    I: './codecept/steps_file.js',
    loginPage: './codecept/pages/login_user.js',
    signupPage: './codecept/pages/signup_user.js',
  },
  bootstrap: null,
  mocha: {},
  name: 'norder-web',
}
