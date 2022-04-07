import { querySelector } from './document'
/**
 * 获取元素的位置
 * https://developer.mozilla.org/zh-CN/docs/Web/API/Element/getBoundingClientRect
 */
const getBoundingClientRect = (element) => {
  const rect = element.getBoundingClientRect()

  const width = rect.width || rect.right - rect.left
  const height = rect.height || rect.bottom - rect.top
  const data = {
    left: rect.left,
    top: rect.top,
    width,
    height,
    x: rect.x,
    y: rect.y,
  }
  return data
}
/**
 * 获取dom详情
 * @param {*} element
 * @param {*} useClass
 * @returns
 */

const getDomDesc = (element, useClass = false) => {
  const domDesc = []
  if (!element || !element.tagName) {
    return ''
  }
  if (element.id) {
    return `#${element.id}`
  }
  domDesc.push(element.tagName.toLowerCase())
  if (useClass) {
    const className = element.className
    if (className && typeof className === 'string') {
      const classes = className.split(/\s+/)
      domDesc.push(`.${classes.join('.')}`)
    }
  }
  if (element.name) {
    domDesc.push(`[name=${element.name}]`)
  }
  return domDesc.join('')
}

/**
 * 获取domPath 唯一标记
 * 页面中的哪个元素触发了用户的点击操作
 * 页面元素的标记方式
 */
const getDomPath = (element, useClass = false) => {
  if (!(element instanceof HTMLElement)) {
    console.warn('非HTML元素')
    return ''
  }
  let domPath = []
  let elem = element
  while (elem) {
    let domDesc = getDomDesc(elem, useClass)
    if (!domDesc) {
      break
    }
    domPath.unshift(domDesc)
    if (
      querySelector(domPath.join('>')) === element ||
      domDesc.indexOf('body') >= 0
    ) {
      break
    }
    domPath.shift()
    const children = elem.parentNode?.children
    if (children.length > 1) {
      for (let i = 0; i < children.length; i++) {
        if (children[i] === elem) {
          domDesc += `:nth-child(${i + 1})`
          break
        }
      }
    }
    domPath.unshift(domDesc)
    if (querySelector(domPath.join('>')) === element) {
      break
    }
    elem = elem.parentNode
  }
  return domPath.join('>')
}

export { getBoundingClientRect, getDomPath }
