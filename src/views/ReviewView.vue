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

import { ref, computed, watch, nextTick, onMounted } from "vue";
import { SsoUser } from "@/api/sso";
import { Record } from "@/api/main";
// 導入新的子組件
import ReviewList from "../components/ReviewList.vue";
import InfoPopup from "@/components/popups/InfoPopup.vue";
import CheckPopup from "../components/popups/CheckPopup.vue";
import RejectModal from "../components/RejectModal.vue";
import { Record } from "@/api/main";


// 定義駁回選項常數，避免在 template 中出現解析錯誤
const rejectOptions = ['資料不完整', '不符規定', '請重新填寫'];

// 彈窗控制
const rejectModal = ref(null);

// 暫存被駁回的 mobile 勾選項目
const pendingRejectIds = ref([]);

function handleRejectSubmit(reason) {
  pendingRejectIds.value.forEach(id => {
    const app = applications.value.find(a => a.id === id);
    if (app && app.status === "審核中") {
      app.status = "已駁回";
      app.rejectReason = reason;
    }
  });

  mobileSelections.value = [];
  executeReject(reason);
}

const selectedType = ref("借用");
const searchName = ref("");
const returnSelections = ref([]);
const mobileSelections = ref([]);

const detailModalRef = ref(null); // 用來綁定彈窗組件
const modalData = ref([]);        // 用來存放轉換後的詳細資料

// 初始化為空陣列,資料將從 API 載入
const applications = ref([]);

const isLoading = ref(true);
const loadError = ref(null);

const borrowTypeFilter = ref("");
const gradeFilter = ref("");
const statusFilter = ref("");

async function getSsoData(uuid) {
  if (!uuid || uuid === "") {
    console.warn("getSsoData: UUID 為空");
    return {
      studentId: "無資料",
      name: "無資料",
      grade: "無資料",
      email: "無資料",
      phone: "無資料"
    };
  }

  try {
    const ssoData = await SsoUser.getGet(uuid);

    console.log("📋 SSO 回傳資料:", ssoData);  // 可以保留 debug

    if (ssoData) {
      return {
        studentId: ssoData.account || "未知學號",
        name: ssoData.name || "未知姓名",
        grade: ssoData.position || "未知年級",
        email: ssoData.primary_email || "無信箱",
        phone: ssoData.phone_number || "無電話"
      };
    }
  } catch (error) {
    console.error(`查詢 SSO 失敗 (UUID: ${uuid}):`, error);
  }

  return {
    studentId: "讀取失敗",
    name: "讀取失敗",
    grade: "讀取失敗",
    email: "讀取失敗",
    phone: "讀取失敗"
  };
}

function convertStatus(record) {
  // 根據不同欄位組合判斷狀態
  if (record.return_accepted === true) {
    return "已歸還";
  }
  if (record.return_available === true && record.return_accepted !== true) {
    return "歸還中";
  }
  if (record.borrow_accepted === true) {
    return "借用中";
  }
  if (record.borrow_accepted === false) {
    return "已駁回";
  }
  if (record.borrow_accepted === null) {
    return "審核中";
  }
  return "未知狀態";
}

function convertBorrowType(temporary) {
  // temporary 是 boolean
  return temporary === true ? "臨時借用" : "學年借用";
}

/**
 * 格式化日期為 YYYY/MM/DD 格式
 */
