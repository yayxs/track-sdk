# 埋点系统

## 思考问题

- 采集什么内容，采集接口的约定

- 怎么标识用户？用户的 id userId
- 发送的策略？
  - 时间间隔：每隔一段时间
  - 存储的条数：存储数据达到一定的条数
  - 应用进入后台（app、小程序）
- 数据发送失败了？

  - 将发送的数据缓存起来
  - 条件 ok 一起发
- 事件模型格式
- 数据怎么存储
- 数据要不要加密？
- 单页面应用和普通的web 应用的区别
- 混合应用的通讯问题

## 前端监控

- 数据监控 :`PV UV` 页面停留时间等
  - `PV`（page view，页面浏览量）:用户每打开 1 个网站页面，记录 1 个 `PV`。用户多次打开同一页面，`PV` 值累计多次。主要用来衡量网站用户访问的网页数量。是评价网站流量最常用的指标之一。
  - `UV` （ unique visitor，网站独立访客）:通过互联网访问、流量网站的自然人。1 天内相同访客多次访问网站，只计算为 1 个独立访客。该概念的引入，是从用户个体的角度对访问数据进行划分。

- 性能监控
- 异常监控

## 埋点方案

|          | 代码埋点                | 可视化埋点                    | 无痕埋点           |
| -------- | ----------------------- | ----------------------------- | ------------------ |
| 典型场景 |                         |                               |                    |
| 优势     |                         |                               |                    |
| 不足     | 数据不可回溯 开发成本高 | 不能关联业务数据 数据不可回溯 | 数据量大；“噪音多” |

### 常规方案

- 代码埋点
  - 特点 埋点位置打点； 任意时刻 
  - 优点 数据可靠 精准发送
  - 缺点 代码版本难以管理； 工作量大每一个组件都需要

- 可视化埋点
  - 特点 可视化手段 可视化页面
  - 缺点 不能手动定制

- 无埋点
  - 特点 全部埋点 所有事件记录 找出`dom`上的事件
  - 优点 采集全量数据
  - 缺点 数据传输 服务器压力大

- 埋点` SDK`
  - 简单易用；多端一致性


### 市面现成

1. 自主研发（大公司的必经之路）
2. 百度统计（免费）
3. `TalkingData`（收费）
4. `GrowingIo`（**全埋点**）
5. Google Analytics（免费）
6. `Mixpanel`（**可视化埋点**）
7. 友盟（收费）
8. 神策（收费）

## 埋点`SDK`功能设计

**WHO、WHEN、WHERE、HOW、WHAT 是埋点采集数据的基础维度**。

### 功能点

- 页面访问量：`PV UV`

- 重要操作（点击事件的频率）
- 页面的热力图效果
- 用户环境参数（设备参数、时间参数、地区参数）

### 实现点

- 页面加载完成自动上报 `PV` `UV`
- 手动上报埋点
- 上报默认携带`预设参数信息`
- 支持用户自定义埋点参数
- 点击`dom` 点击事件

### 产出

- `vue` 项目的 web 项目中的`main.js` 中

```javascript
import TrackSdk from './track'
const tracker = new TrackSdk({})
```

- 自定义埋点上报：针对特定场景

  ```javascript
  // 设置用户标识，在用户登录后使用
  tracker.setUserId('12312121212')
  
  // 埋点发送方法，3个参数分别是：事件类型，事件标识，上报数据
  const data = {
    name: 'tester',
    payload: {
      info: '',
    },
  }
  tracker.sendTracker('click', 'xxx', data)
  ```

## 方案设计

### 技术选型

- `vue` 环境下的自定义指令 uni-app 不支持

  ```html
  <div v-track:clickBtn="{other:'xxx'}"></div>
  ```

  - 在埋点的`DOM` 或者组件上通过指令设置实现埋点效果
  - 声明式埋点

  

- 选择原生` JS `甚至 `ES5`
- 自定义埋点的`sdk `
- 尽可能是一个`js` 为了兼容 公众号环境 和 小程序环境 注意 不同的环境下的对象的有无
  - 小程序封闭性强 不像web 灵活
  - 程序不像web那样可以通过获取dom绑定事件

### 有关数据

- 事件相关的基本数据
  - 事件发生的时间
  - 发生时页面信息快照
- 页面
  - 页面 `PV` `UV`
  - 用户页面的停留时长
  - 页面跳转事件
  - 页面进入后台
  - 用户离开页面
- 用户信息
  - 用户id
  - 设备
  - `IP`
  - 定位

### 页面的唯一标识

- web中的标识是 url

### 元素的标记方式

- `class` `nodeName` 无法唯一定位一个元素
- `id` 虽然按照规范是唯一的 但是每个页面中的元素可能被标记为 id 属性
- 先找打父亲节点 一直回溯 到 跟节点  组成一条路径 这个路径作为唯一标识  
  - html body #app 等等
  - document.querySelector就可以唯一选中这个被点击的元素

- 元素是以`DOM Tree`组织 沿着 X 一直往上找 得到X在 `DOM Tree` 中的唯一路径

### 数据上报方式

数据上报接口和业务系统同一域名，浏览器的请求并发限制 需要考虑 fallback

- img 长度限制

- 采用new Image用get请求1*1像素的`gif(gif最小)`的图片，请求地址和头部带上相关参数信息
  - `GIF` 防止跨域 防止页面阻塞 

- `sendBeacon `navigator.sendBeacon 
  - 将数据异步发送至服务器端
  - 能保证在页面卸载完成之前发送请求
  - post接收 后台还需要改造接口配置`CORS`。同时请求头必须满足CORS-safelisted request-header，其中content-type的类型必须为`application/x-www-form-urlencoded`, `multipart/form-data`, 或者`text/plain`。

### 小程序相关

- 在 `App` 调用之前 调用；首次调用初始化SDK 再次调用覆盖之前传入的配置 多次调用

## 引用

- [生成dom中的唯一标识](https://github.com/rowthan/whats-element/blob/master/src/whatsElement.js)

- [https://github.com/autarc/optimal-select](https://github.com/autarc/optimal-select)

- [track](https://raozhanping.gitbook.io/notes/js/js-track/js-track-codeless)

