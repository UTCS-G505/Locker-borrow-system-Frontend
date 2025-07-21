<script setup>
import { ref } from 'vue'

const showDialog = ref(false)

const open = () => {
  showDialog.value = true
}

const close = () => {
  showDialog.value = false
}
</script>

<template>
  <!-- 按鈕本體（元件自己帶） -->
  <button class="trigger" @click="open">模擬申請失敗</button>

  <!-- 彈窗 -->
  <div v-if="showDialog" class="overlay" @click.self="close">
    <div class="dialog">
      <h2 class="title">申請失敗</h2>
      <p class="message">您的申請未能通過，請稍後再試。</p>
      <button class="confirm" @click="close">確定</button>
    </div>
  </div>
</template>

<style scoped>
.trigger {
  background: #8b2729;
  color: #fff;
  border: none;
  padding: 6px 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
}
.trigger:hover {
  background: #d9363e;
}

.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.dialog {
  width: 340px;
  height: 159px;
  background: rgba(246, 247, 249, 0.95);
  border-radius: 16px;
  box-shadow:
    2px 4px 4px rgba(0, 0, 0, 0.35),
    -1.5px -0.5px 4px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.message {
  margin-top: 8px;
  font-size: 14px;
  color: #666;
  text-align: center;
}

.confirm {
  margin-top: 16px;
  background: #ff4d4f;
  color: #fff;
  border: none;
  padding: 6px 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
}
.confirm:hover {
  background: #d9363e;
}
</style>

