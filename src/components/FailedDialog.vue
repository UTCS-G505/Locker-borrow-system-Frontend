<script setup>
import PopupModal from './popups/PopupModal.vue';
// 當 PopupModal 發出 close 事件（點擊背景或按鈕）時，轉發給父層
const props = defineProps({
  reasons: {
    type: Array,
    default: () => ['因為你太菜了!!!']
  }
});
const emit = defineEmits(['close'])
</script>

<template>
  <PopupModal @close="emit('close')">

    <template #header>
      <h2 class="title">申請失敗</h2>
    </template>

    <template #content>
      <div class="message-wrapper">
        <p class="message">
          送出申請時遇到以下錯誤：<br>
          {{ props.reasons[0] }}
        </p>
      </div>
    </template>

    <template #buttons>
      <button class="close-btn" @click="emit('close')">關閉</button>
    </template>

  </PopupModal>
</template>

<style scoped>
.title {
  font-size: 1.5rem;
  font-weight: 500;
  color: #000000;
  margin: 0;
}

.message-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 0;
  min-height: 80px;
}

.message {
  font-size: 1.5rem;
  color: #000000;
  text-align: center;
  margin: 0;
}

.close-btn {
  width: 100px;
  height: 30px;
  font-size: 16px;
  border-radius: 10px;
  border: 1px solid #DFE1E6;
  background-color: white;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0,0,0,0.25);
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 5px;
}

.close-btn:hover {
  background-color: #DFE1E6;
}
</style>
