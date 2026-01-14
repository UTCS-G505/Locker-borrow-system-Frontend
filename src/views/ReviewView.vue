<template>
  <section class="upboard">
    <div v-if="isMobile" class="mobile-ops">
      <div class="mobile-header-row">
        <div class="mobile-header-top">
          <h1>審核申請</h1>

          <div class="select-wrapper">
            <select v-model="selectedType" class="dropdown">
              <option value="借用">借用申請</option>
              <option value="歸還">歸還申請</option>
              <option value="審核">審核紀錄</option>
            </select>
          </div>
        </div>
        <div class="mobile-header-bottom">
          <button class="btn" @click="openApproveModal" v-if="selectedType === '借用'">
            通過
          </button>
          <button class="btn" @click="openRejectModal" v-if="selectedType === '借用'">
            駁回
          </button>
          <button
            class="topbutton"
            v-if="selectedType === '歸還'"
            @click="openReturnModal"
          >
            通過
          </button>
        </div>
      </div>

      <input
        type="text"
        v-model="searchName"
        placeholder="搜尋"
        class="mobile-search search-input"
      />
    </div>

    <div class="header-bar" v-else>
      <div class="left">
        <h1>審核申請</h1>
        <div class="controls">
          <div class="select-wrapper">
            <select v-model="selectedType" class="dropdown">
              <option value="借用">借用申請</option>
              <option value="歸還">歸還申請</option>
              <option value="審核">審核紀錄</option>
            </select>
          </div>
          <input
            type="text"
            v-model="searchName"
            placeholder="搜尋"
            class="search-input"
          />
        </div>
      </div>
      <div class="right">
        <button class="btn" @click="openApproveModal" v-if="selectedType === '借用'">
          通過
        </button>
        <button class="btn" @click="openRejectModal" v-if="selectedType === '借用'">
          駁回
        </button>
        <button
          class="topbutton"
          v-if="selectedType === '歸還'"
          @click="openReturnModal"
        >
          通過
        </button>
      </div>
    </div>

    <ReviewList
      :applications="filteredApplications"
      :selected-type="selectedType"
      v-model:mobile-selections="mobileSelections"
      v-model:return-selections="returnSelections"
      v-model:grade-filter="gradeFilter"
      v-model:borrow-type-filter="borrowTypeFilter"
      v-model:status-filter="statusFilter"
      @show-details="handleShowDetails"
    />

    <RejectModal
      ref="rejectModal"
      :quick-options="rejectOptions"
      @submit="handleRejectSubmit"
    />

    <InfoPopup
      ref="detailModalRef"
      title="詳細資訊"
      :fields="modalData"
    />
    <CheckPopup 
      v-if="showApproveModal" 
      operation="借用審核通過" 
      @confirm="executeApprove" 
      @close="showApproveModal = false" 
    />

    <CheckPopup 
      v-if="showRejectModal" 
      operation="借用審核駁回" 
      @confirm="executeReject" 
      @close="showRejectModal = false" 
    />

    <CheckPopup 
      v-if="showReturnModal" 
      operation="歸還通過" 
      @confirm="executeReturn" 
      @close="showReturnModal = false" 
    />
  </section>
</template>

<script setup>
//加入nextTick
import { ref, reactive, computed, watch, nextTick } from "vue";
//import { SsoAuth, SsoUser } from "@/api/sso";
// 導入新的子組件
import ReviewList from "../components/ReviewList.vue";
import InfoPopup from "@/components/popups/InfoPopup.vue";
import CheckPopup from "../components/popups/CheckPopup.vue";
import RejectModal from "../components/RejectModal.vue";

// 定義駁回選項常數，避免在 template 中出現解析錯誤
const rejectOptions = ['資料不完整', '不符規定', '請重新填寫'];

// 彈窗控制
const rejectModal = ref(null);

// 暫存被駁回的 mobile 勾選項目
const pendingRejectIds = ref([]);

// function rejectMobile() {
//   if (mobileSelections.value.length === 0) {
//     alert("請先選擇至少一筆要駁回的資料");
//     return;
//   }

//   pendingRejectIds.value = [...mobileSelections.value];
//   rejectModal.value.open();
// }

