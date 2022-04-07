const getOS = () => {
  const userAgent = window.navigator.userAgent
  const platform = window.navigator.platform
  const macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K']
  const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE']
  const iosPlatforms = ['iPhone', 'iPad', 'iPod']
  let os = ''
  if (~macosPlatforms.indexOf(platform)) {
    os = 'Mac OS'
  } else if (~iosPlatforms.indexOf(platform)) {
    os = 'iOS'
  } else if (~windowsPlatforms.indexOf(platform)) {
    os = 'Windows'
  } else if (/Android/.test(userAgent)) {
    os = 'Android'
  } else if (!os && /Linux/.test(platform)) {
    os = 'Linux'
  }
  return os
}
/**
 * 获取浏览器信息
 */

const getBrowserInfo = () => {
  const ua = window.navigator.userAgent.toLowerCase() // 'mozilla/5.0 (iphone; cpu iphone os 13_2_3 like mac os x) applewebkit/605.1.15 (khtml, like gecko) version/13.0.3 mobile/15e148 safari/604.1'
  let regArray = []
  if (ua.indexOf('msie') > 0) {
    const regStr_ie = /msie [\d.]+;/gi
    regArray = ua.match(regStr_ie)
  } else if (ua.indexOf('firefox') > 0) {
    const regStr_ff = /firefox\/[\d.]+/gi
    regArray = ua.match(regStr_ff)
  } else if (ua.indexOf('chrome') > 0) {
    const regStr_chrome = /chrome\/[\d.]+/gi
    regArray = ua.match(regStr_chrome)
  } else if (ua.indexOf('safari') > 0 && ua.indexOf('chrome') < 0) {
    const regStr_saf = /safari\/[\d.]+/gi
    regArray = ua.match(regStr_saf)
  } else {
    regArray = null
  }
  return regArray ? regArray[0] : 'other'
}

const getOSVersion = () => {
  let os = getOS()
  const nVer = window.navigator.appVersion
  const nAgt = window.navigator.userAgent
  let regArray = []
  if (/Windows/.test(os)) {
    regArray = /Windows (.*)/.exec(nAgt)
    os = 'Windows'
  }
  switch (os) {
    case 'Mac OS':
    case 'Mac OS X':
      regArray = /Mac OS X ([._\d]+)/.exec(nAgt)
      break
    case 'Android':
      regArray = /Android ([._\d]+)/.exec(nAgt)
      break
    case 'iOS':
      regArray = /OS (\d+)_(\d+)_?(\d+)?/.exec(nVer)
      return regArray
        ? `${regArray[1]}.${regArray[2]}.${regArray[3] ? regArray[3] : 0}`
        : 'other'
    default:
      regArray = null
      break
  }
  return regArray ? regArray[1] : 'other'
}

export { getOS, getBrowserInfo, getOSVersion }