function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}/${month}/${day}`;
}

/**
 * 從 API 載入所有申請紀錄
 */
async function loadApplications() {
  console.log("開始從 API 載入申請資料...");
  isLoading.value = true;
  loadError.value = null;

  try {
    const apiData = await Record.getAll();

    if (!apiData || !Array.isArray(apiData)) {
      console.error("API 回傳資料格式錯誤");
      loadError.value = "資料格式錯誤";
      return;
    }

    console.log("API 回傳資料筆數:", apiData.length);

    const processedData = await Promise.all(
      apiData.map(async (record, index) => {
      const basicData = {
          id: record.id,
          uuid: record.user_id || "",
          borrowType: convertBorrowType(record.temporary),
          startTime: formatDate(record.start_date),
          endTime: formatDate(record.end_date),
          cabinet: String(record.locker_id || "未分配"),
          status: convertStatus(record),
          rejectReason: record.reject_reason || "",
          applyTime: formatDate(record.apply_date),
          approveTime: formatDate(record.review_date),
          returnApplyTime: formatDate(record.return_available_date),
          returnApproveTime: formatDate(record.return_accepted_date),
          borrowReason: record.reason || ""
        };

        // 取得 SSO 資料（包含學號）
        try {
          const ssoInfo = await getSsoData(basicData.uuid);
          return {
            ...basicData,
            studentId: ssoInfo.student_id || ssoInfo.studentId || "未知", // ✅ 從 SSO 取學號
            name: ssoInfo.name,
            grade: ssoInfo.grade,
            phone: ssoInfo.phone,
            email: ssoInfo.email
          };
        } catch (error) {
          console.warn(`SSO 失敗 (${index}):`, error);
          return {
            ...basicData,
            studentId: "載入失敗",
            name: "載入失敗",
            grade: "",
            phone: "",
            email: ""
          };
        }
      })
    );

    applications.value = processedData;
    console.log("載入完成:", processedData.length, "筆");

    if (processedData.length > 0) {
      console.log("轉換後第一筆:", processedData[0]);
    }

  } catch (error) {
    console.error("載入錯誤:", error);
    loadError.value = error.message || "載入失敗";
  } finally {
    isLoading.value = false;
  }
}
// 頁面載入時執行
onMounted(() => {
  loadApplications();
});

const filteredApplications = computed(() => {
  return applications.value.filter((app) => {
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
      // 借用申請：只顯示審核中
      return (
        app.status === "審核中" &&
        matchName &&
        matchBorrowType &&
        matchGrade &&
        matchStatus
      );
    } else if (selectedType.value === "歸還") {
      // 歸還申請：顯示「歸還中」的紀錄
      return (
        (app.status === "歸還中") &&
        matchName &&
        matchBorrowType &&
        matchGrade &&
        matchStatus
      );
    } else if (selectedType.value === "審核") {
      // 審核紀錄：顯示所有狀態
      return (
        ["審核中", "已駁回", "借用中", "歸還中", "已歸還"].includes(app.status) &&
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

async function executeReturn() {
  if (returnSelections.value.length === 0) return;

  try {
    // 1. 批次發送 API 請求
    const requests = returnSelections.value.map((id) => {
      // 呼叫你剛才寫在 api/main.js 的 Record.postReviewReturn
      return Record.postReviewReturn(id, { return_accepted: true });
    });

    const results = await Promise.all(requests);

    // 2. 根據 API 回傳結果更新 UI
    results.forEach((res, index) => {
      // 假設 res.code === 0 代表後端處理成功
      if (res !== null) {
        const targetId = returnSelections.value[index];
        const app = applications.value.find((a) => a.id === targetId);
        if (app) {
          app.status = "已歸還"; // 狀態一變，filteredApplications 會自動過濾掉它
        }
      }
    });

    alert("歸還審核處理完成");
  } catch (error) {
    console.error("歸還 API 執行出錯:", error);
    alert("系統連線失敗，請稍後再試");
  } finally {
    // 3. 無論成功或失敗都清理狀態
    returnSelections.value = [];
    showReturnModal.value = false;
  }
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
    const app = applications.value.find((a) => a.id === id);
    if (app && app.status === "審核中") {
      app.status = "借用中";
    }
    mobileSelections.value.forEach((id) => {
      const app = applications.value.find((a) => a.id === id);
      if (app && app.status === "審核中") {
        app.status = "借用中";
      }
    });
  } catch (err) {
    console.error("審核通過失敗", err);
  } finally {
    mobileSelections.value = []; // 清空勾選
    showApproveModal.value = false; // 執行完關閉彈窗
  }
}

//申請「駁回」操作確認
const showRejectModal = ref(false);
function openRejectModal() {
  if (mobileSelections.value.length === 0) {
    alert("請先勾選學生");
    return;
  }
  //showRejectModal.value = true; 這是操作確認彈窗，用下面的駁回彈窗替換掉
  pendingRejectIds.value = [...mobileSelections.value];
  rejectModal.value.open();
}

// 真正執行「駁回」邏輯的函式
function executeReject() {
  mobileSelections.value.forEach((id) => {
    const app = applications.value.find((a) => a.id === id);
    if (app && app.status === "審核中") {
      app.status = "已駁回";
    }
    mobileSelections.value.forEach((id) => {
      const app = applications.value.find((a) => a.id === id);
      if (app && app.status === "審核中") {
        app.status = "已駁回";
      }
    });
  } catch (err) {
    console.error("審核駁回失敗", err);
  } finally {
    mobileSelections.value = []; // 清空勾選
    pendingRejectIds.value = [];
  }
}

// 處理子組件發出的 "show-details" 事件
async function handleShowDetails(item) {
  console.log("顯示詳細資訊uuid: ", item.uuid);
  const ssoInfo = await getSsoData(item.uuid);

  // 這裡將 item 資料轉換成彈窗需要的 groups 格式
modalData.value = [
    // --- 申請者資訊 ---
    { label: '學號', value: item.studentId, isFullRow: true },
    { label: '姓名', value: ssoInfo.name },
    { label: '年級', value: ssoInfo.grade },
    { label: '主要電子郵件', value: ssoInfo.email, isFullRow: true },
    { label: '連絡電話', value: ssoInfo.phone },

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
        { label: '駁回理由', value: item.rejectReason || '無', isFullRow: true, isBox: true }
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
