<script setup>
import { RouterLink } from 'vue-router'
import { ref, onMounted, onBeforeUnmount } from 'vue'
import logo from '@/assets/logo.png'

// 控制電腦版使用者選單顯示
const showMenu = ref(false)
// 控制手機版主選單顯示
const showMobileMenu = ref(false)
// 參考電腦版使用者選單 DOM 元素
const menuRef = ref(null)
// 控制手機版使用者選單顯示
const showMobileUserMenu = ref(false)

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

// 掛載全局點擊事件
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

// 卸載事件監聽器
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <header class="app-navbar">
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
          <RouterLink to="/review">審核申請</RouterLink>
          <RouterLink to="/setting">系統管理</RouterLink>
        </div>
        <div class="user-menu" ref="menuRef">
          <button class="user-btn" @click.stop="toggleMenu">
            u11316017
            <span :class="['arrow', { 'arrow-up': showMenu }]">▼</span>
          </button>
          <div v-if="showMenu" class="dropdown">
            <ul>
              <li><a href="#">登出</a></li>
            </ul>
          </div>
        </div>
      </nav>
    </div>

    <!-- 手機版 Header -->
    <div class="mobile-header">
      <div class="mobile-top-bar">
        <button class="menu-toggle" @click.stop="toggleMobileMenu">☰</button>

        <RouterLink to="/" class="mobile-logo-link">
          <img class="mobile-logo" :src="logo" alt="Logo" />
          <h1 class="mobile-system-title">系櫃借用系統</h1>
        </RouterLink>

        <div class="mobile-user-icon" @click.stop="toggleMobileUserMenu">👤</div>
      </div>

      <div v-if="showMobileMenu" class="mobile-menu">
        <RouterLink to="/" @click="toggleMobileMenu">首頁</RouterLink>
        <RouterLink to="/apply" @click="toggleMobileMenu">申請借用</RouterLink>
        <RouterLink to="/record" @click="toggleMobileMenu">申請紀錄</RouterLink>
        <RouterLink to="/review" @click="toggleMobileMenu">審核申請</RouterLink>
        <RouterLink to="/setting" @click="toggleMobileMenu">系統管理</RouterLink>
      </div>

      <div v-if="showMobileUserMenu" class="mobile-user-menu">
        <div class="user-name">u11316017</div>
        <div class="logout"><a href="#">登出</a></div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.app-navbar {
  width: 100%;
  display: flex;
  flex-direction: column;
  background: transparent;
  box-shadow: none;
  margin: 0;
  padding: 0;
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
  gap: 16px;
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
  padding: 12px 24px;
  box-shadow:
    0 -3px 6px rgba(0, 0, 0, 0.12),
    0 3px 6px rgba(0, 0, 0, 0.18);
  position: relative;
  z-index: 10;

  padding: 1rem 24px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.18);
}

.nav-links a {
  text-decoration: none;
  color: #333;
  padding: 12px 16px;
  border-radius: 4px;
  font-size: 25px;
}

.nav-links a.router-link-exact-active {
  background-color: #d6ecff;
  font-weight: bold;
}

.nav-links a:hover {
  background-color: #e6f3ff;
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
  padding: 8px 12px;
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
}

.menu-toggle {
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
}

.mobile-menu a {
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
  font-weight: bold;
  text-align: center;
  padding: 6px 0;
}

.mobile-user-menu .logout a {
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
</style>
