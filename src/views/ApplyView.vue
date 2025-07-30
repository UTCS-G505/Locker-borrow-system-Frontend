<template>
  <div class="title">
    <h1>申請借用頁面</h1>

    <button class="submit-btn" @click="showSuccessModal = true">送出</button>

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

    <button class="submit-btn" @click="showSuccessModal = true">送出</button>

    <!-- 彈窗元件 -->
    <ApplySuccessModal v-model:modelValue="showSuccessModal" />
  </div>
</template>

<script setup>
import { ref } from 'vue'

import ApplySuccessModal from '@/components/ApplySuccessModal.vue'

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

</style>
