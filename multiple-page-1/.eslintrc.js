module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    // "object-shorthand": [0],
    // "object-curly-newline": ["error", { "minProperties": 2 }],
    "comma-dangle": [0],
    // "array-bracket-spacing": [2, "never"],
    // "comma-spacing": [2, { "before": false, "after": true }],
    // "computed-property-spacing": [2,"never"],
    semi: [0],//强行加分号
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
