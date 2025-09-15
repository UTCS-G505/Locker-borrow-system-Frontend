<script setup>
import { ref, watch } from 'vue';

const detailInfo = ref(false)

const open = () => {
  detailInfo.value = true
}

const close = () => {
  detailInfo.value = false
}

watch(detailInfo , (val) => {
document.body.style.overflow = val ? 'hidden' : ''
})

</script>

<template>
  <button class="trigger" @click="open">模擬詳細資訊</button>

  <div v-if="detailInfo" class="overlay" @click.self="close">
    <div class="detailInfo">
        <h2 class="title">詳細資訊</h2>
      <div class="info-list">
      <div class="row">
        <div class="field">
          <span class="text" >申請人：</span>
          <span class="text" >陳胤華</span>
        </div>
        <div class="field">
          <span class="text" >狀態：</span>
          <span class="text" >借用中</span>
        </div>
        <div class="field">
          <span class="text" >借用類別：</span>
          <span class="text" >學期借用</span>
        </div>
        <div class="field">
          <span class="text" >申請時間：</span>
          <span class="text" >2025/6/30 9:50</span>
        </div>
        <div class="field">
          <span class="text" >時間起：</span>
          <span class="text" >2024/9/1</span>
        </div>
        <div class="field">
          <span class="text" >時間迄：</span>
          <span class="text" >2025/6/30</span>
        </div>
        <div class="field full-row">
          <span class="text" >借用原因：</span>
          <div class="input-box">沒有宿舍ＱＡＱ</div>
        </div>
        <div class="field full-row">
          <span class="text" >駁回原因：</span>
          <div class="input-box"></div>
        </div>
        <div class="field">
          <span class="text" >助教簽核時間：</span>
          <span class="text" ></span>
        </div>
        <div class="field">
          <span class="text" >系主任簽核時間：</span>
          <span class="text" ></span>
        </div>
      </div>
      </div>

      
    </div>
  </div>
</template>

<style scoped>
/* 按鈕 */
.trigger {
  padding: 2px 12px;
  background: #F3F7F9;
  color:#000000;
  border: 1px solid gray;
  border-radius: 10px;
  cursor: pointer;
  font-size: 15px;

}
.trigger:hover{
  background: #DBDCDD;
}

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


/* 駁回原因及申請原因 */
.input-box {
  flex: 1;
  min-height: 27px;
  padding: 0px 8px;
  border-radius: 6px;
  border: none;
  background: #fff;
  font-size: 18px;
  margin-left: 6px; /* 和前面文字有點間距 */
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
    margin-left: 0;   /* 移除原本的左邊距 */
    width: 100%;      /* 讓白框框撐滿 */
  }
}

</style>