// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')

module.exports = {
  build: {
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../dist/index.html'),
    /* 在当前目录的上一级 的 dist目录下输出资源文件 */
    assetsRoot: path.resolve(__dirname, '../dist'),
    /* 把所有的静态资源打包到 dist下的 static文件夹下 */
    assetsSubDirectory: 'static',
    /* 代表生成的index.html文件，里面引入资源时，路径前面要加上 ./,也就是assetsPublicPath的值 `` */
    assetsPublicPath: './',
    /* map像未加密的代码一样，准确的输出是哪一行哪一列有错 */
    productionSourceMap: false,
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  },
  dev: {
    env: require('./dev.env'),
    port: 8080,
    autoOpenBrowser: true,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {},
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false
  }
}