function handleRejectSubmit(reason) {
  pendingRejectIds.value.forEach(id => {
    const app = applications.find(a => a.id === id);
    if (app && app.status === "審核中") {
      app.status = "已駁回";
      app.rejectReason = reason;
    }
  });

  mobileSelections.value = [];
  pendingRejectIds.value = [];
}

const selectedType = ref("借用");
const searchName = ref("");
const returnSelections = ref([]);
const mobileSelections = ref([]);

const detailModalRef = ref(null); // 用來綁定彈窗組件
const modalData = ref([]);        // 用來存放轉換後的詳細資料

const applications = reactive([
  {
    id: 1,
    studentId: "U11316050",
    name: "王小明",
    grade: "大四",
    phone: "0912345678",
    email: "wang.min@example.com",
    borrowType: "學年借用",
    startTime: "2024/09/01",
    endTime: "2025/06/30",
    cabinet: "31",
    status: "審核中",
  },
  {
    id: 2,
    studentId: "U11316051",
    name: "李小美",
    grade: "大一",
    phone: "0922333444",
    email: "may.lee@example.com",
    borrowType: "臨時借用",
    startTime: "2025/07/23",
    endTime: "2025/07/23",
    cabinet: "35",
    status: "已駁回",
  },
  {
    id: 3,
    studentId: "U11316052",
    name: "張大明",
    grade: "大二",
    phone: "0933444555",
    email: "chang.big@example.com",
    borrowType: "學年借用",
    startTime: "2024/09/01",
    endTime: "2025/06/30",
    cabinet: "36",
    status: "借用中",
  },
  {
    id: 4,
    studentId: "U11316054",
    name: "王中明",
    grade: "大一",
    phone: "0944555666",
    email: "wang.mid@example.com",
    borrowType: "學年借用",
    startTime: "2024/09/01",
    endTime: "2025/06/30",
    cabinet: "20",
    status: "審核中",
  },
  {
    id: 5,
    studentId: "U11316055",
    name: "王大明",
    grade: "大一",
    phone: "0955666777",
    email: "wang.big@example.com",
    borrowType: "臨時借用",
    startTime: "2024/09/01",
    endTime: "2025/06/30",
    cabinet: "21",
    status: "審核中",
  },
]);

const borrowTypeFilter = ref("");
const gradeFilter = ref("");
const statusFilter = ref("");

const filteredApplications = computed(() => {
  return applications.filter((app) => {
    const matchName =
      app.name.includes(searchName.value) ||
      app.studentId.includes(searchName.value);
    const matchBorrowType =
      borrowTypeFilter.value === "" || app.borrowType === borrowTypeFilter.value;
    const matchGrade =
      gradeFilter.value === "" || app.grade === gradeFilter.value;
    const matchStatus =
      statusFilter.value === "" || app.status === statusFilter.value;

    if (selectedType.value === "借用") {
      return (
        app.status === "審核中" &&
        matchName &&
        matchBorrowType &&
        matchGrade &&
        matchStatus
      );
    } else if (selectedType.value === "歸還") {
      return (
        app.status === "借用中" &&
        matchName &&
        matchBorrowType &&
        matchGrade &&
        matchStatus
      );
    } else if (selectedType.value === "審核") {
      return (
        ["審核中", "已駁回", "借用中", "已歸還"].includes(app.status) &&
        matchName &&
        matchBorrowType &&
        matchGrade &&
        matchStatus
      );
    }
    return false;
  });
});


// 歸還「通過」操作確認
const showReturnModal = ref(false);

//打開歸還彈窗的函式
function openReturnModal() {
  if (returnSelections.value.length === 0) {
    alert("請先勾選學生");
    return;
  }
  showReturnModal.value = true;
}
// 真正執行「通過」邏輯的函式 
function executeReturn() {
  returnSelections.value.forEach((id) => {
    const app = applications.find((a) => a.id === id);
    // 邏輯：如果是借用中，改成已歸還
    if (app && app.status === "借用中") {
      app.status = "已歸還";
    }
  });
  returnSelections.value = []; // 清空勾選
  showReturnModal.value = false; // 關閉彈窗
}

// isMobile 判斷
const isMobile = ref(window.innerWidth <= 865);
window.addEventListener("resize", () => {
  const w = window.innerWidth;
  isMobile.value = w <= 865;
});

