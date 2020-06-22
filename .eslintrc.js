module.exports = {
  env: {
    browser: true,
    commonjs: true,
    mocha: true,
    es2020: true
  },
  extends: [
    'standard'
  ],
  parserOptions: {
    ecmaVersion: 11
  },
  rules: {
    'no-unused-expressions': 'off'
  }
}
