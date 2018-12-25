## store 模块
> Vuex

### 说明
- 管理系统主要状态
- 管理具体业务接口请求， 提高可复用性
- 同步常用、全局数据
- 使用 `modules` 分模块管理，禁止使用主模块 index.js 保存状态

### 注意事项
- 模块引入 (`import`) 已自动实现并注入 `modules`, 无需手动配置
- `actions` 主要负责异步操作，且异步操作需要返回 **`Promise` 对象**, 进行复杂异步操作时, 使用 `then()` 链式调用, 或 `async/await` 等方式, 避免**深层嵌套**
- 子模块使用命名空间 `namespaced: true`, 避免 getter、action 及 mutation 冲突
