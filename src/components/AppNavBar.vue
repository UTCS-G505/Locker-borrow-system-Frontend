<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { RouterLink } from 'vue-router'
import router from '@/router'
import { useAuthStore } from '@/stores/auth'
import logo from '@/assets/logo.png'
import { SsoAuth, SsoUser } from '@/api/sso'

// 控制電腦版使用者選單顯示
const showMenu = ref(false)
// 控制手機版主選單顯示
const showMobileMenu = ref(false)
// 參考電腦版使用者選單 DOM 元素
const menuRef = ref(null)
// 控制手機版使用者選單顯示
const showMobileUserMenu = ref(false)
const loggedInUser = ref(null);

const authStore = useAuthStore();

// 切換電腦版使用者選單
function toggleMenu() {
  showMenu.value = !showMenu.value
}

// 切換手機版主選單
function toggleMobileMenu() {
  showMobileMenu.value = !showMobileMenu.value
}

// 切換手機版使用者選單
function toggleMobileUserMenu() {
  showMobileUserMenu.value = !showMobileUserMenu.value
}

// 點擊外部關閉電腦版使用者選單
function handleClickOutside(event) {
  if (menuRef.value && !menuRef.value.contains(event.target)) {
    showMenu.value = false
    showMobileMenu.value = false
    showMobileUserMenu.value = false
  }
}

async function handleLogout() {
  await SsoAuth.postLogout();
  localStorage.removeItem('uid');
  localStorage.removeItem('username');
  localStorage.removeItem('role');
  localStorage.removeItem('access_token');
  loggedInUser.value = null;
  router.push('/');
}

// 掛載全局點擊事件
onMounted(async () => {
  document.addEventListener('click', handleClickOutside)

  let uid = localStorage.getItem('uid');
  let usernameResponse = await SsoUser.getGet(uid);
  loggedInUser.value = usernameResponse.name;
})

// 卸載事件監聽器
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div class="app-navbar">
    <!-- 電腦版 Header -->
    <div class="desktop-header">
      <div class="top-bar">
        <RouterLink to="/" class="logo-link">
          <img class="logo" :src="logo" alt="Logo" />
          <h1 class="system-title">系櫃借用系統</h1>
        </RouterLink>
      </div>
      <nav class="nav-bar">
        <div class="nav-links">
          <RouterLink to="/">首頁</RouterLink>
          <RouterLink to="/apply">申請借用</RouterLink>
          <RouterLink to="/record">申請紀錄</RouterLink>
          <RouterLink to="/review" v-if="authStore.isManager">審核申請</RouterLink>
          <RouterLink to="/setting" v-if="authStore.isManager">系統管理</RouterLink>
        </div>
        <div class="user-menu" ref="menuRef">
          <button class="user-btn" @click.stop="toggleMenu">
            {{ loggedInUser }}
            <span :class="['arrow', { 'arrow-up': showMenu }]">▼</span>
          </button>
          <div v-if="showMenu" class="dropdown">
            <ul>
              <li><a @click="handleLogout">登出</a></li>
            </ul>
          </div>
        </div>
      </nav>
    </div>

    <!-- 手機版 Header -->
    <div class="mobile-header">

      <div class="mobile-top-bar">
        <!-- 漢堡選單按鈕 -->
        <button class="menu-toggle" @click.stop="toggleMobileMenu">☰</button>

        <!-- Logo & 系統名稱 -->
        <RouterLink to="/" class="mobile-logo-link">
          <img class="mobile-logo" :src="logo" alt="Logo" />
          <h1 class="mobile-system-title">系櫃借用系統</h1>
        </RouterLink>

        <!-- 手機版使用者圖示 -->
        <div class="mobile-user-icon" @click.stop="toggleMobileUserMenu">👤</div>
      </div>

      <!-- 手機版主選單 -->
      <div v-if="showMobileMenu" class="mobile-menu">
        <RouterLink to="/" @click="toggleMobileMenu">首頁</RouterLink>
        <RouterLink to="/apply" @click="toggleMobileMenu">申請借用</RouterLink>
        <RouterLink to="/record" @click="toggleMobileMenu">申請紀錄</RouterLink>
        <RouterLink to="/review" @click="toggleMobileMenu">審核申請</RouterLink>
        <RouterLink to="/setting" @click="toggleMobileMenu">系統管理</RouterLink>
      </div>

      <!-- 手機版使用者選單 -->
      <div v-if="showMobileUserMenu" class="mobile-user-menu">
        <div class="user-name">{{ loggedInUser }}</div>
        <div class="logout"><a @click="handleLogout">登出</a></div>
      </div>

    </div>
  </div>
