# heg-samsung

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn run serve
```

### Compiles and minifies for production
```
yarn run build
```

### Run your tests
```
yarn run test
```

### Lints and fixes files
```
yarn run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


### 雪碧图使用 
图片加入到 src/sprites 运行项目调用
class="s-icon s-icon-图片名"

### 异步请求
this.$http(url, [options]).then()
this.$http.post(url, data, [options]).then()  

options =  {
  headers: {'X-Requested-With': 'XMLHttpRequest'},
  other: ###,
}

### 格式化日期 
utils/DateFormateUtils.js

### 安装base64
yarn add js-base64

### 安装pdf预览依赖
yarn add pdfjs-dist