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
      v-if="showReturnModal"
      operation="歸還通過"
      @confirm="executeReturn"
      @close="showReturnModal = false"
    />
  </section>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted } from "vue";
// 請確認路徑是否正確
import { SsoUser } from "@/api/sso";
import { Record } from "@/api/main";
import ReviewList from "../components/ReviewList.vue";
import InfoPopup from "@/components/popups/InfoPopup.vue";
import CheckPopup from "../components/popups/CheckPopup.vue";
import RejectModal from "../components/RejectModal.vue";

// --- 狀態變數 ---
const selectedType = ref("借用");
const searchName = ref("");
const returnSelections = ref([]); // 歸還列表的勾選 ID
const mobileSelections = ref([]); // 借用列表的勾選 ID (變數名稱保留 mobileSelections 以配合你的原代碼)

const detailModalRef = ref(null);
const modalData = ref([]);
const applications = ref([]);
const isLoading = ref(true);
const loadError = ref(null);

// 篩選器
const borrowTypeFilter = ref("");
const gradeFilter = ref("");
const statusFilter = ref("");

// 手機版偵測
const isMobile = ref(window.innerWidth <= 865);
window.addEventListener("resize", () => {
  isMobile.value = window.innerWidth <= 865;
});

// --- 載入資料邏輯 ---

