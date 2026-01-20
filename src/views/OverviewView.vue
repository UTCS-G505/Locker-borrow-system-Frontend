<script setup>
import { ref, onMounted } from 'vue';
import { Locker } from '@/api/main';
import LockerOverview from '@/components/LockerOverview.vue';

const apiLockers = ref([]);
const lockers = ref([]);
const printDate = ref('');

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
    lockers.value = {
      '一年級': generateLockersByGrade('一年級'),
      '二年級': generateLockersByGrade('二年級'),
      '三年級': generateLockersByGrade('三年級'),
      '四年級': generateLockersByGrade('四年級'),
    };
  } catch (error) {
    console.error('載入櫃子資料失敗:', error)
  }
}

function generateLockersByGrade(grade) {
  let lockers = [];

  if (grade === '一年級') {
    lockers = generateLockerRange(1, 25);
    lockers = lockers.concat(generateNullLocker(3));
  } else if (grade === '二年級') {
    lockers = generateNullLocker(1);
    lockers = lockers.concat(generateLockerRange(26, 23));
    lockers = lockers.concat(generateNullLocker(2));
    lockers = lockers.concat(generateLockerRange(49, 2));
  } else if (grade === '三年級') {
    lockers = generateNullLocker(2);
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

function generateNullLocker(count) {
  return Array.from({ length: count }, () => {
    return {
      id: 0,
      name: '',
      isBorrowed: true,
      isReviewed: false,
      code: 'X',
      state: LockerState.BORROWED
    }
  })
}

function printOverview() {
  const closePage = () => {
    window.close()
  }

  globalThis.onafterprint = closePage

  const mediaQuery = globalThis.matchMedia('print')
  mediaQuery.addEventListener('change', e => {
    if (!e.matches) closePage()
  })

  globalThis.print()
}

onMounted(async () => {
  printDate.value = new Date().toLocaleString()
  await loadLockersFromAPI()
})
</script>

<template>
  <div class="btn-container">
    <button @click="printOverview">列印</button>
  </div>
  <LockerOverview v-for="(lockers, grade) in lockers" :key="grade" :grade="grade" :lockers="lockers"
    :printDate="printDate" />
</template>

<style scoped>
.btn-container {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

@page {
  size: A4 landscape;
  margin: 10mm;
}

@media print {
  * {
    margin: 0;
    padding: 0;
    print-color-adjust: exact !important;
    background-color: white;
  }

  .btn-container {
    display: none;
  }
}
</style>