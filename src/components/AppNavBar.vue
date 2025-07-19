<script setup>
import { RouterLink } from 'vue-router'
import { ref, onMounted, onBeforeUnmount } from 'vue'
import logo from '@/assets/logo.png'

const showMenu = ref(false)
const menuRef = ref(null) // 參考 user-menu 範圍

function toggleMenu() {
  showMenu.value = !showMenu.value
}

// 點擊外部關閉選單
function handleClickOutside(event) {
  if (menuRef.value && !menuRef.value.contains(event.target)) {
    showMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

</script>

<template>
  <header class="app-navbar">
    <!-- Logo + 系統名稱 -->
    <div class="top-bar">
      <RouterLink to="/" class="logo-link">
        <img class="logo" :src="logo" alt="Logo" />
        <h1 class="system-title">系櫃借用系統</h1>
      </RouterLink>
    </div>

    <!-- 導覽列 -->
    <div class="nav-bar">
      <nav class="nav-links">
        <RouterLink to="/">首頁</RouterLink>
        <RouterLink to="/apply">申請借用</RouterLink>
        <RouterLink to="/record">申請紀錄</RouterLink>
        <RouterLink to="/review">審核申請</RouterLink>
        <RouterLink to="/setting">系統管理</RouterLink>
      </nav>

      <!-- User 下拉選單 -->
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
    </div>
  </header>
</template>

<style scoped>
html, body {
  margin: 0;
  padding: 0;
}

.app-navbar {
  width: 100%;
  background: transparent;
  box-shadow: none;
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
}

/* 第一層 */
.top-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px 24px;
  gap: 16px;
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

/* 第二層 */
.nav-bar {
  width: 100%;
  background: rgba(235, 247, 255, 0.8);
  padding: 12px 24px;
  box-shadow:
    0 -3px 6px rgba(0, 0, 0, 0.12),
    0 3px 6px rgba(0, 0, 0, 0.18);
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 10;
}

/* 導覽連結 */
.nav-links a {
  text-decoration: none;
  color: #333;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 16px;
}

.nav-links a.router-link-exact-active {
  background-color: #d6ecff;
  font-weight: bold;
}

.nav-links a:hover {
  background-color: #e6f3ff;
}

/* User 下拉選單 */
.user-menu {
  position: relative;
}

.user-btn {
  background: none;
  border: none;
  font-size: 16px;
  padding: 6px 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
}

/* 箭頭旋轉動畫 */
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
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
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
</style>
