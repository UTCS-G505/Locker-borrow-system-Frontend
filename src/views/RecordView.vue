<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { Record } from '@/api/main.js'
import RecordTable from '../components/RecordTable.vue'
import InfoPopup from '@/components/popups/InfoPopup.vue'

const record = ref([])
const detailModalRef = ref(null);
const modalData = ref([]);

// 頁面載入時獲取資料
onMounted(async () => {
  await fetchRecords()
})

// 從後端獲取申請紀錄列表
async function fetchRecords() {
  try {
    // 呼叫 API 獲取資料
    const data = await Record.getAll?.()

    if (data) {
      record.value = data
      console.log('獲取到的申請紀錄:', data)
    } else {
      record.value = []
    }
  } catch (error) {
    console.error('獲取申請紀錄失敗:', error)
    if (record.value.length === 0) record.value = [] 
  }
}

// 處理資料刷新 (當 RecordTable 中的歸還/撤回操作成功後，子元件會 emit 'refresh')
function handleRefresh() {
  console.log('收到刷新請求，重新獲取最新資料...')
  fetchRecords()
}

// 取消借用申請 (針對審核中的項目)
// TODO: 如果有 Record.postCancel，之後要在這裡呼叫
function handleCancel(id) {
  const item = record.value.find(r => r.id === id)
  if (item && item.state === '審核中') {
    // 暫時僅前端變更狀態，等待後端 API 完成
    if(confirm("確定要取消申請嗎？")) {
        item.state = '取消申請'
        // alert("已取消") 
    }
  }
}

function handleShowDetails(id) { 
  const item = record.value.find(r => r.id === id);
  if (!item) return;

  console.log("查看詳細資訊:", item);

  // 如果 API 回傳的欄位名稱不同，請記得修改這裡
  modalData.value = [
    // --- 第一列 ---
    { label: '姓名', value: item.name },
    { label: '借用類型', value: item.type },

    // --- 第二列 ---
    { label: '借用時間(起)', value: item.startTime },
    { label: '借用時間(迄)', value: item.endTime },

    // --- 第三列 ---
    { label: '借用系櫃編號', value: item.num }, 
    { label: '申請借用時間', value: item.createTime || '尚未記錄' }, // 假設後端有 createTime

    // --- 第四列：借用理由 ---
    { label: '借用理由', value: item.reason || '無填寫理由', isFullRow: true, isBox: true },

    // --- 第五列：審核資訊 ---
    { label: '系辦審核時間', value: item.directorTime || item.assistantTime || '審核中/無資料' }, 
    { label: '系辦審核結果', value: item.state },

    // --- 駁回原因 (如果有) ---
    ...(item.state === '駁回' ? [
        { label: '駁回理由', value: item.rejectReason || '無駁回理由', isFullRow: true, isBox: true }
    ] : []),

    // --- 歸還資訊 ---
    ...(['歸還中', '已歸還'].includes(item.state) ? [
        { label: '申請歸還時間', value: item.returnApplyTime || '無資料' },
        { label: '系辦審核時間', value: item.returnApproveTime || '審核中' },
    ] : [])
  ];

  nextTick(() => {
    if (detailModalRef.value) {
      detailModalRef.value.open();
    }
  });
}
</script>

<template>
  <div class="recordWrapper">
    <h1 class="record">申請紀錄</h1>

    <RecordTable 
      v-if="record.length > 0"
      :records="record" 
      @cancel="handleCancel" 
      @refresh="handleRefresh"
      @show-details="handleShowDetails" 
    />

    <div v-else class="empty-state">
      <p>目前沒有申請紀錄</p>
    </div>

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

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #666;
  font-size: 18px;
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

  .empty-state {
    padding: 40px 20px;
    font-size: 16px;
  }
}
</style>