<script setup>
// 加入 nextTick
import { ref, nextTick } from 'vue'
import RecordTable from '../components/RecordTable.vue';
import InfoPopup from '@/components/popups/InfoPopup.vue';
import CheckPopup from '@/components/popups/CheckPopup.vue';
import { Record } from "@/api/main.js";

/* 修改模擬資料，加入簽核時間欄位 */
const record = ref([
    {
      id: 1,
      name: '陳胤華',
      type: '學年借用',
      startTime: '2024/9/1',
      endTime: '2025/6/30',
      num: '39',
      state: '審核中',
      // ★ 模擬情境：助教已經簽了，但主任還沒簽 -> 所以還卡在審核中
      assistantTime: '2025/7/1',
      directorTime: ''
    },
    {
      id: 2,
      name: '陳胤華',
      type: '學年借用',
      startTime: '2024/9/1',
      endTime: '2025/6/30',
      num: '39',
      state: '駁回',
      // ★ 模擬情境：可能助教就直接駁回了
      assistantTime: '2025/7/2',
      directorTime: ''
    },
    {
      id: 3,
      name: '陳胤華',
      type: '臨時借用',
      startTime: '2024/9/1',
      endTime: '2025/6/30',
      num: '39',
      state: '借用中',
      // ★ 模擬情境：兩個人都簽了 -> 狀態變借用中
      assistantTime: '2025/8/1',
      directorTime: '2025/8/5',
      returnApplyTime: '2025/6/30', // 模擬申請歸還時間
      returnApproveTime: null             // 模擬還沒通過 (留白)
    }
])

// 彈窗相關變數
const detailModalRef = ref(null);
const modalData = ref([]);
const showCancelCheck = ref(false); // 控制取消確認彈窗
const pendingCancelId = ref(null);  // 暫存準備取消的 ID

function handleCancel(id) {
  const item = record.value.find(r => r.id === id)
  if (item && item.state === '審核中') {
    pendingCancelId.value = id;   // 記住是哪一筆要取消
    showCancelCheck.value = true; // 開啟 CheckPopup 彈窗
  }
}

async function executeCancel() {
  if (!pendingCancelId.value) return;

  // 發送 API 請求到後端
  const result = await Record.postCancel(pendingCancelId.value);

  if (result !== false) {
    // --- 這裡就是你原本的邏輯 ---
    const item = record.value.find(r => r.id === pendingCancelId.value);
    if (item) {
      item.state = '取消申請'; // 只有 API 成功後才改狀態
    }
    // -------------------------
    alert("已成功取消申請");
  } else {
    alert("取消失敗，請檢查網路連線");
  }

  // 關閉彈窗並重置
  showCancelCheck.value = false;
  pendingCancelId.value = null;
}

/* 按下"歸還"按鈕，狀態要變為"歸還中"；按下"取消歸還"按鈕，狀態要變為"借用中" */
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
    // --- 第一列 ---
    { label: '姓名', value: item.name },
    { label: '借用類型', value: item.type },

    // --- 第二列：拆分借用時間 (圖片要求) ---
    { label: '借用時間(起)', value: item.startTime },
    { label: '借用時間(迄)', value: item.endTime },

    // --- 第三列：系櫃編號 & 申請時間 (圖片要求排在一起) ---
    { label: '借用系櫃編號', value: item.num }, // 若你的變數是 cabinet 請改成 item.cabinet
    { label: '申請借用時間', value: '2025/6/30' },

    // --- 第四列：借用理由 (長欄位) ---
    { label: '借用理由', value: '沒有宿舍QAQ沒有宿舍QAQ沒有宿舍QAQ沒有宿舍QAQ沒有宿舍QAQ', isFullRow: true, isBox: true },

    // --- 第五列：審核資訊 ---
    // 左邊：審核時間
    { label: '系辦審核時間', value: item.directorTime || item.assistantTime || '2025/8/5' },
    // 右邊：審核結果
    { label: '系辦審核結果', value: item.state },

    // --- 駁回原因 (如果有) ---
    ...(item.state === '駁回' ? [
        { label: '駁回理由', value: '你明明就有！！！！！！！！！！！！！！！！！！！！！！', isFullRow: true, isBox: true }
    ] : []),

    // --- 歸還資訊 ---
    ...(['歸還中', '已歸還'].includes(item.state) ? [
        { label: '申請歸還時間', value: item.returnApplyTime },
        { label: '系辦審核時間', value: item.returnApproveTime || '' }, // 歸還的審核時間
        // 若需要顯示歸還結果，可加在這裡
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

    <CheckPopup
      v-if="showCancelCheck"
      operation="取消借用申請"
      @confirm="executeCancel"
      @close="showCancelCheck = false"
    />
  </div>
</template>

<style scoped>
.recordWrapper {
  padding-top: 10px; /* 給點空間跟 navbar 分開 */
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
      padding-top: 30px; /* 給點空間跟導航列分開 */
  }

  .record {
      font-size: 24px;
      margin-left: 12px;
  }
}
</style>
