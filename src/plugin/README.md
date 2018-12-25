## plugin 模块
> 扩展 Vue 对象

### 说明
- 为 Vue 添加第三方、自定义组件库
- 添加实例属性、方法, `Vue.prototype.[yourKey]`
- 添加全局属性、方法,  `Vue.[yourKey]`

### 注意事项
- 添加实例属性，应已 `$` 为开头，避免污染全局作用域，且不能和以下关键词重名:
```$xslt
    $delete, 
    $destroy, 
    $emit, 
    $forceUpdate, 
    $inspect, 
    $mount,
    $nextTick,
    $off,
    $on,
    $once,
    $set,
    $watch
``` 
- 添加实例方法，应以 `$_` 为开头，至少 4 个字符
- 非常用属性、方法，放置 libs 模块内，使用 `require/import` 引入具体业务逻辑，无需挂载到 Vue 下 
