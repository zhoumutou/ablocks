import { SerialPortInvoke } from '@ablocks/common/messages'
import { getSerialPorts } from '@/modules'
import { ipc } from '@/utils'

export default function listen() {
  console.log('[message] listen serialport messages')

  ipc.handle(SerialPortInvoke.getSerialPorts, getSerialPorts)
}
