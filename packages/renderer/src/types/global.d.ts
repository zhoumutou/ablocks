import type { Bridge } from '@ablocks/common/messages'

declare global {
  interface NavigatorUAData {
    platform: string
    brands: {
      brand: string
      version: string
    }[]
    mobile: boolean
  }

  interface Navigator {
    userAgentData?: NavigatorUAData
  }

  interface Window {
    bridge: Bridge
  }
}

export {}
