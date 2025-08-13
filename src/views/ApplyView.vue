<template>
  <div class="app-container">
    <!-- 借用類型與時間 -->
    <div class="row">
      <div class="left-group">
        <TypeSelect
          v-model="selectedType"
          @update:timeRange="handleTimeRangeUpdate"
        />
      </div>
    </div>

    <!-- 借用位置與狀態說明 -->
    <div class="row-space-between">
      <!-- 左邊：標題 + 年級 + 按鈕 -->
      <div class="left-group">
        <div class="label-text"><h2>請選擇要借用的位置</h2></div>
        <GradeSelect v-model="selectedGrade" />
        <button @click="openModal" class="view-button">查看位置</button>
        <div  class="view-word">
          <h4>＊位置僅供參考</h4>
        </div>
      </div>

      <!-- 右邊：狀態說明 -->
      <div class="right-group">
        <div class="status-legend">
          <div class="status-color color-borrowed"></div><span>借用中</span>
        </div>
        <div class="status-legend">
          <div class="status-color color-reviewing"></div><span>審核中</span>
        </div>
        <div class="status-legend">
          <div class="status-color color-selected"></div><span>選中標示</span>
        </div>
      </div>
    </div>

    <!-- 地圖彈窗 -->
    <ModalMap v-if="showModal" @select="selectGradeFromMap" @close="closeModal" />

    <div class="content-container">
      <LockerStatus :lockers="lockers" @select="handleLockerSelect" />
    </div>

    <!-- 借用確認彈窗 -->
    <ConfirmBorrowModal
      v-if="showConfirmModal"
      :locker="selectedLocker"
      :borrowType="selectedType"
      :timeRange="timeRange"
      @close="showConfirmModal = false"
      @confirm="handleConfirmBorrow"
    />
  </div>
</template>

<script setup>
  import { ref, watch } from 'vue'
  import ModalMap from '../components/ModalMap.vue'
  import GradeSelect from '../components/GradeSelect.vue'
  import TypeSelect from '../components/TypeSelect.vue'
  import LockerStatus from '../components/LockerStatus.vue'
  import ConfirmBorrowModal from '../components/ConfirmBorrowModal.vue'

  const selectedGrade = ref('一年級')
  const selectedType = ref('學年借用')
  const timeRange = ref({ start: '', end: '' })

  const showModal = ref(false)
  const selectedLocker = ref(null)
  const showConfirmModal = ref(false)

  function openModal() {
    showModal.value = true
  }
  function closeModal() {
    showModal.value = false
  }
  function selectGradeFromMap(grade) {
    selectedGrade.value = grade
    closeModal()
  }
  function handleLockerSelect(locker) {
    selectedLocker.value = locker
    showConfirmModal.value = true
  }
  function handleConfirmBorrow({ locker, reason }) {
    showConfirmModal.value = false
    alert(`成功申請借用櫃子 ${locker.name} ，理由：${reason}`)
  }
  function handleTimeRangeUpdate(range) {
    timeRange.value = range
    console.log('臨時借用時間範圍更新:', range)
  }

  const lockers = ref(generateLockersByGrade(selectedGrade.value))
  watch(selectedGrade, (newGrade) => {
    lockers.value = generateLockersByGrade(newGrade)
  })

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

  function generateLockerRange(startId, count) {
    return Array.from({ length: count }, (_, i) => {
      const id = startId + i
      return {
        id,
        name: `${id}`,
        isBorrowed: [1, 4, 7, 11, 30].includes(id),
        isReviewed: [3, 8, 9, 21, 20].includes(id),
      }
    })
  }

</script>

<style scoped>
  /* 全域容器樣式 */
  .app-container {
    margin: 0 auto;
    max-width: 1200px;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 20px;
  }

  .content-container {
    padding: 0 20px;
    box-sizing: border-box;
  }

  .row {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
    margin-left: 10px;
  }

  .row-space-between {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    box-sizing: border-box;
  }

  .left-group {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
    flex: 1;
    min-width: 0;
    margin-left: 20px;
  }

  .right-group {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }

  .label-text h2 {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-right: 12px;
  }

  .view-button {
    background-color: white;
    color: black;
    border: 1px solid #ccc;
    border-radius: 12px;
    padding: 4px 20px;
    cursor: pointer;
    user-select: none;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  .view-button:hover {
    background-color: #DFE1E6;
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
  .color-borrowed {
    background-color: #d9d9d9;
  }
  .color-reviewing {
    background-color: #97acca;
  }
  .color-selected {
    background-color: #fff;
    border: 2px solid #90c9ae;
  }

  .view-word h4 {
    font-weight: bold;
  }

  /* 統一字體大小為 16px */
  .view-button,
  .status-legend span {
    font-size: 16px;
  }


  /* 手機版 */
  @media (max-width: 767px) {
    .row-space-between {
      flex-direction: column;
      gap: 12px;
    }
    .label-text h2 {
      font-size: 20px;
      white-space: normal;
      margin-right: 0;
    }
    .view-button {
      font-size: 14px;
      padding: 6px 14px;
    }
    .status-legend {
      font-size: 16px;
      margin-left: 20px;
    }
  }

  /* 極小手機 320px 以下 */
  @media (max-width: 360px) {
    .row-space-between {
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
    }
    .left-group {
      width: 100%;
      flex-wrap: wrap;
    }
    .right-group {
      width: 100%;
      justify-content: flex-start;
    }
    .label-text h2 {
      font-size: 18px;
    }
    .view-button {
      font-size: 14px;
      padding: 4px 12px;
    }
    .status-legend {
      font-size: 14px;
    }
  }

  @media (max-width: 425px) {
    .app-container {
      padding-left: 10px; /* 往左靠一點 */
      padding-right: 10px;
      padding-top: 0;
    }

    .row-space-between,
    .left-group,
    .right-group,
    .content-container {
      margin-left: 0;
      padding-left: 0;
    }

    .label-text h2,
    .view-button,
    .status-legend {
      margin-left: 0;
    }
  }

  /* 平板版 */
  @media (min-width: 768px) and (max-width: 1023px) {
    /* 先讓整體容器垂直排列 */
    .row-space-between {
      display: flex;
      flex-direction: column; /* 兩排 */
      gap: 12px;
      padding: 0 20px;
      box-sizing: border-box;
    }

    /* 上方一排：年級選擇 + 查看位置按鈕 */
    .left-group {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: nowrap;
      justify-content: flex-start; 
      width: 100%;  /* 加寬度撐滿 */
    }

    /* 下方一排：狀態標示 */
    .right-group {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: nowrap;
      justify-content: flex-start; 
      width: 100%;  /* 加寬度撐滿 */
      margin-left: 20px;
    }
  }
</style>