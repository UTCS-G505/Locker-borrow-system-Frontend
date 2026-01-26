<!-- LockerStatus.vue -->
<template>
  <div class="container">
    <div class="locker-grid">
      <div
        v-for="(locker, index) in displayLockers"
        :key="locker?.id || 'empty-' + index"
        class="locker"
        :class="{
          borrowed: locker?.isBorrowed,
          reviewed: locker?.isReviewed,
          selectable: locker && !locker?.isBorrowed && !locker?.isReviewed,
          hovered: locker && hoverId === locker?.id && !locker?.isBorrowed && !locker?.isReviewed,
          empty: !locker,
        }"
        @mouseenter="locker && (hoverId = locker?.id)"
        @mouseleave="hoverId = null"
        @click="locker && !locker?.isBorrowed && !locker?.isReviewed && $emit('select', locker)"
      >
        <div class="locker-content" v-if="locker">
          <div class="locker-name">{{ locker?.name }}</div>
          <div class="locker-code">
            <template v-if="locker?.isBorrowed || locker?.isReviewed">
              {{ locker?.userId || '' }}
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { SsoUser } from '@/api/sso';
const props = defineProps(['lockers'])
const emit = defineEmits(['select', 'finish'])
const hoverId = ref(null)

// 建立一個本地的 ref 來顯示處理過的櫃子資料
const displayLockers = ref([]);

let getUserAcc = async (userId) => {
  //沒有被借走的話就顯示空字串
  if (userId === null) {
    return null;
  }

  let data = await SsoUser.getGet(userId);
  let acc = '';
  console.log(data);
  if (data !== null) {
    acc = data.account;
  }
  return acc;
}

// 處理資料的函式 
  const processLockersData = async () => {
    // 複製一份 props.lockers，避免直接修改 props
    if (!props.lockers) return;
    console.log(props.lockers)
    
    // 深拷貝或是 map 出新陣列
    const tempLockers = props.lockers.map(locker => {
      if(locker) return {...locker};
      return null;
    });
    console.log(tempLockers)

    // 使用 Promise.all 平行處理，速度會比 for loop 快很多
    await Promise.all(tempLockers.map(async (locker) => {
      // 如果有 userId (代表借用中或審核中)，就去抓學號
      if (locker?.userId) {
        const account = await getUserAcc(locker.userId);
        locker.userId = account; // 將學號存入新的欄位
      }
    }));

  // 資料都處理完後，更新畫面
  displayLockers.value = tempLockers;
  emit('finish');
}

// 監聽 props.lockers 的變化，當父元件資料傳進來時，執行處理函式
watch(() => props.lockers, () => {
  processLockersData();
}, { immediate: true, deep: true });

</script>

<style scoped>
/*櫃子外面的框，框的大小固定*/
.container {
  max-width: 100%;
  margin: 0 auto;
  display: block;
  height: auto;
  width: 100%;
  border: 0.5px solid #d0d2d8ff;
  border-radius: 16px;
  padding: 40px;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  background-color: #fff;
}

/*排列櫃子，四個櫃子一個column*/
.locker-grid {
  display: grid;
  justify-content: space-between;
  grid-template-rows: repeat(4, minmax(60px, 1fr));
  grid-auto-flow: column;
  gap: 20px;
  overflow-x: auto;
  padding: 5px;
}

/*單一櫃子*/
.locker {
  box-sizing: border-box;
  width: 100%;
  max-width: 140px;
  min-width: 120px;
  height: 70px;
  padding: 4px;

  display: flex;
  align-items: flex-start;
  /* 靠上對齊 */
  justify-content: flex-start;
  /* 靠左對齊 */
  text-align: left;

  border-radius: 5px;
  border: 0.5px solid #dfe1e6;
  cursor: pointer;
  user-select: none;

  padding-left: 8px;
  padding-top: 6px;

  flex-shrink: 0;
}

.locker-content {
  position: relative;
  width: 100%;
  height: 100%;
}

.locker.empty {
  visibility: hidden;
}

/* 中間顯示 locker.code（限已借用） */
.locker-code {
  position: absolute;
  top: 70%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 14px;
  font-family: monospace;
  color: #5a5a5a;
  text-align: center;
}

/* 狀態樣式 */
.borrowed {
  background-color: #dbdcdd;
}

.reviewed {
  background-color: #97acca;
  color: white;
}

.selectable {
  background-color: #c3e2f8;
}

.hovered {
  outline: 4px solid #b4e2d7;
  outline-offset: -2px;
  background-color: white;
}
</style>