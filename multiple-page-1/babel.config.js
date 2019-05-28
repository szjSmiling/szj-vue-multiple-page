module.exports = {
  presets: [
    '@vue/app',
    ['@babel/preset-env', { 'modules': false }]
  ],
  'plugins': [
    // [
    //   '@babel/plugin-transform-runtime',
    //   'component', [
    //     {
    //       'libraryName': 'mint-ui',
    //       'style': true
    //     }
    //   ]
    // ]
  ]
};
