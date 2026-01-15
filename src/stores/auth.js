import { defineStore } from 'pinia'
import axios from 'axios'
import router from '@/router'
import { Role } from '@/utils/constants'

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
    isManager: (state) => Role.SystemManagerRoles.includes(state.user?.role),
    isUTCS: (state) => Role.SystemUserRoles.includes(state.user?.role),
  },

  actions: {
    // 初始化，在頁面載入時呼叫
    async initAuth() {
      await this.refreshTokenAction()
    },

    async login(credentials) {
      // 假設 SSO API 有 /auth/login
      const response = await axios.post(
        `${import.meta.env.VITE_SSO_API_URL}/api/v1/auth/login`,
        credentials,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          withCredentials: true
        }
      )
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
        const response = await axios.post(
          `${import.meta.env.VITE_SSO_API_URL}/api/v1/auth/refresh`,
          null,
          { withCredentials: true }
        )

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
      this.user.id = null
      this.user.role = null
      // 導向登入頁
      router.push({ name: 'home' })
    },
  },
})
