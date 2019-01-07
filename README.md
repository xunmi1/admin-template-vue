# new-system

### 暂时记录
- 统一代码规范，**必须**开启 eslint 检查
- 打包启用 Modern Mode，会构建**两份应用**，为现代浏览器交付原生 ES6 应用包，并生成一个兼容旧浏览器的包用来平稳退化
- 由于 vue-cli3 对 webpack 配置进行了合并和封装，若开发工具 IDE 无法识别, 则需手动修改配置文件路径
  ```
  <projectRoot>/node_modules/@vue/cli-service/webpack.config.js 
  ```
  注: `projectRoot` 为项目根路径
  - WebStorm (2018.3.2): 修改 'File' -> 'settings' -> 'Languages and Frameworks' -> 'JavaScript' -> 'Webpack' 中的加载路径
   


### Project setup
```
npm install
```

- Compiles and hot-reloads for development
```
npm run serve
```

- Compiles and minifies for production
```
npm run build
```

- Run your tests
```
npm run test
```

- Lints and fixes files
```
npm run lint
```

- Run your unit tests
```
npm run test:unit
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
