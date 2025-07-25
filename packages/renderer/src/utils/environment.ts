export function isMobile() {
  if (navigator.userAgentData) {
    return navigator.userAgentData.mobile
  }

  if (navigator.maxTouchPoints !== undefined) {
    return navigator.maxTouchPoints > 0
  }
  return ('ontouchstart' in window)
}

export function isElectron() {
  if (navigator.userAgent.includes('Electron')) {
    return true
  }

  return false
}

export function isBrowser() {
  return !isElectron()
}

export function isMac() {
  if (navigator.userAgentData) {
    const platform = navigator.userAgentData.platform || ''
    return platform.includes('macOS')
  }

  return navigator.userAgent.includes('Macintosh') || navigator.userAgent.includes('Mac OS')
}

export const environment = {
  electron: isElectron(),
  browser: isBrowser(),
  mac: isMac(),
  is: {
    mobile: isMobile(),
  },
}
