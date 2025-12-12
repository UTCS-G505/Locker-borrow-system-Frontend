import { defineStore } from 'pinia'
import axios from 'axios'
import router from '@/router'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: '',
    user: {
      id: null,
      role: null
    }, // 可存使用者資訊
    isAuthenticated: false,
  }),

  getters: {
    isLoggedIn: (state) => !!state.accessToken && state.isAuthenticated,
    isManager: (state) => state.user.role === '0' || state.user.role === '1',
    isUTCS: (state) => state.user.role !== '5' && state.user.role !== '6',
  },

  actions: {
    // 初始化，在頁面載入時呼叫
    async initAuth() {
      await this.refreshTokenAction()
    },

    async login(credentials) {
      // 假設 SSO API 有 /auth/login
      const response = await axios.post(`${import.meta.env.VITE_SSO_API_URL}/api/v1/auth/login`, credentials)
      this.accessToken = response.data.data.access_token
      this.isAuthenticated = true

      const payload = JSON.parse(
        atob(this.accessToken.split('.')[1])
      );
      this.user.id = payload.sub;
      this.user.role = payload.role;
    },

    async refreshTokenAction() {
      try {
        const response = await axios.post(`${import.meta.env.VITE_SSO_API_URL}/api/v1/auth/refresh`, null, {
          withCredentials: true,
        })

        this.accessToken = response.data.data.access_token
        this.isAuthenticated = true

        const payload = JSON.parse(
          atob(this.accessToken.split('.')[1])
        );
        this.user.id = payload.sub;
        this.user.role = payload.role;
        return this.accessToken
      } catch (err) {
        console.error('刷新 token 失敗', err)
        this.logout()
        return null
      }
    },

    logout() {
      this.accessToken = ''
      this.refreshToken = ''
      this.isAuthenticated = false
      this.user = null
      // 導向登入頁
      router.push({ name: 'home' })
    },
  },
})
