export class LocalStorage {
  static set(sName, value) {
    if (!sName) return
    if (typeof value !== 'string') {
      value = JSON.stringify(value)
    }
    window.localStorage.setItem(sName, value)
  }
  static get(sName) {
    let info = window.localStorage.getItem(sName) || ''
    try {
      info = JSON.parse(info)
    } finally {
      return info
    }
  }
  static remove(sName) {
    if (!sName) return
    window.localStorage.removeItem(sName)
  }
}
