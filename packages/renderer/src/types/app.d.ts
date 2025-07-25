export interface JwtToken {
  value: string
  exp: number
}

export interface Auth {
  id: string
  accessToken: JwtToken
  refreshToken: JwtToken
}

export type Callback = () => void

export type TimerId = ReturnType<typeof setInterval | typeof setTimeout> | undefined

export interface Pagination {
  page: number
  limit: number
}

export interface LoginData {
  accessToken: string
  refreshToken: string
}

export interface Profile {
  id: string
  account: string
  nickname: string
  points: number
  level: number
  exp: number
  nextExp: number
  referral: string
  inviter: string
  fans: number
}

export interface GeneralResponse {
  code: number
  message: string
}

export interface GenericsResponse<T> {
  code: number
  message: string
  data: T
}

export interface PageableResponse<T> {
  code: number
  message: string
  data: {
    total: number
    list: T[]
  }
}
