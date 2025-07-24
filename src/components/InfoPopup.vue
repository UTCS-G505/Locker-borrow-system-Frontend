<script setup>
import { ref } from 'vue'

const detailInfo = ref(false)

const open = () => {
  detailInfo.value = true
}

const close = () => {
  detailInfo.value = false
}
</script>

<template>
  <button class="trigger" @click="open">模擬詳細資訊</button>

  <div v-if="detailInfo" class="overlay" @click.self="close">
    <div class="detailInfo">
      <h2 class="title">詳細資訊</h2>
      <div class="divider"></div>

      <div class="info-list">
        <div class="row">
          <span class="label">申請人：</span>
          <span class="value">陳胤華</span>
        </div>
        <div class="row">
          <span class="label">狀態：</span>
          <span class="value">借用中</span>
        </div>
        <div class="row">
          <span class="label">借用類別：</span>
          <span class="value">學期借用</span>
        </div>
        <div class="row">
          <span class="label">申請時間：</span>
          <span class="value">2025/6/30 9:50</span>
        </div>
        <div class="row">
          <span class="label">時間起：</span>
          <span class="value">2024/9/1</span>
        </div>
        <div class="row">
          <span class="label">時間迄：</span>
          <span class="value">2025/6/30</span>
        </div>
        <div class="row">
          <span class="label">借用原因：</span>
          <span class="value">沒有宿舍 QAQ</span>
        </div>
        <div class="row">
          <span class="label">駁回原因：</span>
          <span class="value"></span>
        </div>
        <div class="row">
          <span class="label">助教簽核時間：</span>
          <span class="value"></span>
        </div>
        <div class="row">
          <span class="label">系主任簽核時間：</span>
          <span class="value"></span>
        </div>
      </div>

      
    </div>
  </div>
</template>

<style scoped>
/* 按鈕 */
.trigger {
  padding: 8px 16px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

/* 覆蓋背景 */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

/* 彈窗本體 */
.detailInfo {
  background: white;
  width: 400px;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

/* 標題 */
.title {
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 10px;
}

/* 分隔線 */
.divider {
  height: 1px;
  background: #ddd;
  margin-bottom: 16px;
}

/* 內容列 */
.info-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.row {
  display: flex;
  align-items: center;
  font-size: 14px;
}



.label {
  color: #444;
  width: 150px;          
  text-align: left; 
}

.value {
  color: #111;
  flex: 1;             
  text-align: left;  
}

/* 底部 */
.footer {
  text-align: center;
  margin-top: 20px;
}

</style>