// 申請「通過」操作確認
const showApproveModal = ref(false);
function openApproveModal() {
  if (mobileSelections.value.length === 0) {
    alert("請先勾選學生");
    return;
  }
  showApproveModal.value = true;
}

// 真正執行「通過」邏輯的函式 
function executeApprove() {
  mobileSelections.value.forEach((id) => {
    const app = applications.find((a) => a.id === id);
    if (app && app.status === "審核中") {
      app.status = "借用中";
    }
  });
  mobileSelections.value = []; // 清空勾選
  showApproveModal.value = false; // 執行完關閉彈窗
}

//申請「駁回」操作確認
const showRejectModal = ref(false);
function openRejectModal() {
  if (mobileSelections.value.length === 0) {
    alert("請先勾選學生");
    return;
  }
  showRejectModal.value = true;
}

// 真正執行「駁回」邏輯的函式 
function executeReject() {
  mobileSelections.value.forEach((id) => {
    const app = applications.find((a) => a.id === id);
    if (app && app.status === "審核中") {
      app.status = "已駁回";
    }
  });
  mobileSelections.value = []; // 清空勾選
  showRejectModal.value = false; // 執行完關閉彈窗
}





// 處理子組件發出的 "show-details" 事件
function handleShowDetails(item) {
  console.log("顯示詳細資訊: ", item);
  
  // 這裡將 item 資料轉換成彈窗需要的 groups 格式
modalData.value = [
    // --- 申請者資訊 ---
    { label: '姓名', value: item.name },
    { label: '年級', value: item.grade },
    { label: '主要電子郵件', value: item.email, isFullRow: true },
    { label: '連絡電話', value: item.phone },

    // --- 借用資訊 ---
    { label: '借用類型', value: item.borrowType },
    // 合併起訖時間，因為較長建議給整行，或視情況拿掉 isFullRow
    { label: '借用時間起/迄', value: `${item.startTime} ~ ${item.endTime}`, isFullRow: true },
    { label: '借用系櫃編號', value: item.cabinet },
    
    { label: '借用理由', value: '沒有宿舍ＱＡＱ', isFullRow: true, isBox: true },
    
    // 以下補足截圖要求的欄位 (若 item 裡還沒這欄位，暫時用 item.applyTime 代替或寫死)
    { label: '申請借用時間', value: '2025/06/30' }, 
    { label: '系辦審核時間', value: item.approveTime || '' }, // 假設你有審核時間變數
    { label: '系辦審核結果', value: item.status },

    // 駁回理由
    ...(item.status === '已駁回' ? [
        { label: '駁回理由', value: '資料不符', isFullRow: true, isBox: true }
    ] : []),

    // --- 歸還資訊 (邏輯與之前相同，視狀態顯示) ---
    ...(['歸還中', '已歸還'].includes(item.status) ? [
        { 
          label: '申請歸還時間', 
          value: item.returnApplyTime 
        },
        { 
          label: '系辦審核時間', 
          value: item.returnApproveTime 
        },
        { 
          label: '系辦審核結果', 
          value: item.status === '已歸還' ? '通過' : '審核中' 
        }
    ] : [])
];

  // 打開彈窗 (確保 DOM 更新後再執行)
  nextTick(() => {
    if (detailModalRef.value) {
      detailModalRef.value.open();
    }
  });
}

// 當切換頁面時重置所有過濾器與勾選
watch(selectedType, () => {
  searchName.value = "";
  borrowTypeFilter.value = "";
  gradeFilter.value = "";
  statusFilter.value = "";
  returnSelections.value = [];
  mobileSelections.value = [];
});
</script>

<style scoped>
/* 樣式保持不變 */
html,
body {
  margin: 0;
  padding: 0;
}
.upboard {
  background: transparent;
  border: none;
  box-shadow: none;
  margin: 0;
  padding: 0;
}
.header-bar h1 {
  font-size: 30px;
  color: black;
  margin: 0;
  margin-left: 15px;
}

.header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px 20px 0 20px;
  margin: 0 auto;
}
.left {
  display: flex;
  flex-wrap: wrap;
  gap: 35px;
  justify-content: space-between;
  align-items: center;
}
.right {
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: flex-end;
}
.topbutton {
  display: block;
  padding: 3px 30px;
  border-radius: 12px;
  cursor: pointer;
  background-color: white;
  color: black;
  border: 1px solid #ccc;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  height: 36px;
}

