# new-system

### 暂时记录
- 统一代码规范，**必须**开启 eslint 检查
- 打包启用 Modern Mode，会构建**两份应用**，为现代浏览器交付原生 ES6 应用包，并生成一个兼容旧浏览器的包用来平稳退化
- mixins: 尽量避免组件和 `mixin` 之间形成**强耦合**关系，为了便于移植. 判断标准: 引入或移除 `mixin` 时，原有组件除了必要的引入或移除操作外，再无任何改动或进行极少的修改
- 避免在 `require()` 中使用表达式 (expressions) 的形式，来执行时确定引用的文件，因为 webpack  静态打包，会将能够确定的目录下所有可能用到的模块都包含在 bundle 中
- 由于 vue-cli3 对 webpack 配置进行了合并和封装，若开发工具 IDE 无法识别, 则需手动修改配置文件路径
  ```
  <projectRoot>/node_modules/@vue/cli-service/webpack.config.js 
  ```
  注: `projectRoot` 为项目根路径
  - WebStorm (2018.3.3): 修改 'File' -> 'settings' -> 'Languages and Frameworks' -> 'JavaScript' -> 'Webpack' 中的加载路径
 
 - 规范 git commit 消息
   - format 格式
   ```
   <type>(<scope>): <subject>
   // 空一行
   <body>
   // 空一行
   <footer>
   // 其中，Header 是必需，Body 和 Footer 可以省略
    ```
    - type 类型
    ```
    feat, // 新功能（feature）
    fix, // 修补 bug
    docs // 文档（documentation）
    style, // 格式（不影响代码逻辑的变动）
    refactor, // 重构（即不是新增功能，也不是修改bug）
    test, // 增加测试
    chore, // 构建过程或辅助工具的变动
    revert, // 回退
    build, // 修改构建配置项
    ...
    ```
    - scope 受影响范围
    - subject 提交简要描述，结尾不加句号
    - body 详细描述，可以多行
    - footer 不兼容变动/ 关闭 issue
    - WebStorm 可以安装 git commit template 插件
- 禁止将本地开发中产生的无关文件夹、文件提交到 git 上, 例如: .vscode | .idea | \*debug.json 等
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
