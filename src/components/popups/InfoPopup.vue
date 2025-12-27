<script setup>
import { ref, watch } from 'vue';

// 接收外部傳入的標題與欄位資料
// fields 是一個陣列，每個物件包含 { label, value, isFullRow, isBox }
defineProps({
  title: {
    type: String,
    default: '詳細資訊'
  },
  fields: {
    type: Array,
    default: () => []
  }
});

const detailInfo = ref(false)

const open = () => {
  detailInfo.value = true
}

const close = () => {
  detailInfo.value = false
}

// 讓父組件可以呼叫 open/close
defineExpose({ open, close });

watch(detailInfo , (val) => {
  document.body.style.overflow = val ? 'hidden' : ''
})
</script>

<template>
  <div v-if="detailInfo" class="overlay" @click.self="close">
    <div class="detailInfo">
      <h2 class="title">{{ title }}</h2>
      <div class="info-list">
        <div class="row">
          
          <div 
            v-for="(item, index) in fields" 
            :key="index"
            class="field"
            :class="{ 'full-row': item.isFullRow }"
          >
            <span class="text">{{ item.label }}：</span>
            
            <div v-if="item.isBox" class="input-box">
              {{ item.value }}
            </div>
            
            <span v-else class="text">
              {{ item.value }}
            </span>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* --- 以下完全複製你提供的原始 CSS --- */

/* 覆蓋背景 */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

/* 彈窗本體 */
.detailInfo {
  background-color: #F6F7F9F2;
  width: 80%;
  max-width: 700px;
  height: auto;
  border-radius: 16px;
  padding: 20px;
  position: relative;
  overflow: hidden;
  /* 為了避免內容過多切到，建議加這行，但不加也符合你原版 */
  max-height: 90vh; 
  overflow-y: auto;
}

/* 標題 */
.title {
  min-height: 60px;
  background-color: #E8F7FFCC;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: -25px -24px 0px -24px;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  box-shadow: 0px 1px 4px 0px #00000040;
  padding-top: 10px;
  font-size: 25px;
}


/* 內容列 */
.info-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 10px;
}
.row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px 40px;
}

.row .field {
  display: flex;
  align-items: center;
}
.field.full-row{
  grid-column: span 2;
}


/* 駁回原因及申請原因 (白框樣式) */
.input-box {
  flex: 1;
  min-height: 27px;
  padding: 0px 8px;
  border-radius: 6px;
  border: none;
  background: #fff;
  font-size: 18px;
  margin-left: 6px; /* 和前面文字有點間距 */
  display: flex;    /* 為了垂直置中文字 */
  align-items: center;
}
/* 所有一般文字 */
.text{
  font-size: 18px;
  color: #000000;
  white-space: nowrap;
}

@media (max-width: 640px){
  .text {
    font-size: 16px;
  }
  .input-box{
    font-size: 16px;
    min-height: 54px;
  }
  .row{
    display: flex;
    flex-direction: column; /* 垂直排列 */
    gap: 10px;
    white-space: nowrap;
  }
  .field.full-row {
    display: flex;
    flex-direction: column;
    align-items: flex-start; /* 靠左 */
  }

  .field.full-row .text {
    margin-bottom: 4px; /* 文字和框框之間留點距離 */
  }

  .field.full-row .input-box {
    margin-left: 0; /* 移除原本的左邊距 */
    width: 100%; /* 讓白框框撐滿 */
  }
}
</style>