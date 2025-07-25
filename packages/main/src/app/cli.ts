import process from 'node:process'
import arg from 'arg'
import { getOSInfo, getVersionMeta, getAppName, getAppProductName } from '@/utils'

enum CliOption {
  DEBUG_MODE = '--debug-mode',
  USER_DATA_DIR = '--user-data-dir',
  VERSION = '--version',
  HELP = '--help',
  H = '-h',
  V = '-v',
}

const spec = {
  [CliOption.DEBUG_MODE]: Boolean,
  [CliOption.USER_DATA_DIR]: String,
  [CliOption.VERSION]: Boolean,
  [CliOption.V]: CliOption.VERSION,
  [CliOption.HELP]: Boolean,
  [CliOption.H]: CliOption.HELP,
}

export interface CliArgs {
  debugMode?: boolean
  userDataDir?: string
}

function parseArgs(argv: string[]) {
  return arg(spec, { argv, permissive: true })
}

const write = (str: string) => process.stdout.write(str)
const writeLine = (str: string) => write(`${str}\n`)

function handleHelp() {
  write(`Usage: ${getAppName()} [options]
  
    Available options:
          --user-data-dir           Change the user data directory
      -v, --version                 Print version information
      -h, --help                    Print this help message
  `)
}

function handleVersion() {
  const { node, electron, chrome, app } = getVersionMeta()
  const osInfo = getOSInfo()

  writeLine(`${getAppProductName()}: ${app}`)
  writeLine(`Node.js: ${node}`)
  writeLine(`Electron: ${electron}`)
  writeLine(`Chromium: ${chrome}`)
  writeLine(`OS: ${osInfo}`)
}

export function cli(): CliArgs {
  const args = parseArgs(process.argv.slice(1))

  if (args[CliOption.HELP]) {
    handleHelp()
    process.exit(0)
  }

  if (args[CliOption.VERSION]) {
    handleVersion()
    process.exit(0)
  }

  const debugMode = args[CliOption.DEBUG_MODE]
  const userDataDir = args[CliOption.USER_DATA_DIR]

  return { debugMode, userDataDir }
}
