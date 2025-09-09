<template>
  <!-- Modal 外層遮罩，點擊此區會關閉 modal -->
  <div v-if="modelValue" class="modal-overlay" @click.self="$emit('update:modelValue', false)">

    <!-- Modal 主體容器（點這裡不會觸發關閉） -->
    <div class="modal">
      <!-- 上方標題區塊 -->
      <div class="modal-header">
        <h2>申請成功</h2>
      </div>

      <!-- 下方內容區塊 -->
      <div class="modal-body">
        <p>申請類型：{{ borrowType }}</p>
        <p>起迄時間：{{ timeRange.start }} ~ {{ timeRange.end }}</p>
        <p>系櫃號碼：<span class="locker-number">{{ locker?.id }}</span></p>
        <p>借用理由：</p>
        <div class="borrow-reason-container">
          <p>{{ reason }}</p>
        </div>
        <div class="buttom">
        <bottom class="close-bottom" @click="emit('update:modelValue', false)">關閉</bottom>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { watch } from 'vue';
console.log("ModalSuccess mounted!")
const props = defineProps({
  modelValue: Boolean,
  locker: Object,
  borrowType: String,
  timeRange: Object,
  reason: String
});
const emit = defineEmits(['update:modelValue']);

watch(() => props.modelValue, (val) => {
  if (val) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
});
</script>

<style scoped>
/* Modal 遮罩背景 */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;            /* flex 置中 */
  justify-content: center;  /* 水平置中 */
  align-items: center;      /* 垂直置中 */
  z-index: 1000;
}

/* Modal 外框容器 */
.modal {
  width: 608px;        /* 彈窗寬度 */
  max-width: 90%;      /* 視窗太小時自動縮小 */
  min-height: 300px;
  max-height: 349px;    /* 高度上限 */
  border-radius: 16px;
  background: rgba(250, 250, 251, 0.95);
  padding: 24px;
  box-shadow: 2px 4px 4px rgba(0,0,0,0.35), -1.5px -0.5px 4px rgba(0,0,0,0.25);
  box-sizing: border-box;
  text-align: center;
}

/* Modal 標題區塊 */
.modal-header {
  min-height: 60px;
  background-color: #E8F7FF;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: -25px -24px 0 -24px;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

/* Modal 內文區塊 */
.modal-body {
  font-size: 18px;
  padding: 15px 10px 0;
  line-height: 1.6;
  color: #222;
  text-align: left;
  font-weight: 500;
}

/* Modal 標題文字樣式 */
.modal h2 {
  font-size: 24px;
  font-weight: 14px;
  color: #222;
  margin-bottom: 0;
}

.close-bottom {
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

.buttom {
  display: flex;
  justify-content: center;
  margin-top: 5px;
}

.close-bottom:hover {
  background-color:   #DFE1E6;
}

.borrow-reason-container {
  height: 12vh;
  overflow-y: auto; /* 出現垂直捲軸 */
  overflow-x: hidden; /* 禁止水平捲軸 */
  width: 100%; /* 讓捲動區塊佔滿寬度 */
  word-wrap: break-word; /* 自動換行 */
  word-break: break-word; /* 強制換行，避免長字串溢出 */
  white-space: normal; /* 確保文字可以換行 */
}

/* 桌機版調整位置 */
@media (min-width: 1024px) {
  .modal {
    top: 200px; /* 如果桌機的導覽列比較高可以調整這個值 */
    width: 400px;
  }
}

@media (max-width: 768px) {
  .borrow-reason-container {
    max-height: 8vh; /* 手機再縮小高度 */
  }
}
</style>
