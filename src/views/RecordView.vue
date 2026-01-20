<script setup>
// 加入 nextTick
import { ref, nextTick, onMounted } from 'vue'
import RecordTable from '../components/RecordTable.vue';
import InfoPopup from '@/components/popups/InfoPopup.vue';
import CheckPopup from "@/components/popups/CheckPopup.vue";
import { Record } from "@/api/main";
import { useAuthStore } from '@/stores/auth';
import dateFormatter from '@/utils/dateFormatter';

const record = ref([])

const detailModalRef = ref(null);
const modalData = ref([]);
const pendingCancelId = ref(null);
const showCancelCheck = ref(false);
const authStore = useAuthStore();

const userId = authStore.user.id;

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
      record.value = data.map(item => {
        const rawStart = item.start_date || item.startTime || item.begin_time;
        const rawEnd = item.end_date || item.endTime || item.return_time;
        const rawApplyDate = item.created_at || item.create_time || item.apply_time || item.createdAt || new Date();

        // 抓取各種可能的審核時間欄位
        const rawApproveDate = item.review_date || item.directorTime || item.assistantTime;

        // ★ 強制格式化：YYYY-MM-DD HH:mm:ss (中間用空白，絕對沒有 T)
        const formatDateTime = (val) => {
           if (!val) return "";
           const d = new Date(val);
           if (isNaN(d.getTime())) return "";

           const Y = d.getFullYear();
           const M = String(d.getMonth() + 1).padStart(2, '0');
           const D = String(d.getDate()).padStart(2, '0');
           const h = String(d.getHours()).padStart(2, '0');
           const m = String(d.getMinutes()).padStart(2, '0');
           const s = String(d.getSeconds()).padStart(2, '0');

           return `${Y}-${M}-${D} ${h}:${m}:${s}`; // ★ 這裡手動拼接，確保是空白
        };

        // 狀態判斷
        let calculatedState = "審核中";
        if (item.return_accepted === true) calculatedState = "已歸還";
        else if (item.return_available === true) calculatedState = "歸還中";
        else if (item.borrow_accepted === false) calculatedState = "駁回";
        else if (item.borrow_accepted === true) calculatedState = "借用中";

        return {
          ...item,
          state: calculatedState,

          // 1. 維持原樣 (只有日期)
          start_date: rawStart ? dateFormatter(rawStart) : "無資料",
          end_date: rawEnd ? dateFormatter(rawEnd) : "無資料",

          // 2. 申請時間 (去T，有時分秒)
          apply_date: formatDateTime(rawApplyDate),

          // 3. 審核時間 (去T，有時分秒) -> 存成新欄位 formatted_approve_time 供彈窗用
          formatted_approve_time: formatDateTime(rawApproveDate),

          locker_id: String(item.locker_id || item.num || item.lockerNo || item.cabinet_id || "未分配"),
          temporary: (item.type === '臨時借用' || item.temporary === true),
          reason: item.reason || item.borrow_reason || item.description || "無借用理由",
          reject_reason: item.reject_reason || "無駁回理由",
          id: item.id
        };
      });
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

  modalData.value = [
    { label: '借用類型', value: item.temporary ? '臨時借用' : '學年借用' },
    { label: '借用時間(起)', value: item.start_date },
    { label: '借用時間(迄)', value: item.end_date },
    { label: '借用系櫃編號', value: item.locker_id },

    // 申請時間 (已去T)
    { label: '申請借用時間', value: item.apply_date },

    { label: '借用理由', value: item.reason, isFullRow: true, isBox: true },

    // ★ 重點：這裡讀取 formatted_approve_time (已去T)
    { label: '系辦審核時間', value: item.formatted_approve_time },

    { label: '系辦審核結果', value: item.state },

    ...(item.state === '駁回' || item.state === '已駁回' ? [
        { label: '駁回理由', value: item.reject_reason || '未填寫理由', isFullRow: true, isBox: true }
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
