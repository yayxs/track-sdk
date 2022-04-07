/**
 * 通过字符串获取元素
 * @param {*} queryString
 * @returns
 */

const querySelector = function (queryString) {
  return (
    document.getElementById(queryString) ||
    document.getElementsByName(queryString)[0] ||
    document.querySelector(queryString)
  )
}

export { querySelector }
