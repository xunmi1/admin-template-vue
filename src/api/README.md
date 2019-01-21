## api 模块
> 具体业务接口请求

### 说明
- 需要引入 `service` 模块, 使用 `service.request` 方法
```js
import service from '@/libs/service'
```

- 请求需使用 `service.request` 方法，参数:
```
{
    url: string; // 业务接口，基础 URL 为 config 模块的 baseUrl
    params?: Object; // URL 携带参数，method: 'get' 时会被拼接
    data?: Object; // 请求参数
    method: string; // HTTP 方法
}
```
- **返回类型: `Promise` 对象**

- 使用方式
  - 禁止在业务组件中, 直接引入 `service` 并使用`service.request()`
  - 涉及公共状态的数据，由 `store (Vuex)` 模块调用该模块, 再由业务组件触发
  - 不涉及公共状态，可以在业务组件中调用该模块

### 注意事项
- `method: 'post'` 时，勿传递 `params` 参数
