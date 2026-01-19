<script setup>
// 加入 nextTick
import { ref, nextTick, onMounted } from 'vue'
import RecordTable from '../components/RecordTable.vue';
import InfoPopup from '@/components/popups/InfoPopup.vue';
import CheckPopup from "@/components/popups/CheckPopup.vue";
import { Record } from "@/api/main";

const record = ref([])

const detailModalRef = ref(null);
const modalData = ref([]);
const pendingCancelId = ref(null);
const showCancelCheck = ref(false);
const userId = 1;

function handleCancel(id) {
  const item = record.value.find(r => r.id === id);
  // 檢查是否為審核中，符合條件才開啟確認彈窗
  if (item && item.state === '審核中') {
    pendingCancelId.value = id;
    showCancelCheck.value = true;
  }
}

async function fetchRecords() {
  try {
    const data = await Record.getList(userId);

    if (data) {
      // ★ 關鍵修正：將後端資料 (backendItem) 轉換成 前端表格需要的格式
      record.value = data.map(item => ({
        ...item,
        start_date: item.startTime,
        end_date: item.endTime,
        locker_id: item.num,
        temporary: item.type === '臨時借用',

        // 4. 確保 ID 存在
        id: item.id
      }));

      console.log("資料轉換成功:", record.value); // 可以在 F12 檢查轉換後的結果
    }
  } catch (err) {
    console.error("載入紀錄失敗", err);
  }
}

onMounted(() => {
  fetchRecords();
});

async function executeCancel() {
  const id = pendingCancelId.value;
  if (!id) return;

  try {
    const res = await Record.postCancel(id);

    // 成功（即使是 null）
    if (res !== false) {
      // 1. 更新前端狀態（移除 or 改狀態）
      record.value = record.value.filter(r => r.id !== id);
      // 或：
      // const item = record.value.find(r => r.id === id);
      // if (item) item.state = '已取消';

      // 2. 關彈窗
      showCancelCheck.value = false;
      pendingCancelId.value = null;
    } else {
      alert("取消失敗，請稍後再試");
    }
  } catch (err) {
    console.error(err);
    alert("系統錯誤");
  }
}


/* 按下"歸還"按鈕，狀態要變為"歸還中
"；按下"取消歸還"按鈕，狀態要變為"借用中" */
function handleReturn(id) {
  const item = record.value.find(r => r.id === id)
  if (item.state === '借用中') {
    item.state = '歸還中'
  } else if (item.state === '歸還中') {
    item.state = '借用中'
  }
}

function handleShowDetails(id) {
  const item = record.value.find(r => r.id === id);
  if (!item) return;

  console.log("查看詳細資訊:", item);

  modalData.value = [
    { label: '姓名', value: item.name },

    // ★ 修改：這裡要依據 temporary (布林值) 來顯示中文
    { label: '借用類型', value: item.temporary ? '臨時借用' : '學年借用' },

    // ★ 修改：改成讀取轉換後的 start_date 和 end_date
    { label: '借用時間(起)', value: item.start_date },
    { label: '借用時間(迄)', value: item.end_date },

    // ★ 修改：改成讀取轉換後的 locker_id
    { label: '借用系櫃編號', value: item.locker_id },

    // --- 下面這些如果後端有給對應欄位就不用動，如果沒給可能要調整 ---
    { label: '申請借用時間', value: '2025/6/30' },
    { label: '借用理由', value: '沒有宿舍QAQ...', isFullRow: true, isBox: true },

    // 這裡要注意：後端 API 是否真的有回傳 directorTime？如果沒有，這裡會是空的
    { label: '系辦審核時間', value: item.directorTime || item.assistantTime || '' },
    { label: '系辦審核結果', value: item.state || '未知' },

    ...(item.state === '駁回' ? [
        { label: '駁回理由', value: '理由...', isFullRow: true, isBox: true }
    ] : []),

    ...(['歸還中', '已歸還'].includes(item.state) ? [
        { label: '申請歸還時間', value: item.returnApplyTime },
        { label: '系辦審核時間', value: item.returnApproveTime || '' },
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
      @return="handleReturn"
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

  <CheckPopup
    v-if="showCancelCheck"
    operation="取消借用申請"
    @confirm="executeCancel"
    @close="showCancelCheck = false"
  />
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
