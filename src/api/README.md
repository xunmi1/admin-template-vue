## api 模块
> 具体业务接口请求

### 说明文档
- 需要引入 `service` 模块, 使用 `service.request` 方法
```
import service from '@/libs/service'
```
- 由 `store (Vuex)` 模块调用, 再由具体的业务组件触发，**而非直接在业务组件中使用**
- 请求需使用 `service.request` 方法，参数:
```$xslt
{
    url: string; // 业务接口，基础 URL 为 config 模块的 baseUrl
    params?: Object; // URL 携带参数，method: 'get' 时会被拼接
    data?: Object; // 请求参数
    method: string; // HTTP 方法
}
```
- **返回类型: `Promise` 对象**

### 注意事项
- `method: 'post'` 时，勿传递 `params` 参数
