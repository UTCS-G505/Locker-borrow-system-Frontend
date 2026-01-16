import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import ApplyView from '@/views/ApplyView.vue'
import RecordView from '@/views/RecordView.vue'
import ReviewView from '@/views/ReviewView.vue'
import SettingView from '@/views/SettingView.vue'
import NotFoundView from '@/views/http-errors/NotFoundView.vue'
import ExportLockerStatusView from '@/views/ExportLockerStatusView.vue'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        title: 'Home'
      }
    },
    {
      path: '/apply',
      name: 'apply',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: ApplyView,
      meta: {
        title: '申請借用',
        requiresAuth: true
      }
    },
    {
      path: '/record',
      name: 'record',
      component: RecordView,
      meta: {
        title: '申請紀錄',
        requiresAuth: true
      }
    },
    {
      path: '/review',
      name: 'review',
      component: ReviewView,
      meta: {
        title: '審核申請',
        requiresAuth: true,
        requiresManager: true
      }
    },
    {
      path: '/setting',
      name: 'setting',
      component: SettingView,
      meta: {
        title: '系統管理',
        requiresAuth: true,
        requiresManager: true
      }
    },
    {
      path: '/export',
      name: 'export',
      component: ExportLockerStatusView,
      meta: {
        title: '借用概況圖'
      }
    },
    {
      path: '/:catchAll(.*)',
      name: 'NotFound',
      component: NotFoundView,
      meta: {
        title: '404 Not Found'
      }
    },
  ],
})

router.beforeEach(async (to, _, next) => {
  const authStore = useAuthStore()
  if (to.meta.requiresAuth) {
    if (!authStore.isLoggedIn) {
      await authStore.initAuth()
    }

    if (!authStore.isLoggedIn) {
      return next({ name: 'home' }) // 導向登入頁
    }

    if(!authStore.isUTCS) {
      return next({ name: 'home' }) // 導向首頁
    }
  }

  if(to.meta.requiresManager){
    if(!authStore.isManager){
      return next({ name: 'home' }) // 導向首頁
    }
  }

  let costumTitle = typeof to.meta.title === 'string' ? to.meta.title : null;
  let appName = 'UTaipei CS Locker Borrow System';
  if (costumTitle){
    document.title = `${costumTitle} | ${appName}`;
  }
  next()
})

export default router
