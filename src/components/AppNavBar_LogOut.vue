<script setup>
import { RouterLink } from 'vue-router'
import { ref, onMounted, onBeforeUnmount } from 'vue'
import logo from '@/assets/logo.png'
import PopupSignIn from './popups/PopupSignIn.vue'

// 控制手機版主選單顯示
const showMobileMenu = ref(false)

// 控制手機版使用者選單顯示
const showMobileUserMenu = ref(false)

// 控制登入彈窗顯示的響應式狀態
const isSignInPopupVisible = ref(false)

// 手機使用者選單區域的 DOM 引用
const mobileMenuRef = ref(null) 
// 手機漢堡選單區域的 DOM 引用
const mobileHamburgerRef = ref(null)

// 顯示登入彈窗的函數 
function showSignInPopup() {
  isSignInPopupVisible.value = true; 
  showMobileUserMenu.value = false; 
}

// 關閉登入彈窗的函數
function closeSignInPopup() {
  isSignInPopupVisible.value = false;
}
 
// 切換手機版主選單
function toggleMobileMenu() {
  showMobileMenu.value = !showMobileMenu.value
  showMobileUserMenu.value = false
}

function toggleMobileUserMenu() {
  showMobileUserMenu.value = !showMobileUserMenu.value
  showMobileMenu.value = false 
}

function handleClickOutside(event) {
  //檢查點擊是否在 mobileHamburgerRef (漢堡菜單區域) 之外
  if (mobileHamburgerRef.value && !mobileHamburgerRef.value.contains(event.target)) {
    showMobileMenu.value = false;
  }
  
  //檢查點擊是否在 mobileMenuRef (頭像/選單區域) 之外
  if (mobileMenuRef.value && !mobileMenuRef.value.contains(event.target)) {
    showMobileUserMenu.value = false;
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
  <div class="app-navbar">
    
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
          <div @click="showSignInPopup" class="nav-link-disabled">申請借用</div>
          <div @click="showSignInPopup" class="nav-link-disabled">申請紀錄</div>
        </div>
        <div class="user-menu">
          <button class="user-btn" @click="showSignInPopup"> 登入 </button>
        </div>
      </nav>
    </div>

    <div class="mobile-header">

      <div class="mobile-top-bar">
        <button class="menu-toggle" @click.stop="toggleMobileMenu" ref="mobileHamburgerRef">☰</button>

        <RouterLink to="/" class="mobile-logo-link">
          <img class="mobile-logo" :src="logo" alt="Logo" />
          <h1 class="mobile-system-title">系櫃借用系統</h1>
        </RouterLink>

        <div class="login" ref="mobileMenuRef">
          <div class="mobile-user-icon-container" @click.stop="toggleMobileUserMenu">
            <div class="mobile-user-icon">👤</div>
          </div>
        </div>
      </div>

      <div v-if="showMobileMenu" class="mobile-menu">
        <RouterLink to="/" @click="toggleMobileMenu">首頁</RouterLink>
          <a href="#" @click.prevent="showSignInPopup(); toggleMobileMenu()">申請借用</a>
          <a href="#" @click.prevent="showSignInPopup(); toggleMobileMenu()">申請紀錄</a>
      </div>
      
      <div v-if="showMobileUserMenu" class="mobile-user-menu">
        <div class="logout">
          <a href="#" @click.prevent="showSignInPopup">登入</a>
        </div>
      </div>
    </div> 
  </div> 

  <PopupSignIn v-if="isSignInPopupVisible" @close="closeSignInPopup" />

</template>


<style scoped>
.app-navbar {
  width: 100%;
  display: flex;
  flex-direction: column;
}

/* --- 電腦版樣式 --- */
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
  padding: 8px 24px; 
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.18);
}

.nav-links {
  display: flex;
  align-items: center;
}

.nav-links a {
  text-decoration: none;
  color: #333;
  padding: 8px 16px; 
  margin-left: 1rem;
  margin-right: 1rem;
  border-radius: 4px;
  font-size: 25px;   

  display: inline-flex;  
  align-items: center;   
  line-height: 1.5;
}

.nav-links div { 
  text-decoration: none;
  color: #333;
  padding: 8px 16px; 
  margin-left: 1rem;
  margin-right: 1rem;
  border-radius: 4px;
  font-size: 25px;   
  cursor: pointer; 
  transition: background-color 0.3s ease; 

  display: inline-flex;  
  align-items: center;   
  line-height: 1.5;
}

.nav-links div:hover {
  background-color: #a1d2ff;
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
  transition: background-color 0.3s ease;
}

.desktop-header .user-menu .user-btn {
  padding: 8px 16px; 
  margin-left: 0.8rem;
  margin-right: 0.8rem;
  line-height: 1.5; 
}

.desktop-header .user-menu .user-btn:hover {
  background-color: #a1d2ff;
  border-radius: 4px;
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

.mobile-user-icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%; 
  padding: 0 8px;
  cursor: pointer;
}

.mobile-user-icon {
  font-size: 24px;
}

.mobile-header .login .user-btn {
  display: none;
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
  display: block; 
}

.mobile-menu a:hover {
  font-weight: bold;
}

.mobile-user-menu {
  position: absolute;
  right: 12px;
  top: 56px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 6px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  width: 100px; /* 只需要顯示「登入」 */
  padding: 0;
  display: flex;
  flex-direction: column;
  z-index: 10;
}

.mobile-user-menu .logout a {
  font-size: 16px;
  text-decoration: none;
  color: #333;
  display: block;
  text-align: center;
  padding: 8px 12px; /* 調整 padding */
  border-radius: 6px;
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
  }

  .mobile-system-title {
    font-size: 26px; 
  }

  .mobile-logo {
    height: 48px; 
  }

  .mobile-menu a {
    font-size: 23px; 
  }

  .mobile-user-menu .user-name {
    font-size: 18px;
  }

  .mobile-user-menu .login a {
    font-size: 16px;
  }
}
</style>