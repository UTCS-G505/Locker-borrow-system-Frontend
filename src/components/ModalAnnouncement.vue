<script setup>
defineProps({
  announcement: Object,
})

const emit = defineEmits(['close'])  // 用來通知父層關閉 Modal
</script>

<template>
  <div v-if="announcement != null" class="modal-backdrop" @click="emit('close')">
    <div class="modal" @click.stop>
      <div class="modal-header">
        <h2>{{ announcement.title }}</h2>
      </div>
      <p class="date-text">發布日期：{{ announcement.date }}</p>
      <div class="content-container">
        <p class="content-text">{{ announcement.content }}</p>
      </div>
      <button @click="emit('close')">關閉</button>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding-bottom: 1rem;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.25);
  max-width: 700px;          /* 原本 400px，擴大寬度 */
  width: 80%;                /* 讓它在小螢幕也自適應 */
  display: flex;
  flex-direction: column;
  text-align: center;
  align-items: center;
}

.modal-header {
  text-align: center;
  padding: 1rem;
  width: 100%;  /* 讓 header 撐滿 */
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  background-color: rgba(235, 247, 255, 0.8);
  box-shadow: 0 2px 2px 0 #DFE1E6;
}

/* 標題字體大一點，視覺醒目 */
.modal h2 {
  font-weight: bold;
  font-size: 1.25rem;
}

/* 日期靠左，小灰字 */
.date-text {
  color: #888;
  font-size: 0.75rem;
  text-align: left;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  display: block;
}

.content-container {
  padding: 1rem;
  max-height: 60vh;      /* 內容區塊最大高度 */
  overflow-y: auto;      /* 出現垂直捲軸 */
  width: 100%;           /* 讓捲動區塊佔滿寬度 */
}

/* 內容字體黑色，比日期稍大 */
.content-text {
  color: #000;
  font-size: 1rem;
  line-height: 1.6;
  text-align: left;
  margin-bottom: 2rem;
}

button {
  background-color: #FFF;
  border: 2px solid #DFE1E6;
  border-radius: 10px;
  padding: 0 1.5rem;
  font-size: 20px;
}

button:hover {
  background-color: #DFE1E6;
}

@media (min-width: 640px) {
  .modal h2 {
    font-size: 2rem;
  }
  .date-text {
    font-size: 1.25rem;
  }
  .content-text {
    font-size: 1.75rem;
  }
}
</style>