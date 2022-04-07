import { getOS, getBrowserInfo, getOSVersion } from './browser'
import { UUID_KEY } from './config'
import { LocalStorage } from './Storage'
/**
 * 生成随机ID
 * @returns
 */
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })
}

/**
 * 生成事件模型
 * 事件模型，4W1H，即：一个用户在某个时间点（when），某个地方（where），以某种方式（how）完成了某个具体的动作（what）
 * 页面浏览、按钮点击、弹窗展示、模块曝光
 */
const genEventTemplateInfo = () => {
  return {
    id: generateUUID(), // 事件ID
    eventName: '', // 事件名称
    eventVariable: {}, // 事件变量：通常是业务变量
    eventDefaultVariable: {}, // 预置变量 所有事件都携带的变量
    eventTimestamp: Date.now(), // 时间戳
  }
}
/**
 * 生成基本信息
 * @param {*} options
 * @returns
 */
const genBaseInfo = (options) => {
  const { width, height } = window.screen
  const defaultInfo = {
    deviceBrand: getBrowserInfo(), // 浏览器厂牌
    deviceModel: navigator.userAgent, // 浏览器信息
    osVersion: getOSVersion(),
    screenWidth: width,
    screenHeight: height,
  }
  return Object.assign({}, defaultInfo, options)
}

/**
 * 生成默认的配置
 */
const genDefaultOptions = () => {
  return {
    useClass: true, // 是否用当前dom元素中的类名标识当前元素
    appid: 'default', // 应用标识，用来区分埋点数据中的应用
    uuid: '', // 设备标识，自动生成并存在浏览器中
    extra: {}, // 用户自定义上传字段对象
    enableHistoryTracker: true, // 是否开启页面history变化自动上报，适合单页面应用的history路由
    enableHeatMapTracker: true, // 是否开启热力图自动上报
    enableTrackerKey: true,
  }
}

/**
 * 生成用户的唯一id 例如 登录之后的userID
 */
const genUserUuid = () => {
  const currId = LocalStorage.get(UUID_KEY)
  if (!currId) {
    // 用户未登录的情况随机生成一个id 然后存到浏览器
    LocalStorage.setItem(UUID_KEY, generateUUID())
  }
  return currId
}

export {
  generateUUID,
  genEventTemplateInfo,
  genBaseInfo,
  genDefaultOptions,
  genUserUuid,
}
