<script setup>
import { RouterLink } from 'vue-router'
import { ref, onMounted, onBeforeUnmount } from 'vue'
import logo from '@/assets/logo.png'
import Popup_SignIn from '../components/popups/Popup_SignIn.vue'

// 控制手機版主選單顯示
const showMobileMenu = ref(false)

// 控制手機版使用者選單顯示
const showMobileUserMenu = ref(false)

// 控制登入彈窗顯示的響應式狀態
const isSignInPopupVisible = ref(false)

// 手機使用者選單區域的 DOM 引用 (處理頭像/選單的點擊)
const mobileMenuRef = ref(null) 
// 手機漢堡選單區域的 DOM 引用 (處理漢堡選單的點擊)
const mobileHamburgerRef = ref(null)

// 顯示登入彈窗的函數 
function showSignInPopup() {
  isSignInPopupVisible.value = true; 
  // 為了避免點擊圖示後同時關閉選單，先確保選單關閉
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
          <RouterLink to="/apply">申請借用</RouterLink>
          <RouterLink to="/record">申請紀錄</RouterLink>
          <RouterLink to="/review">審核申請</RouterLink>
          <RouterLink to="/setting">系統管理</RouterLink>
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
        <RouterLink to="/apply" @click="toggleMobileMenu">申請借用</RouterLink>
        <RouterLink to="/record" @click="toggleMobileMenu">申請借用</RouterLink>
        <RouterLink to="/review" @click="toggleMobileMenu">審核申請</RouterLink>
        <RouterLink to="/setting" @click="toggleMobileMenu">系統管理</RouterLink>
      </div>
      
      <div v-if="showMobileUserMenu" class="mobile-user-menu">
        <div class="logout">
          <a href="#" @click.prevent="showSignInPopup">登入</a>
        </div>
      </div>

    </div> </div> <Popup_SignIn v-if="isSignInPopupVisible" @close="closeSignInPopup" >
    <template #登入>
        <h1 style="margin: 0;" ><b>登入</b></h1>
    </template>

    <template #帳號>
      <div style="display: flex; align-items: center; gap: 7px; width: 80%;"> 
        <label for="account" style="width: 50px; font-size: 24px; text-align: left;">帳號</label> 
        <input id="account" type="text" style="flex-grow: 1; padding: 8px; border: 1px solid #ccc; border-radius: 6px; box-sizing: border-box;">
      </div>
    </template>

    <template #密碼>
      <div style="display: flex; align-items: center; gap: 7px; width: 80%;">
        <label for="password" style="width: 50px; font-size: 24px; text-align: left;">密碼</label>
        <input id="password" type="password" style="flex-grow: 1; padding: 8px; border: 1px solid #ccc; border-radius: 6px; box-sizing: border-box;">
      </div>
    </template>

    <template #提示>
      <div style="
        margin-top: 1px; 
        margin-bottom: 5px;
        text-align: center; 
        width: 75%;
        ">
        <div style="
          background: rgba(235, 247, 255, 0.8);
          color: #007bff; 
          border: 1px solid #007bff; 
          border-radius: 12px; 
          padding: 8px 20px; 
          font-size: 14px;
          cursor: pointer;
          ">
          請使用 UTSC SSO 帳密登入
        </div>
      </div>
    </template>
    
    <template #送出>
      <button class="confirm-button" @click="closeSignInPopup">送出</button>        
    </template>

  </Popup_SignIn>

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
  transition: background-color 0.3s ease;
}

.desktop-header .user-menu .user-btn {
  /* 與 .nav-links a 相同的 padding: 12px 16px; 確保高度一致 */
  padding: 12px 16px;
  /* 與 .nav-links a 相同的 margin: 1rem; 確保間距一致 */
  margin-left: 1rem;
  margin-right: 1rem;
}

/*電腦版登入按鈕的 hover 效果*/
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

.confirm-button {
  width: 70px;
  height: 27px;
  color: black;
  background-color: white;
  border-radius: 10px;
  border: 1px solid #DFE1E6;
  font-size: 15px;
  cursor: pointer;
  user-select: none;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
}
.confirm-button:hover {
  background-color: #DFE1E6;
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