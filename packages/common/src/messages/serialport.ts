import type { PortInfo } from './types'

export enum SerialPortInvoke {
  getSerialPorts = 'serialport:getSerialPorts',
}

export interface SerialPortInvokeMap {
  [SerialPortInvoke.getSerialPorts]: () => Promise<PortInfo[]>
}
