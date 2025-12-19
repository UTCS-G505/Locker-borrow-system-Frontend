import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

// **API for This Service**
const apiMainV1 = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/v1`, // 你的後端 API
  withCredentials: true,
  timeout: 5000,
})

// 請求攔截器，自動加上 access token
apiMainV1.interceptors.request.use(async (config) => {
  const authStore = useAuthStore()
  let token = authStore.accessToken

  if (!token) {
    token = await authStore.refreshTokenAction()
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

// 回應攔截器，自動刷新 token
apiMainV1.interceptors.response.use(
  (response) => response,
  async (error) => {
    const authStore = useAuthStore()
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      const newToken = await authStore.refreshTokenAction()
      if (newToken) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return apiMainV1(originalRequest)
      }
    }

    throw error
  }
)

// **SSO API**
const apiSsoV1 = axios.create({
  baseURL: `${import.meta.env.VITE_SSO_API_URL}/api/v1`, // 你的後端 API
  withCredentials: true,
  timeout: 5000,
})

apiSsoV1.interceptors.request.use(async (config) => {
  const authStore = useAuthStore()
  let token = authStore.accessToken

  if (!token) {
    token = await authStore.refreshTokenAction()
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

apiSsoV1.interceptors.response.use(
  (response) => response,
  async (error) => {
    const authStore = useAuthStore()
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      const newToken = await authStore.refreshTokenAction()
      if (newToken) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return apiSsoV1(originalRequest)
      }
    }

    throw error
  }
)

export default apiMainV1
export { apiSsoV1 }
