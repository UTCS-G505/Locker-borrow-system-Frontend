<script setup>
// 加入 nextTick
import { ref, nextTick, onMounted } from 'vue'
import RecordTable from '../components/RecordTable.vue';
import InfoPopup from '@/components/popups/InfoPopup.vue';
import CheckPopup from "@/components/popups/CheckPopup.vue";
import { Record } from "@/api/main";
import { useAuthStore } from '@/stores/auth';
import { SsoUser } from "@/api/sso";

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
      // 1. 先在 Console 印出原始資料，方便除錯
      let realName = "同學";
      if (data.length > 0) {
        console.log("🔥 RecordView 後端原始資料:", data[0]);
      }
      const userInfo = await SsoUser.getGet(userId)
      if (userInfo) {
          // 嘗試抓取各種可能的姓名欄位
          realName = userInfo.name || userInfo.cname || userInfo.chinese_name || userInfo.user_name || "同學";
        }

      // 2. 資料轉換 (Mapping)
      record.value = data.map(item => ({
        ...item,

        // ▼▼▼▼▼ 修正重點：同時抓多種可能的欄位名稱 ▼▼▼▼▼
        name: realName,
        // 抓取開始時間 (優先抓 start_date, 沒有就抓 startTime...)
        start_date: item.start_date || item.startTime || item.begin_time || "無資料",

        // 抓取結束時間
        end_date: item.end_date || item.endTime || item.return_time || "無資料",

        // 抓取系櫃編號 (優先抓 locker_id, 沒有就抓 num 或 lockerNo)
        locker_id: String(item.locker_id || item.num || item.lockerNo || item.cabinet_id || "未分配"),

        // 抓取借用類型 (判斷字串或布林值)
        temporary: (item.type === '臨時借用' || item.temporary === true),

        reason: item.reason || item.borrow_reason || item.description || "無借用理由",
        // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲

        id: item.id
      }));

      console.log("✅ 資料轉換成功:", record.value);
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
    { label: '借用理由', value: item.reason, isFullRow: true, isBox: true },

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
