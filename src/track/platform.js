import platform from 'platform'

const getPlatform = () => {
  // const ua = window.navigator.userAgent
  const platformInfo = {}

  platformInfo.os = `${platform.os.family} ${platform.os.version}` || ''
  platformInfo.platformName = platform.name || ''
  platformInfo.platformVersion = platform.version || ''
  platformInfo.platformLayout = platform.layout || ''
  platformInfo.platformDesc = platform.description || ''

  return platformInfo
}

export { getPlatform }
