<template>
  <div class="app-container">
    <!-- 標題  -->
    <div class="left-group">
      <div class="label-text"><h2>請填寫申請內容</h2></div>
    </div>

    <!-- 借用類型與時間 -->
    <div class="left-group">
      <TypeSelect
        v-model="selectedType"
        @update:timeRange="handleTimeRangeUpdate"
      />
    </div>

    <!-- 借用位置與狀態說明 -->
    <div class="row-space-between">
      <!-- 左邊： 年級 + 位置按鈕 -->
      <div class="left-group">
        <GradeSelect v-model="selectedGrade" />
        <button @click="openModal" class="control-button">查看位置</button>
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

    <FailModal
    v-if="showFailModal"
    :reasons="failReasons"
    @close="showFailModal = false"
    />
    <ApplySuccessModal v-model="showSuccessModal"
      :locker="selectedLocker"
      :borrowType="selectedType"
      :timeRange="timeRange"
      :reason="borrowReason"
      />
  </div>
</template>

<script setup>

  import { ref, watch, onMounted } from 'vue'
  import ModalMap from '../components/ModalMap.vue'
  import GradeSelect from '../components/GradeSelect.vue'
  import TypeSelect from '../components/TypeSelect.vue'
  import LockerStatus from '../components/LockerStatus.vue'
  import ConfirmBorrowModal from '../components/ConfirmBorrowModal.vue'
  import FailModal  from '../components/FailedDialog.vue'
  import ApplySuccessModal from '../components/ApplySuccessModal.vue'
  import { useAuthStore } from '@/stores/auth';
  import { User, Locker, Record } from '@/api/main.js';

  const selectedGrade = ref('一年級')
  const selectedType = ref('學年借用')
  const timeRange = ref({ start: '', end: '' })

  const showModal = ref(false)
  const selectedLocker = ref(null)
  const showConfirmModal = ref(false)
  const showFailModal = ref(false)

  const failReasons = ref([])
  const showSuccessModal = ref(false)
  const borrowReason = ref('')

  // API 相關狀態 
  const apiLockers = ref([])  // 儲存從 API 獲取的原始資料
  const isLoading = ref(false) // 載入狀態

  const ERROR_LIBRARY = {
  MAINTENANCE: '該櫃位目前正在維修中，無法借用',
  SYSTEM_ERROR: '伺服器連線異常，請稍後再試',
  MISSING_INFO: '申請資訊填寫不完整',
  };

  // 櫃子狀態常數 
  const LockerState = {
    AVAILABLE: 0,     // 可借用
    UNDER_REVIEW: 1,  // 審核中
    BORROWED: 2       // 借用中
  }

  //從 API 載入櫃子資料 
  async function loadLockersFromAPI() {
    isLoading.value = true
    try {
      const data = await Locker.getAll()
      apiLockers.value = data
      console.log('API Response:', data)
      // 載入完成後，生成櫃子（內部已整合 API 資料）
      lockers.value = generateLockersByGrade(selectedGrade.value)
    } catch (error) {
      console.error('載入櫃子資料失敗:', error)
      failReasons.value = [ERROR_LIBRARY.SYSTEM_ERROR]
      showFailModal.value = true
    } finally {
      isLoading.value = false
    }
  }

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


  async function handleConfirmBorrow({ locker, reason }) {
    showConfirmModal.value = false

    // 取得 UserID
    const authStore = useAuthStore();
    const userId = authStore.user?.id;

    if (!userId) {
      failReasons.value = ["無法取得使用者資訊，請重新登入"];
      showFailModal.value = true;
      return; 
    }

    // 呼叫 User API 
    const userData = await User.getGet(userId);

    // API 連線是否失敗
    if (!userData) {
      failReasons.value = ["讀取使用者資料失敗"];
      showFailModal.value = true;
      return;
    }

    // 檢查是否為住宿生 (State 1)
    if (userData.state === 1) { 
      failReasons.value = ["您已被註記為住宿生，無法借用系櫃，如有疑問請洽系辦"];
      showFailModal.value = true;
      return;
    }

    // 檢查是否為違規 (State 2)
    if (userData.state === 2) {
      // 從後端資料取得 reason，若無則顯示預設文字
      const violationReason = userData.reason || '違反規定';
      
      failReasons.value = [`您已被註記違規（事由：${violationReason}），不可借用系櫃，如有疑問請洽系辦`];
      showFailModal.value = true;
      return;
    }

    if (String(locker.name) === '2') {
      failReasons.value = [ERROR_LIBRARY.SYSTEM_ERROR]
      showFailModal.value = true // 開啟失敗彈窗
    } else {
      borrowReason.value = reason
      showSuccessModal.value = true
    }
  }

  

  function handleTimeRangeUpdate(range) {
    timeRange.value = range
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

  // 組件掛載時載入 API 資料 
  onMounted(() => {
    loadLockersFromAPI()
  })

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
    padding-inline: 20px;  /*  左右留白唯一來源 */
    padding-block: 20px;   /* 上下距離 */
    align-items: flex-start; /* 子元素都往左靠齊 */
    padding-top: 0;
  }

  .left-group {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: nowrap;
    flex: 1;
    min-width: 0;
  }

  /* 標題 */
  .label-text h2 {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-right: 12px;
    margin-left: 0; /* 保證跟左邊對齊 */
  }

  /* 左右組合容器 */
  .row-space-between {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: space-between;
    box-sizing: border-box;
    width: 100%; /* 撐滿，元素左對齊 */
    gap: 12px;                 /* 行間隙 */

  }

  /* 右側狀態標示 */
  .right-group {
    display: flex;
    align-items: center;   /* 與左側底部對齊 */
    gap: 12px;
    flex-wrap: wrap;         /* 寬度不足自動換行 */
    margin-left: auto;       /* 桌面版靠右 */
    white-space: nowrap;      /* 文字不換行 */
    justify-content: flex-end; /* 換行後靠左 */
  }

    /* 文字不要換行 */
  .left-group, .right-group {
    white-space: nowrap;
  }

  .content-container {
    box-sizing: border-box;
    width: 100%; /* 撐滿但內容依然左對齊 */
  }

  .control-button {
    font-size: 16px;
    padding: 4px 12px;
    border: 1px solid #ccc;
    border-radius: 12px;
    background-color: white;
    color: #333;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    cursor: pointer;
    appearance: none;

  }
  .control-button:focus {
    outline: none;
  }
  .control-button:hover {
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

  /* 平板版 */
  @media (min-width: 768px) and (max-width: 1023px) {
    /* 先讓整體容器垂直排列 */
    .row-space-between {
      display: flex;
      flex-direction: row;      /* 保持 row 排列 */
      flex-wrap: wrap;          /* 允許換行 */
      align-items: flex-start;  /* 換行後靠左對齊 */
      justify-content: flex-start;
      gap: 8px;
      box-sizing: border-box;
    }

    /* 上方一排：年級選擇 + 查看位置按鈕 */
    .left-group {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: nowrap;
      width: 100%;  /* 加寬度撐滿 */
    }
  }

    /* 手機版 */

  @media (max-width: 767px) {
    .row-space-between {
      flex-direction: column;
      gap: 12px;
      justify-content: flex-start; /* 換行時靠左 */
      align-items: flex-start;
    }
    .label-text h2 {
      font-size: 20px;
      white-space: normal;
      margin-right: 0;
    }
    /*.view-button {
      font-size: 14px;
      padding: 6px 14px;
    }*/
    .status-legend {
      font-size: 16px;
      margin-left: 20px;
    }

     /* 下方一排：狀態標示 */
    .right-group {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: nowrap;
      width: 100%;  /* 加寬度撐滿 */
      margin-left: 0px;
      justify-content: flex-start;
    }
  }

    /*mobile L*/
  @media (max-width: 425px ) {
    .app-container {
      padding-left: 10px; /* 往左靠一點 */
      padding-right: 10px;
    }

    .row-space-between {
      justify-content: flex-start; /* 換行時靠左 */
      align-items: flex-start;
    }

    .row-space-between,
    .left-group,
    .content-container {
      margin-left: 0;
      padding-left: 0;
    }

    .right-group {
      display: flex;
      align-items: center;
      justify-content: space-between; /* 三個元素平均分布 */
      flex-wrap: nowrap;               /* 不換行 */
      width: 100%;                     /* 撐滿容器 */
      white-space: nowrap;             /* 文字不換行 */
    }

    .status-legend {
      display: flex;
      align-items: center;
      white-space: nowrap;             /* 文字不換行 */
      flex: 1;                         /* 平分寬度 */
      justify-content: center;         /* 元素內置中排列 */
    }
  }

    /* 極小手機 320px 以下 mobile S*/
  @media (max-width: 360px) {
    .row-space-between {
      flex-direction: column;
      justify-content: flex-start; /* 換行時靠左 */
      align-items: flex-start;
      gap: 8px;
    }
    .left-group {
      width: 100%;
      flex-wrap: wrap;
    }
    .right-group {
      margin-left: 0 !important;     /* 解除桌機版推到右邊 */
      width: 100%;
      flex-wrap: wrap !important;     /* 允許換行 */
      justify-content: flex-start !important; /* 換行後靠左 */
      align-items: center;
      gap: 8px;
      white-space: normal !important; /* 解除先前的 nowrap */
    }
    .label-text h2 {
      font-size: 18px;
    }

    .status-legend {
      font-size: 14px;
      display: flex;
      align-items: center;
      white-space: nowrap;             /* 文字不換行 */
      flex: 0 0 auto;                 /* 依內容寬度排列，不被平均撐開 */
      justify-content: flex-start;    /* 每個小塊內部也靠左 */
    }
  }
  </style>