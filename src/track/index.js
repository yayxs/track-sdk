import { EVENT_LIST } from './config'
import { generateUUID, genDefaultOptions, genBaseInfo } from './generate'
import { getEventListenerMethod, getEvent } from './event'

import { getBoundingClientRect, getDomPath } from './element'
// import { createHistoryEvent } from './history'

/**
 * 生成应用的信息
 */
const getAppInfo = () => {
  let data = {}
  data.title = document.title // 页面的标题
  data.url = window.location.href // 当前单页面完整的 href
  data.eventTime = new Date().getTime() // 当前上报的时间戳
  // data.browserType = platform.name // 平台的名称
  return Object.assign({}, data)
}

export default class TrackSdk {
  /**
   * 初始化
   * @param {Object} options 初始化扩展配置项
   */
  constructor(options) {
    this._baseInfo = {}
    this._isInstall = false // 是否安装SDK
    this._options = {} // 配置
    this._init(options) // 初始化
  }
  /**
   *
   * @param {Object} options 配置参数
   */
  _init(options = {}) {
    // 设置配置
    this._setConfig(options)
    // 设置随机ID
    this._setUuid()
    // 装载
    this._installInnerTrack()
  }
  /**
   * 参数合并
   * @param {*} options
   */
  _setConfig(options) {
    const defaultOptions = genDefaultOptions()
    this._options = Object.assign({}, defaultOptions, options)
  }
  _setUuid() {
    const uuid = generateUUID()
    this._options.uuid = uuid
  }

  /**
   * 约定拥有属性值为'tracker-key'的dom点击事件上报函数
   */
  _trackerKeyReport() {
    const eventMethodObj = getEventListenerMethod() // { addMethod,removeMethod, prefix }
    const eventName = 'click'
    window[eventMethodObj.addMethod](
      eventMethodObj.prefix + eventName,
      (event) => {
        const eventFix = getEvent(event)

        const trackerValue = eventFix.target.getAttribute('tracker-key')
        console.log('trackerValue', trackerValue)
        if (trackerValue) {
          this.sendTracker('click', trackerValue, {})
        }
      },
      false
    )
  }

  /**
   * 装载SDK内部预设埋点
   */
  _installInnerTrack() {
    if (this._isInstall) {
      return this
    }
    // 标签上有 tracker-key 属性
    // <div class="add-button" @click="clickBtn" tracker-key='user-add_car'>
    if (this._options.enableTrackerKey) {
      this._trackerKeyReport()
    }
    // 热力图埋点
    if (this._options.enableHeatMapTracker) {
      this._openInnerTrack(['click'], 'innerHeatMap')
    }

    // 页面 history 变化
    if (this._options.enableHistoryTracker) {
      // 1、首先监听页面初始化
      this._openInnerTrack(['load'], 'innerPageLoad')
      // 2、对浏览器history对象对方法进行改写，实现对单页面应用history路由变化的监听
    }

    this._isInstall = true
    return this
  }

  /**
   * 开启内部埋点
   * @param {*} eventType 监听事件类型
   * @param {*} trackKey 埋点key
   */
  _openInnerTrack(eventType, trackKey) {
    return this._captureEvents(eventType, trackKey)
  }
  /**
   * 通用事件处理函数
   * @param {Array} eventList 事件类型数组
   * @param {*} trackKey 埋点key
   */
  _captureEvents(eventList, trackKey) {
    if (!Array.isArray(eventList)) return
    const eventMethodObj = getEventListenerMethod()
    const eventListLen = eventList.length
    for (let i = 0; i < eventListLen; i++) {
      let eventName = eventList[i]
      window[eventMethodObj.addMethod](
        eventMethodObj.prefix + eventName,
        (event) => {
          const eventFix = getEvent(event)
          if (!eventFix) {
            return
          }
          if (EVENT_LIST.indexOf(eventName) > -1) {
            const domData = this._getDomAndOffset(eventFix)
            this.sendTracker(eventFix.type, trackKey, domData)
          } else {
            this.sendTracker(eventFix.type, trackKey, {})
          }
        },
        false
      )
    }
  }
  /**
   * 获取触发事件的dom元素和位置信息
   * @param {*} event 事件类型
   * @returns
   */
  _getDomAndOffset(event) {
    const domPath = getDomPath(event.target, this._options.useClass)
    const rect = getBoundingClientRect(event.target)
    if (rect.width == 0 || rect.height == 0) {
      return
    }
    let t = document.documentElement || document.body.parentNode
    const scrollX = (t && typeof t.scrollLeft == 'number' ? t : document.body)
      .scrollLeft
    const scrollY = (t && typeof t.scrollTop == 'number' ? t : document.body)
      .scrollTop
    const pageX = event.pageX || event.clientX + scrollX
    const pageY = event.pageY || event.clientY + scrollY
    const data = {
      domOriginPath: domPath,
      domPath: encodeURIComponent(domPath),
      offsetX: ((pageX - rect.left - scrollX) / rect.width).toFixed(6),
      offsetY: ((pageY - rect.top - scrollY) / rect.height).toFixed(6),
    }
    return data
  }
  /**
   * 用户ID
   */
  setUserId(userId) {
    this._options.userId = userId
  }
  /**
   * 设置埋点上报额外数据
   * @param {*} extraObj 需要加到埋点上报中的额外数据
   */
  setExtra(extraObj) {
    this._options.extra = extraObj
  }
  /**
   * 埋点上报
   * @param {*} eventType 事件类型
   * @param {*} eventId 事件key
   * @param {*} data 埋点详细数据
   */
  sendTracker(eventType, eventId, data = {}) {
    const defaultData = {
      userId: this._options.userId,
      appid: this._options.appid,
      uuid: this._options.uuid,
      eventType: eventType,
      eventId: eventId,
      ...getAppInfo(),
      ...this._options.extra,
    }

    const ans = Object.assign({}, defaultData, data)
    this._baseInfo = genBaseInfo(ans)
    console.log('+++ 埋点数据', JSON.stringify(this._baseInfo, null, 2))
  }
}
