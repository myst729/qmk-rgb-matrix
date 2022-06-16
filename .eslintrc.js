module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
    node: true
  },
  extends: [
    'plugin:vue/essential',
    'eslint:recommended'
  ],
  rules: {
    'arrow-parens': 'off',
    'comma-dangle': 'off',
    'generator-star-spacing': 'off',
    'no-console': 'off',
    'no-debugger': 'off',
    'object-curly-spacing': ['error', 'always']
  },
  parserOptions: {
    parser: '@babel/eslint-parser'
  }
}
