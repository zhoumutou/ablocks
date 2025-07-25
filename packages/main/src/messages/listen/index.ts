import app from './app'
import window from './window'
// import updater from './updater'
import serialport from './serialport'

export function listenMessages() {
  console.log(`[message] listen messages`)

  app()
  window()
  // updater()
  serialport()
}
