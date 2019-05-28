const path = require('path');
const SpritesmithPlugin = require('webpack-spritesmith');

const templateFunction = function (data) {
  // console.log(data.sprites);
  const shared = '.s-icon {display:inline-block; background-image: url(I); }'.replace('I', data.sprites[0].image);

  // 注意：此处默认图标使用的是二倍图
  const perSprite = data.sprites.map(function (sprite) {
    // background-size: SWpx SHpx;
    return '.s-icon-N {width: Wpx; height: Hpx; background-position: Xpx Ypx; background-size: SWpx SHpx;}'
      .replace(/N/g, sprite.name)
      .replace(/SW/g, sprite.total_width / 2)
      .replace(/SH/g, sprite.total_height / 2)
      .replace(/W/g, sprite.width / 2)
      .replace(/H/g, sprite.height / 2)
      .replace(/X/g, sprite.offset_x / 2)
      .replace(/Y/g, sprite.offset_y / 2);
  }).join('\n');

  return shared + '\n' + perSprite;
};

const proxyIP = 'http://172.16.16.11:8080';
// const proxyIP = 'http://172.16.16.11:8080';
const isProduction = process.env.NODE_ENV === 'production';
module.exports = {
  publicPath: isProduction
    ? '/'
    : '/',

  outputDir: 'dist',

  assetsDir: 'static',

  filenameHashing: true,

  // When building in multi-pages mode, the webpack config will contain different plugins
  // (there will be multiple instances of html-webpack-plugin and preload-webpack-plugin).
  // Make sure to run vue inspect if you are trying to modify the options for those plugins.
  pages: {
    index: {
    // entry for the pages
      entry: 'src/pages/index/index.js',
      // the source template
      template: 'src/pages/index/index.html',
      // output as dist/index.html
      filename: 'index.html',
      // when using title option,
      // template title tag needs to be <title><%= htmlWebpackPlugin.options.title %></title>
      // title: '首页',
      // chunks to include on this pages, by default includes
      // extracted common chunks and vendor chunks.
      chunks: ['chunk-vendors', 'chunk-common', 'index']
    },
    flights: {
      entry: 'src/pages/flights/index.js',
      template: 'src/pages/flights/index.html'
    },
    booking: {
      entry: 'src/pages/booking/index.js',
      template: 'src/pages/booking/index.html'
    },
    payment: {
      entry: 'src/pages/payment/index.js',
      template: 'src/pages/payment/index.html'
    },
    trip: {
      entry: 'src/pages/trip/index.js',
      template: 'src/pages/trip/index.html'
    },
    'payment-status': {
      entry: 'src/pages/paystatus/index.js',
      template: 'src/pages/paystatus/index.html'
    },
    coupon: {
      entry: 'src/pages/coupon/index.js',
      template: 'src/pages/coupon/index.html'
    },
    offer: {
      entry: 'src/pages/offer/index.js',
      template: 'src/pages/offer/index.html'
    }
  },

  // eslint-loader 是否在保存的时候检查
  lintOnSave: true,

  // 是否使用包含运行时编译器的Vue核心的构建
  runtimeCompiler: false,

  // 默认情况下 babel-loader 忽略其中的所有文件 node_modules
  transpileDependencies: [],

  // 生产环境 sourceMap
  productionSourceMap: false,

  // cors 相关 https://jakearchibald.com/2017/es-modules-in-browsers/#always-cors
  // corsUseCredentials: false,
  // webpack 配置，键值对象时会合并配置，为方法时会改写配置
  // https://cli.vuejs.org/guide/webpack.html#simple-configuration

  configureWebpack: (config) => {
    config.plugins = [
      new SpritesmithPlugin({
        src: {
          cwd: path.resolve(__dirname, './src/assets/sprites'),
          glob: '*.png'
        },
        target: {
          image: path.resolve(__dirname, './src/assets/images/sprite.png'),
          css: [
            [path.resolve(__dirname, './src/assets/css/sprite.css'), {
              format: 'retinaOnly'
            }]
          ]
        },
        spritesmithOptions: { padding: 4 },
        apiOptions: { cssImageRef: './src/assets/images/sprite.png' },
        customTemplates: {
          retinaOnly: templateFunction
        }
      })
    ];

    // code split
    // if (isProduction) {
    //   config.externals = {
    //     'vue': 'Vue',
    //     'vue-router': 'VueRouter',
    //     'vuex': 'vuex'
    //   }
    // }
  },

  // webpack 链接 API，用于生成和修改 webapck 配置
  // https://github.com/mozilla-neutrino/webpack-chain
  chainWebpack: (config) => {
    // 因为是多页面，所以取消 chunks，每个页面只对应一个单独的 JS / CSS
    config.optimization
      .splitChunks({
        cacheGroups: {}
      });

    // 'src/lib' 目录下为外部库文件，不参与 eslint 检测
    config.module
      .rule('eslint')
      // .exclude
      // .add('/Users/maybexia/Downloads/FE/community_built-in/src/lib')
      .end();
    // config.resolve.symlinks(true);
  },

  // 配置高于chainWebpack中关于 css loader 的配置
  css: {
    // 是否开启支持 foo.module.css 样式
    modules: false,

    // 是否使用 css 分离插件 ExtractTextPlugin，采用独立样式文件载入，不采用 <style> 方式内联至 html 文件中
    extract: process.env.NODE_ENV === 'production',

    // 是否构建样式地图，false 将提高构建速度
    sourceMap: false,

    // css预设器配置项
    loaderOptions: {
      css: {
        // options here will be passed to css-loader
      },
      postcss: {
        // options here will be passed to postcss-loader
      },
      sass: {
        data: `@import "@/assets/css/variable.scss";`
      }
    }
  },

  // All options for webpack-dev-server are supported
  // https://webpack.js.org/configuration/dev-server/
  devServer: {
    open: true,
    // disableHostCheck: true,
    // historyApiFallback: false,
    // hot: true,
    host: '0.0.0.0',

    port: 3000,

    https: false,

    hotOnly: false,

    proxy: {
      '/heg_api': {
        target: proxyIP,
        changeOrigin: true,
        secure: false
      },
      '/flight_api': {
        target: proxyIP,
        changeOrigin: true,
        secure: false
      },
      '/offer_api': {
        target: proxyIP,
        changeOrigin: true,
        secure: false
      },
      '/heg_log': {
        target: proxyIP,
        changeOrigin: true,
        secure: false
      },
      '/oss_api': {
        target: proxyIP,
        changeOrigin: true,
        secure: false
      },
      '/api': {
        target: 'http://web.staging.johnable.net',
        changeOrigin: true,
        secure: false
        // http://web.staging.johnable.net/api/web/pay/
      }
    }

    // before: (app) => {
    // }
  },
  // 构建时开启多进程处理 babel 编译
  parallel: require('os').cpus().length > 1,

  // https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa
  pwa: {},

  // 第三方插件配置
  pluginOptions: {}
};
