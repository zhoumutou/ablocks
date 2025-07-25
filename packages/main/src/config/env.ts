export const RENDERER_DEV_URL = import.meta.env.MODE === 'dev' ? import.meta.env.RENDERER_DEV_URL ?? 'http://localhost:5173' : ''

export const API_BASE = import.meta.env.API_BASE ?? 'http://localhost:5173/api'
