<template>
  <div class="title">
    <h1>申請借用頁面</h1>

    <!-- 送出按鈕 -->
    <button class="submit-btn" @click="showSuccessModal = true">
      送出
    </button>

    <!-- 申請成功彈出視窗 -->
    <div v-if="showSuccessModal" class="modal-overlay">
      <div class="modal">
        <!-- 上方淺藍色區塊 -->
        <div class="modal-header">
          <h2>申請成功</h2>
        </div>

        <!-- 下方白色區塊 -->
        <div class="modal-body">
          <p>申請類型：學期借用</p>
          <p>起迄時間：2025/3/29 ~ 2025/12/6</p>
          <p>系櫃號碼：<span class="locker-number">93</span></p>
          <button class="close-btn" @click="showSuccessModal = false">關閉</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const showSuccessModal = ref(false)
</script>

<style scoped>
.title {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
}

/* 送出按鈕樣式 */
.submit-btn {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  font-size: 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.submit-btn:hover {
  background-color: #0056b3;
}

/* 彈窗背景 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

/* 彈窗本體 */
.modal {
  position: fixed;
  top: 20%; /* 顯示在上方 */
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  max-width: 400px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  overflow: hidden; /* 讓圓角生效 */
  text-align: center;
}

/* 上方淺藍色區塊 */
.modal-header {
  background: #eaf6ff; /* 淺藍色 */
  padding: 12px;
  font-size: 18px;
  font-weight: bold;
}

/* 下方白色內容 */
.modal-body {
  background: #fff;
  padding: 16px;
  font-size: 14px;
  color: #333;
}

/* 彈窗標題 */
.modal h2 {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 10px;
}

/* 系櫃號碼強調色 */
.locker-number {
  color: green;
  font-weight: bold;
}

/* 關閉按鈕 */
.close-btn {
  margin-top: 15px;
  padding: 8px 16px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.close-btn:hover {
  background: #0056b3;
}

/* RWD for 大螢幕 */
@media (min-width: 1024px) {
  .modal {
    top: 50%; /* 桌機希望置中比較好看 */
    transform: translate(-50%, -50%);
    width: 400px; /* 桌機就直接固定寬度 */
  }
}
</style>
