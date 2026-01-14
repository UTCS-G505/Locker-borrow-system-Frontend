<script setup>
import { ref, nextTick, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth'; // 引入 Store
import { SsoUser } from '@/api/sso';
import { apiSsoV1 } from "@/api/base"; 

// Component
import RecordTable from '../components/RecordTable.vue';
import InfoPopup from '@/components/popups/InfoPopup.vue';

// --- 狀態變數 ---
const authStore = useAuthStore();
const record = ref([]); // 申請紀錄列表
const detailModalRef = ref(null); // 彈窗參照
const modalData = ref([]); // 彈窗內容

// --- 工具函式：日期格式化 ---
const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return dateStr.split('T')[0]; // 回傳 YYYY-MM-DD
};

const formatDateTime = (dateStr) => {
  if (!dateStr) return '';
  return dateStr.replace('T', ' '); // 回傳 YYYY-MM-DD HH:mm:ss
};

// --- 工具函式：判斷狀態字串 ---
const getStatusString = (item) => {
  // 有駁回原因 或 明確被拒絕
  if (item.reject_reason || item.borrow_accepted === false) {
    return '駁回';
  }
  // 已歸還：系辦已確認歸還
  if (item.return_accepted === true) {
    return '已歸還';
  }
  // 歸還中：申請歸還中 (還沒確認)
  if (item.return_available === true) {
    return '歸還中';
  }
  // 借用中：同意借用 (且前面沒歸還)
  if (item.borrow_accepted === true) {
    return '借用中';
  }
  // 預設：審核中 (borrow_accepted 為 null)
  return '審核中';
};

// --- 載入資料 ---
onMounted(async () => {
  try {
    // [修正1] 使用 authStore 實體，而不是類別定義 useAuthStore
    const currentUserId = authStore.user?.id || localStorage.getItem('userId');
    
    if (!currentUserId) {
      console.error("尚未登入，無法取得 ID");
      return;
    }

    console.log("目前 Store 中的 ID (UUID):", currentUserId);

    // 準備變數
    let userName = '未知使用者';
    let realStudentId = '';

    // [優化] 合併 API 呼叫：一次取得名字與學號
    try {
      const userInfo = await SsoUser.getGet(currentUserId);
      console.log("取得使用者詳細資料:", userInfo);

      if (userInfo) {
        // 取得名字 (優先使用 real_name，若無則用 name)
        userName = userInfo.real_name || userInfo.name || authStore.user?.name;
        
        // [修正2] 根據 CSV 檔案，欄位名稱應為 'acc'，而非 'account'
        realStudentId = userInfo.account; 
        console.log("轉換後的學號 (acc):", realStudentId);
      }
    } catch (e) {
      console.warn("無法取得使用者資訊，將嘗試使用原始 ID", e);
    }

    // 抓取借用紀錄
    let apiData = [];
    if (realStudentId) {
        try {
          console.log(`正在抓取使用者 ${realStudentId} 的借用紀錄...`);
          // 注意：你的路徑如果是 /record/get/list/ 請保留，若有誤請改回 /record/list/
          const response = await apiSsoV1.get(`/record/list/${currentUserId}`);
          
          if (response.data && Array.isArray(response.data.data)) {
            apiData = response.data.data;
            console.log("成功從後端取得資料！", apiData);
          } else {
            console.warn("API 回傳格式不正確或非陣列", response);
          }
        } catch (e) {
          console.error("抓取紀錄失敗", e);
        }
    }

    // 4. 資料對應 (Mapping)
    record.value = apiData.map(item => ({
      // --- 識別與基本資料 ---
      id: item.id,
      name: userName,
      type: item.temporary ? '臨時借用' : '學年借用',
      
      // --- 列表顯示用 ---
      startTime: formatDate(item.start_date),
      endTime: formatDate(item.end_date),
      num: item.locker_id,
      state: getStatusString(item),
      
      // --- 詳細資訊彈窗用 ---
      applyTime: formatDateTime(item.apply_date),
      reason: item.reason,
      
      directorTime: formatDateTime(item.review_date),
      rejectReason: item.reject_reason,
      
      returnApplyTime: formatDateTime(item.return_available_date),
      returnApproveTime: formatDateTime(item.return_accepted_date),

      // --- 原始邏輯判斷用 ---
      raw: {
        borrow_accepted: item.borrow_accepted,
        return_available: item.return_available,
        return_accepted: item.return_accepted,
        temporary: item.temporary
      }
    }));

  } catch (err) {
    console.error("載入流程發生未預期錯誤", err);
  }
});

// --- 按鈕邏輯 ---

// 取消申請
function handleCancel(id) {
  const item = record.value.find(r => r.id === id);
  if (item && item.state === '審核中') {
    item.state = '取消申請'; 
  }
}

// 歸還
function handleReturn(id) {
  const item = record.value.find(r => r.id === id);
  if (item && item.state === '借用中') {
    item.state = '歸還中';
  }
}

// 查看詳細資訊
const handleShowDetails = (id) => {
  const item = record.value.find(r => r.id === id);
  if (!item) return;

  console.log("查看詳細資訊:", item);

  modalData.value = [
    { label: '姓名', value: item.name },
    { label: '借用類型', value: item.type },
    { label: '借用時間(起)', value: item.startTime },
    { label: '借用時間(迄)', value: item.endTime },
    { label: '借用系櫃編號', value: item.num },
    { label: '申請借用時間', value: item.applyTime || '無資料' }, 
    { label: '借用理由', value: item.reason || '無理由', isFullRow: true, isBox: true },
    
    // 審核資訊
    { label: '系辦審核時間', value: item.directorTime || '' }, 
    { label: '系辦審核結果', value: item.state },

    // 駁回顯示
    ...(item.state === '駁回' ? [
        { label: '駁回理由', value: item.rejectReason || '無', isFullRow: true, isBox: true }
    ] : []),

    // 歸還顯示
    ...(['歸還中', '已歸還'].includes(item.state) ? [
        { label: '申請歸還時間', value: item.returnApplyTime },
        { label: '系辦審核時間', value: item.returnApproveTime || '待審核' }, 
    ] : [])
  ];

  nextTick(() => {
    if (detailModalRef.value) detailModalRef.value.open();
  });
};
</script>

<template>
  <div class="recordWrapper">
    <h1 class="record">申請紀錄</h1>
    
    <RecordTable
      :records="record"
      @cancel="handleCancel"
      @return="handleReturn"
      @show-details="handleShowDetails"
    />

    <InfoPopup
      ref="detailModalRef"
      title="詳細資訊"
      :fields="modalData"
    />
  </div>
</template>

<style scoped>
.recordWrapper {
  padding-top: 10px;
}

.record {
  font-size: 30px;
  color: #1a1a1a;
  margin-left: 15px;
  margin-bottom: 0;
}

/* 手機版 */
@media (max-width: 640px) {
  .recordWrapper {
    padding-top: 30px;
  }

  .record {
    font-size: 24px;
    margin-left: 12px;
  }
}
</style>