<script setup>
import { ref } from 'vue';
import PopupModal from './PopupModal.vue';
import { useAuthStore } from '@/stores/auth';

const emit = defineEmits(['close']);

const authStore = useAuthStore();

// --- 定義內部變數 ---
const account = ref('')
const password = ref('')
const isAccountError = ref(false)
const isPasswordError = ref(false)

function close() {
  emit('close')
}

// --- 處理送出邏輯 ---
async function handleSubmit() {
  // 重置錯誤狀態
  isAccountError.value = false
  isPasswordError.value = false
  let isValid = true

  // 檢查帳號
  if (!account.value.trim()) {
    isAccountError.value = true
    isValid = false
  }

  // 檢查密碼
  if (!password.value.trim()) {
    isPasswordError.value = true
    isValid = false
  }

  // 有錯就停止
  if (!isValid) return

  // --- 驗證通過後的邏輯 ---
  console.log('送出成功', account.value, password.value)
  await authStore.login({
    username: account.value,
    password: password.value
  })
  // 這裡之後可以接 API

  // 關閉彈窗
  close()
}
</script>

<template>
  <PopupModal @close="close">

    <template #header>
      <h1 style="margin: 0;"><b>登入</b></h1>
    </template>

    <template #content>
      <div class="signin-layout">

        <div class="input-group">
          <div class="form-row">
            <label for="account" class="form-label">帳號</label>
            <input id="account" type="text" class="form-input" v-model="account"
              :class="{ 'input-error': isAccountError }">
          </div>
        </div>

        <div class="input-group">
          <div class="form-row">
            <label for="password" class="form-label">密碼</label>
            <input id="password" type="password" class="form-input" v-model="password"
              :class="{ 'input-error': isPasswordError }">
          </div>
        </div>

        <div class="hint-group">
          <div class="hint-box">
            請使用 UTSC SSO 帳密登入
          </div>
        </div>
      </div>
    </template>

    <template #buttons>
      <button class="confirm-button" @click="handleSubmit">送出</button>
    </template>

  </PopupModal>
</template>

<style scoped>
/* --- 佈局設定 --- */
.signin-layout {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 7px 0;
}

.input-group {
  width: 70%;
  display: flex;
  justify-content: center;
}

.hint-group {
  margin-top: -5px;
  width: 100%;
  max-width: 280px;
  display: flex;
  justify-content: center;
}

.hint-box {
  background: rgba(235, 247, 255, 0.8);
  color: #007bff;
  border: 1px solid #007bff;
  border-radius: 10px;
  padding: 3px 20px;
  font-size: 14px;
  text-align: center;
  width: 100%;

}

/* --- 輸入框樣式 --- */
.form-row {
  display: flex;
  align-items: center;
  gap: 7px;
  width: 75%;
  margin: 0 auto;
}

.form-label {
  font-size: 24px;
  text-align: left;
  white-space: nowrap;
  width: 50px;
}

.form-input {
  flex-grow: 1;
  padding: 9px;
  border: 1px solid #ccc;
  border-radius: 6px;
  box-sizing: border-box;
}

/* --- 按鈕樣式 --- */
.confirm-button {
  width: 90px !important;
  height: 30px !important;
  font-size: 16px !important;

  color: black;
  background-color: white;
  border-radius: 10px;
  border: 1px solid #DFE1E6;
  cursor: pointer;
  user-select: none;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);

  display: flex;
  justify-content: center;
  align-items: center;
}

.confirm-button:hover {
  background-color: #DFE1E6;
}

/* --- 錯誤紅框樣式 --- */
.form-input.input-error {
  border: 1px solid #e36365 !important;
  background-color: #f5eeee;
}

.form-input.input-error::placeholder {
  color: #ffccc7;
}

/* --- 手機版 RWD 設定 --- */
@media (max-width: 580px) {

  /* Modal Content 是子元件的，必須保留 :deep */
  :deep(.modal-content) {
    width: 90% !important;
    max-width: 400px !important;
    padding-left: 15px;
    padding-right: 15px;
  }

  .form-row {
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    gap: 5px;
  }

  .form-label {
    width: 100%;
    margin-bottom: 2px;
    font-size: 20px;
    text-align: left;
  }

  .form-input {
    width: 100%;
  }
}
</style>