export enum kView {
  log = 'log',
  serialport = 'serialport',
}

export const BottomTabs = {
  log: kView.log,
  serialport: kView.serialport,
} as const

export type BottomTab = keyof typeof BottomTabs
