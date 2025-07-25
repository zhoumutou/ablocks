import { SerialPort } from 'serialport'

export async function getSerialPorts() {
  return SerialPort.list()
}
