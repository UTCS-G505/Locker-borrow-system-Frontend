import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import ApplyView from '@/views/ApplyView.vue'
import RecordView from '@/views/RecordView.vue'
import ReviewView from '@/views/ReviewView.vue'
import SettingView from '@/views/SettingView.vue'
import NotFoundView from '@/views/http-errors/NotFoundView.vue'
import HistoryExportView from '@/views/HistoryExportView.vue'

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
        title: '申請借用'
      }
    },
    {
      path: '/record',
      name: 'record',
      component: RecordView,
      meta: {
        title: '申請紀錄'
      }
    },
    {
      path: '/review',
      name: 'review',
      component: ReviewView,
      meta: {
        title: '審核申請'
      }
    },
    {
      path: '/setting',
      name: 'setting',
      component: SettingView,
      meta: {
        title: '系統管理'
      }
    },
    {
      path: '/export',
      name: 'export',
      redirect: '/export/history'
    },
    {
      path: '/export/history',
      name: 'export-history',
      component: HistoryExportView,
      meta: {
        title: '借用紀錄表'
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

router.beforeEach((to, _, next) => {
  let costumTitle = typeof to.meta.title === 'string' ? to.meta.title : null;
  let appName = 'UTaipei CS Locker Borrow System';
  if (costumTitle){
    document.title = `${costumTitle} | ${appName}`;
  }
  next()
})

export default router
