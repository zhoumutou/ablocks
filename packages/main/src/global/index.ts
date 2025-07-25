export interface GlobalEnv {
  debugMode: boolean
  userDataDir: string
  logDir: string
  dataDir: string
  appDir: string
}

export interface GlobalUser {
  username: string
  token: string
}

interface GlobalConfig {
  env: GlobalEnv
  user?: GlobalUser
}

const config: GlobalConfig = {
  env: {
    debugMode: false,
    userDataDir: '',
    logDir: '',
    dataDir: '',
    appDir: '',
  },
  user: {
    username: '',
    token: '',
  },
}

export default config
