<script setup>
import { ref, nextTick, onMounted } from 'vue'
import RecordTable from '../components/RecordTable.vue';
import InfoPopup from '@/components/popups/InfoPopup.vue';
import CheckPopup from "@/components/popups/CheckPopup.vue";
import { Record } from "@/api/main";
import { useAuthStore } from '@/stores/auth';

const record = ref([])

const detailModalRef = ref(null);
const modalData = ref([]);
const pendingCancelId = ref(null);
const showCancelCheck = ref(false);
const authStore = useAuthStore();

const userId = authStore.user.id;

function handleCancel(id) {
  const item = record.value.find(r => r.id === id);
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
        const rawApproveDate = item.review_date || item.directorTime || item.assistantTime;

        // ★★★ 修正點 1：強化的時間格式化 (含時分秒) ★★★
        const formatDateTime = (val) => {
           if (!val) return "";
           // 先嘗試建立，如果失敗或是字串，嘗試把空白換成 T (解決 Safari 問題)
           let d = new Date(val);
           if (isNaN(d.getTime()) && typeof val === 'string') {
              d = new Date(val.replace(' ', 'T'));
           }
           if (isNaN(d.getTime())) return "";

           const Y = d.getFullYear();
           const M = String(d.getMonth() + 1).padStart(2, '0');
           const D = String(d.getDate()).padStart(2, '0');
           const h = String(d.getHours()).padStart(2, '0');
           const m = String(d.getMinutes()).padStart(2, '0');
           const s = String(d.getSeconds()).padStart(2, '0');
           return `${Y}-${M}-${D} ${h}:${m}:${s}`;
        };

        // ★★★ 修正點 2：強化的日期格式化 (避免時區導致減一天) ★★★
        const formatDate = (val) => {
           if (!val) return "";
           // 如果原本就是 YYYY-MM-DD 格式，直接回傳，不要轉 Date (避免 -1 天)
           if (typeof val === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(val)) {
             return val;
           }

           let d = new Date(val);
           if (isNaN(d.getTime()) && typeof val === 'string') {
              d = new Date(val.replace(' ', 'T'));
           }
           if (isNaN(d.getTime())) return "";

           const Y = d.getFullYear();
           const M = String(d.getMonth() + 1).padStart(2, '0');
           const D = String(d.getDate()).padStart(2, '0');
           return `${Y}-${M}-${D}`;
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
          // 使用修正後的 formatDate
          start_date: rawStart ? formatDate(rawStart) : "無資料",
          end_date: rawEnd ? formatDate(rawEnd) : "無資料",
          // 使用修正後的 formatDateTime
          apply_date: formatDateTime(rawApplyDate),
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
    if (res !== false) {
      record.value = record.value.filter(r => r.id != id);
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

// 這裡保留你原本的 handleReturn，雖然子元件可能不呼叫它，
// 但留著不會報錯，我們主要靠 @refresh 來更新畫面
async function handleReturn(id) {
  const item = record.value.find(r => r.id == id);
  if (!item) return;

  if (item.state === '借用中') {
    try {
      const res = await Record.postReturn(id);
      if (res !== false) {
        item.state = '歸還中';
        alert("歸還成功");
      } else {
        alert("歸還失敗");
      }
    } catch (err) {
      console.error(err);
      alert("系統錯誤");
    }
  } else if (item.state === '歸還中') {
    try {
      const res = await Record.postCancelReturn(id);
      if (res !== false) {
        item.state = '借用中';
        alert("已取消歸還");
      } else {
        alert("取消歸還失敗");
      }
    } catch (err) {
      console.error(err);
      alert("系統錯誤");
    }
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
    { label: '申請借用時間', value: item.apply_date },
    { label: '借用理由', value: item.reason, isFullRow: true, isBox: true },
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
      @refresh="fetchRecords"
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