button {
  display: block;
  margin: 0 auto;
  padding: 6px 12px;
  border-radius: 12px;
  cursor: pointer;
  background-color: white;
  color: black;
  font-size: 18px;
}

button:hover {
  background-color: #eee;
}
.controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}
.controls select,
.controls input {
  padding: 6px;
  border-radius: 4px;
  border: 1px solid #ccc;
}
.search-input {
  width: 200px;
  font-size: 16px;
}

select {
  background-color: white;
  color: black;
  border: 1px solid black;
  padding: 6px 10px;
  border-radius: 20px;
  max-width: 180px;
  width: 100%;
  min-width: 80px;
  box-sizing: border-box;
}

input[type="text"] {
  background-color: white;
  color: black;
  padding: 6px 10px;
  border-radius: 10px;
  height: 36px;
}
.search-input {
  background-image: url("data:image/svg+xml;utf8,<svg fill='gray' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path d='M10 2a8 8 0 105.293 14.293l5.707 5.707 1.414-1.414-5.707-5.707A8 8 0 0010 2zm0 2a6 6 0 110 12 6 6 0 010-12z'/></svg>");
  background-repeat: no-repeat;
  background-position: right 8px center;
  background-size: 16px 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-left: 5px;
}
.search-input:hover {
  background-color: #eee;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.select-wrapper {
  display: inline-block;
  position: relative;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: white;
}

.select-wrapper .dropdown {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  border: 1px solid #ccc;
  width: 150px;
  height: 36px;
  padding: 0 30px 0 10px;
  border-radius: 12px;
  background: white;
  font-size: 16px;
  cursor: pointer;
}

.select-wrapper::after {
  content: "▼";
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: gray;
}
.dropdown option {
  font-size: 14px;
}

.select-all-text {
  cursor: pointer;
  user-select: none;
  color: black;
  font-weight: 600;
}

.btn {
  padding: 3px 30px;
  border-radius: 12px;
  cursor: pointer;
  background-color: white;
  color: black;
  border: 1px solid #ccc;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  flex-shrink: 0;
  height: 36px;
}

/* ✅ 手機版樣式 */
@media screen and (max-width: 865px) {
  .mobile-ops {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin: 0;
    padding: 10px;
    padding: 0 20px;
    border-radius: 8px;
  }
  /* 手機版：水平排列 */
  .mobile-header-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-start; /* 初始同一行靠左 */
    gap: 10px;
  }
  .mobile-header-top {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    justify-content: space-between; /* 標題與下拉 right 對齊 */
    gap: 10px;
  }

  .mobile-header-bottom {
    display: flex;
    align-items: center;
    justify-content: flex-start; /* 按鈕靠左 */
    gap: 10px;
  }
  .mobile-header-row h1 {
    flex-shrink: 0;
    font-size: 30px;
    margin: 0;
    color: black;
  }
  .mobile-header-row select {
    flex-grow: 1;
    min-width: 180px;
    max-width: 100%;
    width: 100%;
    padding: 6px 8px;
    border-radius: 14px;
    border: 1px solid black;
  }
  .btn {
    padding: 3px 30px;
    border-radius: 12px;
    cursor: pointer;
    background-color: white;
    color: black;
    border: 1px solid #ccc;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: all 0.2s ease;
    flex-shrink: 0;
    height: 36px;
  }

  .mobile-search {
    margin-top: 10px;
    margin-left: 0;
    padding-left: 10px;
    padding: 8px;
    border-radius: 6px;
    border: 1px solid #ccc;
    box-sizing: border-box;
    font-size: 14px;
  }
  .search-input {
    width: 100%;
    background-image: url("data:image/svg+xml;utf8,<svg fill='gray' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path d='M10 2a8 8 0 105.293 14.293l5.707 5.707 1.414-1.414-5.707-5.707A8 8 0 0010 2zm0 2a6 6 0 110 12 6 6 0 010-12z'/></svg>");
    background-repeat: no-repeat;
    background-position: right 8px center;
    background-size: 16px 16px;
  }
}

@media screen and (max-width: 640px) {
  .mobile-header-row h1 {
    font-size: 24px;
  }
}
</style>