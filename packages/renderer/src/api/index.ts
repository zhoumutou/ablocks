import { createFetch } from 'ofetch'
import { API_BASE } from '@/config'
import { clearToken, getToken } from '@/hooks/useToken'

interface Options {
  url: string
  data?: object
  headers?: object
}

interface GenericsResponse {
  code: number
  message: string
  data?: object
}

const service = createFetch({
  defaults: {
    baseURL: API_BASE,
    timeout: 10000,
    method: 'POST',
  },
})

async function fetch(options: Options, requireAuth = true) {
  if (requireAuth) {
    const token = getToken()
    if (token) {
      options = {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${token}`,
        },
      }
    }
  }

  const { url, data = {}, headers } = options

  const result: GenericsResponse = await service(url, {
    headers: { ...headers },
    body: data,
  }).catch(err => {
    console.error(err)
    return { code: -1, message: err.message || err }
  })

  if (result.code === 401) {
    clearToken()
  }

  return result
}

export function login(data: object) {
  return fetch(
    {
      url: '/sys/login',
      data,
    },
    false,
  )
}
