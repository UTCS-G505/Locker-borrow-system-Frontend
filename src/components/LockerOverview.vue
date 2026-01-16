<template>
  <div class="show-container">
    <div class="logo-container">
      <img class="logo" :src="logo" width="350" alt="UTCS Logo">
    </div>
    <h1>臺北市立大學資訊科學系 系櫃借用情形一覽表</h1>
    <h1>{{ grade }}</h1>
    <div class="right-group">
      <div class="status-legend">
        <div class="status-color color-available"></div><span>可借用</span>
      </div>
      <div class="status-legend">
        <div class="status-color color-reviewing"></div><span>審核中</span>
      </div>
      <div class="status-legend">
        <div class="status-color color-borrowed"></div><span>借用中</span>
      </div>
    </div>
    <div class="locker-status">
      <LockerStatus :lockers="lockers" />
    </div>
    <p class="print-date">列印日期: {{ printDate }}</p>
  </div>
</template>

<script setup>
import LockerStatus from './LockerStatus.vue'
import logo from '@/assets/logo.png'

defineProps({
  grade: {
    type: String,
    required: true
  },
  lockers: {
    type: Array,
    required: true
  },
  printDate: {
    type: String,
    required: true
  },
})
</script>

<style scoped>
h1 {
  text-align: center;
}

.logo-container {
  text-align: center;
}

.right-group {
  display: flex;
  /* 與左側底部對齊 */
  align-items: center;
  gap: 12px;
  /* 寬度不足自動換行 */
  flex-wrap: wrap;
  /* 桌面版靠右 */
  margin-left: auto;
  /* 文字不換行 */
  white-space: nowrap;
  /* 換行後靠左 */
  justify-content: flex-end;
}

:deep(.locker-name) {
  font-size: 20px;
}

/* 狀態色塊 */
.status-legend {
  display: flex;
  align-items: center;
  gap: 6px;
}

.status-color {
  width: 16px;
  height: 16px;
  border: 1px solid #999;
}

.color-available {
  background-color: #c3e2f8;
}

.color-borrowed {
  background-color: #d9d9d9;
}

.color-reviewing {
  background-color: #97acca;
}

.print-date {
  text-align: right;
}

@page {
  size: A4, landscape;
}

@media print {
  * {
    margin: 0;
    padding: 0;
  }

  .show-container {
    break-inside: avoid;
    width: 100%;
    height: 100vh;
    margin: 0 auto;
  }

  .print-date {
    break-after: always;
  }
}
</style>
