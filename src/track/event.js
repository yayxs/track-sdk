/**
 * 事件监听器 Element Document Window
 * target.addEventListener(type, listener, options);
 * type 事件类型
 *
 */
const getEventListenerMethod = () => {
  let addMethod = 'addEventListener',
    removeMethod = 'removeEventListener',
    prefix = ''
  // 兼容
  if (!window.addEventListener) {
    addMethod = 'attachEvent'
    removeMethod = 'detachEvent'
    prefix = 'on'
  }
  return {
    addMethod,
    removeMethod,
    prefix,
  }
}

/**
 *
 * @param {*} event 事件
 */
const getEvent = (event) => {
  event = event || window.event
  if (!event) {
    return event
  }
  if (!event.target) {
    event.target = event.srcElement
  }
  if (!event.currentTarget) {
    event.currentTarget = event.srcElement
  }
  return event
}

export { getEventListenerMethod, getEvent }
