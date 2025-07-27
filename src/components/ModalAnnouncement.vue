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
  display: flex;
  background-color: #a1d2ff;      
  color: white;                   /* 白色文字 */
  padding: 0.6rem 1.2rem;
  margin-top: 0.5rem;
  font-size: 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;      /* 動畫過渡效果 */
}

button:hover {
  background-color: #7bb8ff;      /* 滑鼠移過去顏色稍微變深 */
  transform: scale(1.05);         /* 微微放大 */
}

button:active {
  background-color: #4d9fff;      /* 按下去顏色更深 */
  transform: scale(0.98);         /* 按下時微微縮小 */
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