</template>


<style scoped>
.app-navbar {
  width: 100%;
  display: flex;
  flex-direction: column;
}

/* 電腦版樣式 */
.desktop-header {
  display: none;
}

.top-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid #ddd;
}

.logo {
  height: 80px;
}

.logo-link {
  display: flex;
  align-items: center;
  gap: 16px;
  text-decoration: none;
  color: inherit;
}

.system-title {
  font-size: 32px;
  font-weight: bold;
}

.nav-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(235, 247, 255, 0.8);
  padding: 1rem 24px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.18);
}

.nav-links a {
  text-decoration: none;
  color: #333;
  padding: 12px 16px;
  margin-left: 1rem;
  margin-right: 1rem;
  border-radius: 4px;
  font-size: 25px;
}

.nav-links a.router-link-exact-active {
  background-color: #a1d2ff;
  font-weight: bold;
}

.nav-links a:hover {
  background-color: #a1d2ff;
}

/* 使用者下拉選單 */
.user-menu {
  position: relative;
}

.user-btn {
  background: none;
  border: none;
  font-size: 25px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  color: #000;
}

.arrow {
  display: inline-block;
  transition: transform 0.3s ease;
}

.arrow-up {
  transform: rotate(90deg);
}

.dropdown {
  position: absolute;
  right: 0;
  top: 35px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  min-width: 100%;
}

.dropdown ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.dropdown li a {
  display: block;
  padding: 16px 12px;
  font-size: 20px;
  text-decoration: none;
  color: #333;
}

.dropdown li a:hover {
  background-color: #f0f0f0;
}

/* 手機版樣式 */
.mobile-header {
  display: block;
  position: relative;
}

.mobile-top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #EFF9FF;
  padding: 8px 12px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);
  height: 56px;
  border-bottom: 1px solid #ddd;
}

.menu-toggle {
  color: #000;
  font-size: 24px;
  background: none;
  border: none;
  cursor: pointer;
}

.mobile-logo-link {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  color: inherit;
}

.mobile-logo {
  height: 36px;
}

.mobile-system-title {
  font-size: 18px;
  font-weight: bold;
  white-space: nowrap;
  margin: 0;
}

.mobile-user-icon {
  font-size: 24px;
  cursor: pointer;
}

.mobile-menu {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  background: #EFF9FF;
  padding: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.mobile-menu a {
  font-size: 18px;
  padding: 10px 0;
  text-decoration: none;
  color: #333;
}

.mobile-menu a:hover {
  font-weight: bold;
}

/* 手機版使用者選單 */
.mobile-user-menu {
  position: absolute;
  right: 12px;
  top: 56px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 6px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  width: 140px;
  padding: 8px 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.mobile-user-menu .user-name {
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  padding: 6px 0;
}

.mobile-user-menu .logout a {
  font-size: 16px;
  text-decoration: none;
  color: #333;
  display: block;
  text-align: center;
  padding: 6px 0;
  border-radius: 4px;
}

.mobile-user-menu .logout a:hover {
  background: #f0f0f0;
}

/* RWD切換 */
@media (min-width: 1024px) {
  .desktop-header {
    display: block;
  }

  .mobile-header {
    display: none;
  }
}

/* 平板或大螢幕手機：增加 logo 和文字大小 */
@media (min-width: 600px) and (max-width: 1023px) {
  .mobile-top-bar {
    padding: 12px 20px;
    /* 增加 padding */
  }

  .mobile-system-title {
    font-size: 26px;
    /* 原本是 18px，放大 */
  }

  .mobile-logo {
    height: 48px;
    /* 原本是 36px，放大 */
  }

  .mobile-menu a {
    font-size: 23px;
    /* 原本是 18px，放大 */
  }

  .mobile-user-menu .user-name {
    font-size: 18px;
  }

  .mobile-user-menu .logout a {
    font-size: 18px;
  }
}
</style>
