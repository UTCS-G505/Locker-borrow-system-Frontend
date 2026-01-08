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
      <div class="scroll-container">
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
  max-width: 688px; 
  /* 設定最大高度，讓滑桿有機會出現 */
  max-height: 80vh; 
  border-radius: 16px;
  padding: 0; 
  position: relative;
  overflow: hidden;
  
  /* 使用 Flex 佈局讓標題固定，內容伸縮 */
  display: flex;
  flex-direction: column;
}

/* 標題 (固定在頂部) */
.title {
  min-height: 60px;
  background-color: #E8F7FFCC;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 10px;
  /* 確保只有上方有圓角 */
  border-top-left-radius: 16px; 
  border-top-right-radius: 16px;
  box-shadow: 0px 1px 4px 0px #00000040;
  font-size: 25px;
  flex-shrink: 0; /* 防止標題被壓縮 */
  z-index: 1; /* 確保陰影壓在內容上 */
}

.scroll-container{
  flex: 1;
  /* ★修改1：改成 auto，讓垂直和水平卷軸都能自動出現 */
  overflow: auto; 
  padding: 20px 40px;
}


.row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px 10px;
  /*強制內容至少 550px 寬，當外框縮小到比這窄時，就會出現橫向卷軸 */
  min-width: 550px;
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
  margin-left: 6px;
  display: flex;
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
    flex-direction: column;
    gap: 10px;
    white-space: nowrap;
    /* ★修改3：手機版移除最小寬度限制，讓它可以適應小螢幕變成直排 */
    min-width: auto;
  }
  .field.full-row {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .field.full-row .text {
    margin-bottom: 4px;
  }

  .field.full-row .input-box {
    margin-left: 0;
    width: 100%;
  }
}
</style>