async function getSsoData(uuid) {
  if (!uuid) return { name: "未知", grade: "未知", email: "", phone: "" };
  try {
    const ssoData = await SsoUser.getGet(uuid);
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
  return { name: "讀取失敗", grade: "讀取失敗", email: "", phone: "" };
}

function convertStatus(record) {
  if (record.return_accepted === true) return "已歸還";
  if (record.return_available === true && record.return_accepted !== true) return "歸還中";
  if (record.borrow_accepted === true) return "借用中";
  if (record.borrow_accepted === false) return "已駁回";
  if (record.borrow_accepted === null) return "審核中";
  return "未知狀態";
}

function convertBorrowType(temporary) {
  return temporary === true ? "臨時借用" : "學年借用";
}

function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}/${month}/${day}`;
}

async function loadApplications() {
  isLoading.value = true;
  loadError.value = null;
  try {
    const apiData = await Record.getAll();
    if (!Array.isArray(apiData)) throw new Error("資料格式錯誤");

    const processedData = await Promise.all(
      apiData.sort(
        (r1, r2) => new Date(r1.apply_date) - new Date(r2.apply_date)
      ).map(async (record) => {
        const basicData = {
          id: record.id,
          uuid: record.user_id || "",
          borrowType: convertBorrowType(record.temporary),

          // --- 修正重點：API 回傳的是 start_time，這裡做相容處理 ---
          startTime: formatDate(record.start_time || record.start_date),
          endTime: formatDate(record.end_time || record.end_date),
          // ----------------------------------------------------

          cabinet: String(record.locker_id || "未分配"),
          status: convertStatus(record),
          rejectReason: record.reject_reason || "",

          // 將後端日期格式化存入，供詳細視窗使用
          applyTime: formatDate(record.apply_date),
          approveTime: formatDate(record.review_date),
          returnApplyTime: formatDate(record.return_available_date),
          returnApproveTime: formatDate(record.return_accepted_date),
          borrowReason: record.reason || ""
        };

        const ssoInfo = await getSsoData(basicData.uuid);
        return {
          ...basicData,
          studentId: ssoInfo.studentId || "未知",
          name: ssoInfo.name,
          grade: ssoInfo.grade,
          phone: ssoInfo.phone,
          email: ssoInfo.email
        };
      })
    );
    applications.value = processedData;
  } catch (error) {
    console.error("載入錯誤:", error);
    loadError.value = error.message;
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  loadApplications();
});

// --- 計算屬性：篩選 ---
const filteredApplications = computed(() => {
  return applications.value.filter((app) => {
    const matchName =
      app.name.includes(searchName.value) ||
      (app.studentId && app.studentId.includes(searchName.value));
    const matchBorrowType =
      borrowTypeFilter.value === "" || app.borrowType === borrowTypeFilter.value;
    const matchGrade =
      gradeFilter.value === "" || app.grade === gradeFilter.value;
    const matchStatus =
      statusFilter.value === "" || app.status === statusFilter.value;

    if (selectedType.value === "借用") {
      // 借用申請頁面：只顯示審核中
      return app.status === "審核中" && matchName && matchBorrowType && matchGrade && matchStatus;
    } else if (selectedType.value === "歸還") {
      // 歸還申請頁面：顯示歸還中
      return app.status === "歸還中" && matchName && matchBorrowType && matchGrade && matchStatus;
    } else {
      // 紀錄頁面
      return matchName && matchBorrowType && matchGrade && matchStatus;
    }
  });
});

// ==========================================
// 1. 歸還通過邏輯 (Return Approve)
// ==========================================
const showReturnModal = ref(false);

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
    // API 呼叫：傳送 { return_accepted: true }
    const requests = returnSelections.value.map((id) => {
      return Record.postReviewReturn(id, { return_accepted: true });
    });

    await Promise.all(requests);

    // 前端更新狀態 (不必重整頁面)
    returnSelections.value.forEach((id) => {
      const app = applications.value.find((a) => a.id === id);
      if (app) {
        app.status = "已歸還";
      }
    });

    alert("歸還審核處理完成");
  } catch (error) {
    console.error("歸還 API 執行出錯:", error);
    alert("系統連線失敗，請稍後再試");
  } finally {
    returnSelections.value = []; // 清空勾選
    showReturnModal.value = false;
  }
}

// ==========================================
// 2. 借用通過邏輯 (Borrow Approve)
// ==========================================
const showApproveModal = ref(false);

function openApproveModal() {
  if (mobileSelections.value.length === 0) {
    alert("請先勾選學生");
    return;
  }
  showApproveModal.value = true;
}

async function executeApprove() {
  if (mobileSelections.value.length === 0) return;

  try {
    // API 呼叫：第二參數 true 代表通過
    const requests = mobileSelections.value.map((id) => {
      return Record.postReviewBorrow(id, true);
    });

    await Promise.all(requests);

    // 前端更新狀態
    mobileSelections.value.forEach((id) => {
      const app = applications.value.find((a) => a.id === id);
      if (app) {
        app.status = "借用中";
      }
    });

    alert("審核通過成功");
  } catch (error) {
    console.error("審核 API 執行失敗:", error);
    alert("系統連線失敗，請稍後再試");
  } finally {
    mobileSelections.value = []; // 清空勾選
    showApproveModal.value = false;
  }
}

// ==========================================
// 3. 借用駁回邏輯 (Borrow Reject)
// ==========================================
const rejectModal = ref(null);
const pendingRejectIds = ref([]);
const rejectOptions = ['資料不完整', '不符規定', '請重新填寫'];

function openRejectModal() {
  if (mobileSelections.value.length === 0) {
    alert("請先勾選學生");
    return;
  }
  // 暫存要駁回的 ID，避免 Modal 打開過程中勾選狀態遺失
  pendingRejectIds.value = [...mobileSelections.value];

  // 打開 RejectModal (假設組件有 expose open 方法)
  if (rejectModal.value && typeof rejectModal.value.open === 'function') {
    rejectModal.value.open();
  } else {
    console.error("無法開啟駁回彈窗，請檢查 RejectModal 組件是否 expose 'open'");
  }
}

async function handleRejectSubmit(reason) {
  if (pendingRejectIds.value.length === 0) return;

  try {
    // API 呼叫：false 代表駁回，並帶入 reason
    const requests = pendingRejectIds.value.map((id) => {
      return Record.postReviewBorrow(id, false, reason);
    });

    await Promise.all(requests);

    // 前端更新狀態
    pendingRejectIds.value.forEach(id => {
      const app = applications.value.find(a => a.id === id);
      if (app) {
        app.status = "已駁回";
        app.rejectReason = reason;
      }
    });

    alert("已駁回申請");

    // 關閉 Modal
    if (rejectModal.value && typeof rejectModal.value.close === 'function') {
      rejectModal.value.close();
    }
  } catch (error) {
    console.error("駁回 API 執行失敗:", error);
    alert("系統連線失敗，請稍後再試");
  } finally {
    mobileSelections.value = [];
    pendingRejectIds.value = [];
  }
}

// ==========================================
// 詳細資訊邏輯
// ==========================================
// 詳細資訊邏輯
// 詳細資訊邏輯
async function handleShowDetails(item) {
  // 共用欄位 (上方基本資料)
  const commonFields = [
    { label: '學號', value: item.studentId, isFullRow: true },
    { label: '姓名', value: item.name },
    { label: '年級', value: item.grade },
    { label: '電子郵件', value: item.email, isFullRow: true },
    { label: '連絡電話', value: item.phone },
    { label: '借用類型', value: item.borrowType },
    { label: '借用期間', value: `${item.startTime} ~ ${item.endTime}`, isFullRow: true },
    { label: '系櫃編號', value: item.cabinet },
    { label: '借用理由', value: item.borrowReason || '無', isFullRow: true, isBox: true },
  ];

  if (item.status === '已歸還') {
    // ==============================================
    // 情況 A：已歸還 (借用與歸還皆完成)
    // ==============================================
    modalData.value = [
      ...commonFields,
      // --- 階段一：借用 ---
      { label: '申請借用時間', value: item.applyTime },
      { label: '系辦審核時間', value: item.approveTime },
      { label: '系辦審核結果', value: '已歸還' },

      // --- 階段二：歸還 ---
      { label: '申請歸還時間', value: item.returnApplyTime },
      { label: '系辦審核時間', value: item.returnApproveTime },
      { label: '系辦審核結果', value: '通過' }
    ];

  } else if (item.status === '歸還中') {
    // ==============================================
    // 情況 B：歸還中 (借用完成，等待歸還審核)
    // ==============================================
    modalData.value = [
      ...commonFields,
      // --- 階段一：借用 ---
      { label: '申請借用時間', value: item.applyTime },
      { label: '系辦審核時間', value: item.approveTime },
      { label: '系辦審核結果', value: '歸還中' },

      // --- 階段二：歸還 (等待審核) ---
      { label: '申請歸還時間', value: item.returnApplyTime },
      { label: '系辦審核時間', value: '' },       // 尚未審核，故為空
      { label: '系辦審核結果', value: '審核中' }
    ];

  } else {
    // ==============================================
    // 情況 C：審核中 / 借用中 / 已駁回
    // ==============================================

    // 邏輯判斷：
    // 1. 如果是「審核中」，審核時間應該是空的。
    // 2. 如果是「借用中」或「已駁回」，因為已經審核過了，所以會有審核時間。
    const reviewTime = item.status === '審核中' ? '' : item.approveTime;

    modalData.value = [
      ...commonFields,
      { label: '申請借用時間', value: item.applyTime },
      { label: '系辦審核時間', value: reviewTime },
      { label: '系辦審核結果', value: item.status },
    ];

    // 如果是「已駁回」，額外顯示駁回理由
    if (item.status === '已駁回') {
      modalData.value.push({
        label: '駁回理由',
        value: item.rejectReason || '無',
        isFullRow: true,
        isBox: true
      });
    }
  }

  nextTick(() => {
    if (detailModalRef.value) detailModalRef.value.open();
  });
}

// 切換 Tab 時重置勾選狀態
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
