/**
 * @docs https://developer.mozilla.org/zh-CN/docs/Web/API/History  History 接口允许操作浏览器的曾经在标签页或者框架里访问的会话历史记录。
 * 处理 SPA 应用页面发生变化的监听 不仅仅是监听load
 * History.back()
 * History.forward()
 * History.go()
 * History.pushState()
 * History.replaceState()
 */

/**
 *
 * @param {String} type
 * @returns
 */
const createHistoryEvent = (type) => {
  if (!window.history) return
  const origin = history[type]
  return () => {
    // eslint-disable-next-line no-undef
    const res = origin.apply(this, arguments)
    const e = new Event(type)
    // eslint-disable-next-line no-undef
    e.arguments = arguments
    window.dispatchEvent(e) // https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/dispatchEvent
    return res
  }
}

export { createHistoryEvent }
