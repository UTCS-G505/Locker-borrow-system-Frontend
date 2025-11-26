<script setup>
import { RouterLink } from 'vue-router'
import { ref, onMounted, onBeforeUnmount } from 'vue'
import logo from '@/assets/logo.png'
import Popup_SignIn from '../components/popups/Popup_SignIn.vue'

// 控制手機版主選單顯示
const showMobileMenu = ref(false)

// 控制登入彈窗顯示的響應式狀態
const isSignInPopupVisible = ref(false)
// 顯示登入彈窗的函數
function showSignInPopup() {
  // 點擊後顯示彈窗：改變狀態為 true
  isSignInPopupVisible.value = true; 
}
// 關閉登入彈窗的函數
function closeSignInPopup() {
  // 收到彈窗發出的 'close' 事件後，改變狀態為 false
  isSignInPopupVisible.value = false;
}

// 切換手機版主選單
function toggleMobileMenu() {
  showMobileMenu.value = !showMobileMenu.value
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
          <RouterLink to="/review">審核申請</RouterLink>
          <RouterLink to="/setting">系統管理</RouterLink>
        </div>
        <!-- 電腦版登入按鈕 -->
        <div class="user-menu">
          <button class="user-btn" @click="showSignInPopup"> 登入 </button>
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

        <!-- 手機版使用者登入 -->
        <div class="login">
          <button class="user-btn" @click="showSignInPopup">登入</button>
        </div>

      </div>

      <!-- 手機版主選單 -->
      <div v-if="showMobileMenu" class="mobile-menu">
        <RouterLink to="/" @click="toggleMobileMenu">首頁</RouterLink>
        <RouterLink to="/apply" @click="toggleMobileMenu">申請借用</RouterLink>
        <RouterLink to="/record" @click="toggleMobileMenu">申請紀錄</RouterLink>
        <RouterLink to="/review" @click="toggleMobileMenu">審核申請</RouterLink>
        <RouterLink to="/setting" @click="toggleMobileMenu">系統管理</RouterLink>
      </div>
      
    </div>

    <Popup_SignIn v-if="isSignInPopupVisible" @close="closeSignInPopup" >
      <template #登入>
        <h2 style="margin: 0;" >登入</h2>
      </template>

      <template #帳號>
        <div style="display: flex; align-items: center; gap: 10px; width: 80%;">
          <label for="account" style="width: 50px; font-size: 25px;">帳號</label>
          <input id="account" type="text" style="flex-grow: 1; padding: 8px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box;">
        </div>
      </template>

      <template #密碼>
        <div style="display: flex; align-items: center; gap: 10px; width: 80%;">
          <label for="password" style="width: 50px; font-size: 25px;">密碼</label>
          <input id="password" type="password" style="flex-grow: 1; padding: 8px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box;">
        </div>
        
        <div style="
          margin-top: 1px; 
          margin-bottom: 5px;
          text-align: center; 
          cursor: pointer;
          ">
          <button style="
            background: none;
            color: #007bff; 
            border: 1px solid #007bff; 
            border-radius: 12px; 
            padding: 8px 38px; 
            font-size: 14px;
            cursor: pointer;
            ">
            請使用 UTSC SSO 帳密登入
          </button>
        </div>
      </template>
      
      <template #送出>
        <button style="
          background-color: #f0f0f0; /* 淺灰背景 */
          color: #333; /* 深色文字 */
          border: 1px solid #ccc;
          border-radius: 12px;
          padding: 5px 20px;
          font-size: 16px;
          cursor: pointer;
          ">
          送出
        </button>
      </template>

    </Popup_SignIn>
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
  background-color: #a1d2ff ;
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
  font-size: 18px;
  padding: 10px 0;
  text-decoration: none;
  color: #333;
}

.mobile-menu a:hover {
  font-weight: bold;
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
    padding: 12px 20px; /* 增加 padding */
  }

  .mobile-system-title {
    font-size: 26px; /* 原本是 18px，放大 */
  }

  .mobile-logo {
    height: 48px; /* 原本是 36px，放大 */
  }

  .mobile-menu a {
    font-size: 23px; /* 原本是 18px，放大 */
  }

  .mobile-user-menu .user-name {
    font-size: 18px;
  }

  .mobile-user-menu .login a {
    font-size: 16px;
  }
}
</style>


