<script setup>
import { ref, onMounted } from 'vue';
import LockerStatus from '@/components/LockerStatus.vue';
import { Locker } from '@/api/main';

const apiLockers = ref([]);
const lockers1 = ref([]);
const lockers2 = ref([]);
const lockers3 = ref([]);
const lockers4 = ref([]);

// 櫃子狀態常數 
const LockerState = {
  AVAILABLE: 0,     // 可借用
  UNDER_REVIEW: 1,  // 審核中
  BORROWED: 2       // 借用中
}

//從 API 載入櫃子資料 
async function loadLockersFromAPI() {
  try {
    const data = await Locker.getAll()
    apiLockers.value = data
    console.log('API Response:', data)
    // 載入完成後，生成櫃子（內部已整合 API 資料）
    lockers1.value = generateLockersByGrade('一年級')
    lockers2.value = generateLockersByGrade('二年級')
    lockers3.value = generateLockersByGrade('三年級')
    lockers4.value = generateLockersByGrade('四年級')
  } catch (error) {
    console.error('載入櫃子資料失敗:', error)
  }
}

function generateLockersByGrade(grade) {
  let lockers = [];

  if (grade === '一年級') {
    lockers = generateLockerRange(1, 25);
  } else if (grade === '二年級') {
    lockers.push(null);
    lockers = lockers.concat(generateLockerRange(26, 23));
    lockers.push(null);
    lockers.push(null);
    lockers = lockers.concat(generateLockerRange(49, 2));
  } else if (grade === '三年級') {
    lockers.push(null);
    lockers.push(null);
    lockers = lockers.concat(generateLockerRange(75, 2));
    lockers = lockers.concat(generateLockerRange(51, 24));
  } else if (grade === '四年級') {
    lockers = generateLockerRange(77, 24);
  }

  return lockers;
}

// 將 API 資料應用到櫃子生成邏輯
function generateLockerRange(startId, count) {
  return Array.from({ length: count }, (_, i) => {
    const id = startId + i

    // 從 API 資料中查找對應的櫃子
    const apiLocker = apiLockers.value.find(l => l.id === id)

    return {
      id: id,
      name: `${id}`,
      isBorrowed: apiLocker ? (apiLocker.state === LockerState.BORROWED) : false,
      isReviewed: apiLocker ? (apiLocker.state === LockerState.UNDER_REVIEW) : false,
      userId: apiLocker ? apiLocker.user_id : null,
      state: apiLocker ? apiLocker.state : LockerState.AVAILABLE
    }
  })
}

onMounted(async () => {
  await loadLockersFromAPI()

  const closePage = () => {
    window.close()
  }

  globalThis.onafterprint = closePage

  const mediaQuery = globalThis.matchMedia('print')
  mediaQuery.addEventListener('change', e => {
    if (!e.matches) closePage()
  })

  globalThis.print()
})
</script>

<template>
  <div class="show-container">
    <h1>一年級</h1>
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
      <LockerStatus :lockers="lockers1" />
    </div>
    <p class="print-date">列印日期: {{ new Date().toLocaleString() }}</p>
  </div>
  <div class="show-container">
    <h1>二年級</h1>
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
      <LockerStatus :lockers="lockers2" />
    </div>
    <p class="print-date">列印日期: {{ new Date().toLocaleString() }}</p>
  </div>
  <div class="show-container">
    <h1>三年級</h1>
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
      <LockerStatus :lockers="lockers3" />
    </div>
    <p class="print-date">列印日期: {{ new Date().toLocaleString() }}</p>
  </div>
  <div class="show-container">
    <h1>四年級</h1>
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
      <LockerStatus :lockers="lockers4" />
    </div>
    <p class="print-date">列印日期: {{ new Date().toLocaleString() }}</p>
  </div>
</template>

<style scoped>
h1 {
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

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  margin-bottom: 20px;
}

th,
td {
  padding: 8px;
  text-align: left;
  border: 1px solid #ddd;
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