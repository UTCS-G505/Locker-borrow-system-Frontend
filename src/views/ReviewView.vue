<template>
  <section class="upboard">
  <!-- 手機版操作列 -->
  <div v-if="isMobile" class="mobile-ops">
    <div class="mobile-header-row">
      <h1>審核申請</h1>

      <!-- 下拉式表單 -->
          <select v-model="selectedType" class="dropdown">
            <option value="借用">借用申請</option>
            <option value="歸還">歸還申請</option>
            <option value="審核">審核紀錄</option>
          </select>
      <!-- 按鈕 -->
      <button class="btn" @click="approveMobile"  v-if="selectedType === '借用'">通過</button>
      <button class="btn" @click="rejectMobile"  v-if="selectedType === '借用'">駁回</button>
      <button
          class="topbutton"
          v-if="selectedType === '歸還'"
          @click="submitReturnConfirmations"
        >
          送出
        </button>
        <div class="action-buttons">
          <button @click="exportUsage" v-if="selectedType === '審核'" class="font-bold text-black">使用紀錄匯出</button>
          <button @click="visualizeUsage" v-if="selectedType === '審核'" class="font-bold text-black">使用概況圖匯出</button>
        </div>
    </div>

    <!-- 搜尋欄 -->
    <input
            type="text"
            v-model="searchName"
            placeholder="搜尋申請人姓名"
             class="search-input mobile-search"
    />
  </div>

    <!-- 上方控制列 -->
    <div class="header-bar" v-else>
      <div class="left">
        <h1>審核申請</h1>
        <div class="controls">
          <select v-model="selectedType">
            <option value="借用">借用申請</option>
            <option value="歸還">歸還申請</option>
            <option value="審核">審核紀錄</option>
          </select>
          <input
            type="text"
            v-model="searchName"
            placeholder="搜尋申請人姓名"
            class="search-input"
          />
        </div>
        <div class="action-buttons">
          <button @click="exportUsage" v-if="selectedType === '審核'">使用紀錄匯出</button>
          <button @click="visualizeUsage" v-if="selectedType === '審核'">使用概況圖匯出</button>
        </div>
        <button
          class="topbutton"
          v-if="selectedType === '借用'"
          @click="submitApprovals"
        >
          送出
        </button>
        <button
          class="topbutton"
          v-if="selectedType === '歸還'"
          @click="submitReturnConfirmations"
        >
          送出
        </button>
      </div>
    </div>

    <!-- 表格 -->
    <div class="review-list">
      <table>
        <thead>
          <tr>
            <th>申請人學號</th>
            <th>申請人</th>
            <th>
              <select v-model="gradeFilter" class="dropdown2">
              <option value="">全部</option>
              <option value="大一">大一</option>
              <option value="大二">大二</option>
              <option value="大三">大三</option>
              <option value="大四">大四</option>
            </select>
            </th>
            <th>
              <select v-model="borrowTypeFilter" class="dropdown2">
                <option value="">全部</option>
                <option value="學年借用">學年借用</option>
                <option value="臨時借用">臨時借用</option>
              </select>
            </th>
            <th>開始時間</th>
            <th>結束時間</th>
            <th>系櫃編號</th>
            <th>詳細資訊</th>
            <th v-if="selectedType === '借用' && !isMobile">駁回</th>
            <th v-if="selectedType === '借用' && !isMobile">通過</th>
            <th v-if="selectedType === '歸還'">確認歸還</th>
            <th v-if="selectedType === '審核'">
              <select v-model="statusFilter" class="dropdown2">
                <option value="">全部</option>
                <option value="審核中">審核中</option>
                <option value="駁回">駁回</option>
                <option value="借用中">借用中</option>
                <option value="已歸還">已歸還</option>
              </select>
            </th>
            <th v-if="isMobile&&selectedType=='借用'">選擇</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="item in filteredApplications" :key="item.id">
            <tr>
              <td>{{ item.studentId }}</td>
              <td>{{ item.name }}</td>
              <td>{{ item.grade }}</td>
              <td>{{ item.borrowType }}</td>
              <td>{{ item.startTime }}</td>
              <td>{{ item.endTime }}</td>
              <td>{{ item.cabinet }}</td>
              <td><button class="info" @click="">詳細資訊</button></td>
              <td v-if="selectedType === '借用' && !isMobile">
                <button class="info" @click="rejectApplication(item)" >駁回</button>
              </td>
              <td v-if="selectedType === '借用' && !isMobile">
                <label class="custom-checkbox">
                  <input type="checkbox" v-model="approvalSelections" :value="item.id" />
                  <span></span>
                </label>
              </td>
              <td v-if="selectedType === '歸還'">
                <label class="custom-checkbox">
                  <input type="checkbox" v-model="returnSelections" :value="item.id" />
                  <span></span>
                </label>
              </td>
              <td v-if="selectedType === '審核'">
                <span class="status-tag" :class="statusColor(item.status)">
                  {{ item.status }}
                </span>
              </td>
              <td v-if="isMobile && selectedType === '借用'">
                <label class="custom-checkbox">
                  <input type="checkbox" :value="item.id" v-model="mobileSelections" />
                  <span></span>
                </label>
              </td>

            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup>
import { ref, reactive, computed } from "vue";

const selectedType = ref("借用");
const searchName = ref("");
const approvalSelections = ref([]);

const returnSelections = ref([]);
const applications = reactive([
  {
    id: 1,
    studentId: "U11316050",
    name: "王小明",
    grade: "大四",
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
    borrowType: "臨時借用",
    startTime: "2025/07/23",
    endTime: "2025/07/23",
    cabinet: "35",
    status: "駁回",
  },
  {
    id: 3,
    studentId: "U11316052",
    name: "張大明",
    grade: "大二",
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
    borrowType: "臨時借用",
    startTime: "2024/09/01",
    endTime: "2025/06/30",
    cabinet: "21",
    status: "審核中",
  },
]);
const borrowTypeFilter = ref("");
const gradeFilter = ref("");
const statusFilter = ref('');
const filteredApplications = computed(() => {
  return applications.filter((app) => {
    const matchName = app.name.includes(searchName.value);
    const matchBorrowType = borrowTypeFilter.value === "" || app.borrowType === borrowTypeFilter.value;
    const matchGrade = gradeFilter.value === "" || app.grade === gradeFilter.value;
    const matchStatus = statusFilter.value === "" || app.status === statusFilter.value;

    if (selectedType.value === "借用") {
      return app.status === "審核中" && matchName && matchBorrowType && matchGrade && matchStatus;
    } else if (selectedType.value === "歸還") {
      return app.status === "借用中" && matchName && matchBorrowType && matchGrade && matchStatus;
    } else if (selectedType.value === "審核") {
      return ["審核中", "駁回", "借用中", "已歸還"].includes(app.status) &&
             matchName && matchBorrowType && matchGrade && matchStatus;
    }
    return false;
  });
});




// 通過核准
function submitApprovals() {
  approvalSelections.value.forEach((id) => {
    const app = applications.find((a) => a.id === id);
    if (app && app.status === "審核中") {
      app.status = "借用中";
    }
  });
  approvalSelections.value = []; // 清空勾選
}

// 駁回處理
function rejectApplication(app) {
  if (app.status === "審核中") {
    app.status = "駁回";
  }
}


function statusColor(status) {
  switch (status) {
    case "借用中":
      return "status-green";
    case "駁回":
      return "status-red";
    case "審核中":
      return "status-blue";
    case "已歸還":
      return "status-gray";
    default:
      return "";
  }
}


function submitReturnConfirmations() {
  returnSelections.value.forEach((id) => {
    const app = applications.find((a) => a.id === id);
    if (app && app.status === "借用中") {
      app.status = "已歸還";
    }
  });
  returnSelections.value = [];
}

function exportUsage() {
  // 將來可連接下載 API 或觸發 CSV 匯出
  alert("匯出使用紀錄功能尚未實作");
}

function visualizeUsage() {
  // 將來可跳出圖表或轉跳頁面
  alert("概況圖匯出功能尚未實作");
}
const isMobile = ref(window.innerWidth <= 768);
window.addEventListener("resize", () => {
  isMobile.value = window.innerWidth <= 768;
});

const mobileSelections = ref([]);

function approveMobile() {
  mobileSelections.value.forEach(id => {
    const app = applications.find(a => a.id === id);
    if (app && app.status === "審核中") {
      app.status = "借用中";
    }
  });
  mobileSelections.value = [];
}

function rejectMobile() {
  mobileSelections.value.forEach(id => {
    const app = applications.find(a => a.id === id);
    if (app && app.status === "審核中") {
      app.status = "駁回";
    }
  });
  mobileSelections.value = [];
}

</script>

<style scoped>
.upboard {
  background-color: white;
  min-height: 100vh;
  padding: 20px;
}
.header-bar h1 {
  color: black;
}

.left {
  max-width: 1024px;
  margin: 0 auto 0px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 35px;
  justify-content: left;
}
.topbutton {
  margin-right: 35px;
  display: block;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  background-color: white;
  color: black;
  border: solid 1px black;
}
.controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}
.controls select,
.controls input,
.controls button {
  padding: 6px;
  border-radius: 4px;
  border: 1px solid #ccc;
}
.info {
  border: solid 1px gray;
}
.search-input {
  width: 200px;
}
.review-list {
  max-width: 1024px;
  margin: 0;
  padding: 5px 20px;
  font-family: "Noto Sans TC", sans-serif;
}
table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  background-color: white;
}
th,
td {
  border: 1px solid #ccc;
  padding: 10px 8px;
  text-align: center;
  word-break: break-word;
  color: #333;
}
th {
  background-color: #ebf7ffcc;
  vertical-align: middle;
  padding: 4px 8px;
  max-width: 160px; /* 或依實際情況調整寬度 */
  overflow: hidden;
}
button {
  display: block;
  margin: 0 auto;
  padding: 6px 12px;
  background-color: #f3f7f9;
  color: black;
  border: none;
  border-radius: 10px;
  cursor: pointer;
}
.status-tag {
  padding: 5px 10px;
  border-radius: 8px;
  font-size: 14px;
  display: inline-block;
  color: black;
  font-weight: bold;
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
  border: 1px solid black;
  padding: 6px 10px;
  border-radius: 10px;
  margin-left: 35px;
}
.search-input {
  width: 200px;
  padding-right: 30px;
  background-image: url("data:image/svg+xml;utf8,<svg fill='gray' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path d='M10 2a8 8 0 105.293 14.293l5.707 5.707 1.414-1.414-5.707-5.707A8 8 0 0010 2zm0 2a6 6 0 110 12 6 6 0 010-12z'/></svg>");
  background-repeat: no-repeat;
  background-position: right 8px center;
  background-size: 16px 16px;
}
.custom-checkbox {
  display: inline-block;
  vertical-align: middle;
  cursor: pointer;
  user-select: none;
  position: relative;
  width: 28px; /* 自訂大小 */
  height: 28px;
}

.custom-checkbox input[type="checkbox"] {
  opacity: 0;
  width: 0;
  height: 0;
  position: absolute;
  left: 0;
  top: 0;
  cursor: pointer;
}

.custom-checkbox span {
  display: inline-block;
  width: 28px;
  height: 28px;
  border: 3px solid gray;
  border-radius: 5px;
  box-sizing: border-box;
  transition: background-color 0.2s, border-color 0.2s;
  position: relative;
}

/* 勾勾 */
.custom-checkbox input[type="checkbox"]:checked + span::after {
  content: "";
  position: absolute;
  left: 7px;
  top: 3px;
  width: 8px;
  height: 14px;
  border: solid green;
  border-width: 0 3px 3px 0;
  transform: rotate(45deg);
}

/* 滑鼠移入時改色（選擇性） */
.custom-checkbox:hover span {
  border-color: #555;
}
.header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 20px 0;
  max-width: 1024px;
  margin: 0 auto;
}

.header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 20px 0;
  max-width: 1024px;
  margin: 0 auto;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.action-buttons button {
  padding: 6px 12px;
  border-radius: 6px;
  background-color: white;
  border: 1px solid black;
  cursor: pointer;
  transition: background-color 0.2s;
  color:black;
}

.action-buttons button:hover {
  background-color: #e0e0e0;
}
.dropdown2 {
  width: 100%;
  font-weight: 600;
  color: black;
  border: none;
  background-color: transparent;
  appearance: none;
  padding: 4px;
  box-sizing: border-box;
  text-align: center;
  text-align-last: center;
  display: block;
  margin: 0 auto;
}
.dropdown2 option {
  font-size: 14px;
  padding: 2px 5px;
}
.dropdown option {
  font-size: 14px;
  padding: 2px 5px;
}
/* ✅ 手機版樣式 */
@media screen and (max-width: 768px) {
  .mobile-ops {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 8px;
  }
/* 手機版：水平排列 */
.mobile-header-row {
  display: flex;
  flex-wrap: wrap;          /* 允許換行 */
  align-items: center;      /* 垂直置中 */
  justify-content: flex-start; /* 元素從左往右排列 */
  gap: 10px;                /* 元素間距 */
}
.mobile-header-row > h1 {
  flex-shrink: 0;           /* 不縮小標題 */
  font-size: 20px;          /* 字體調大 */
  margin: 0;
  color: black;
}
.mobile-header-row > select {
  flex-grow: 1;             /* 下拉框可撐開剩餘空間 */
  min-width: 120px;         /* 下拉框最小寬度 */
  max-width: 200px;         /* 最大寬度 */
  padding: 6px 8px;
  border-radius: 6px;
  border: 1px solid black;
}
.mobile-header-row > button {
  flex-shrink: 0;           /* 按鈕不縮小 */
  padding: 6px 14px;
  border-radius: 20px;
  border: solid 1px black;
  background-color: white;
  cursor: pointer;
  font-weight: bold;
}

.dropdown {
  flex: 1;
  padding: 6px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 6px;
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

.action-buttons {
  border-radius: 20px;
  color:black;
}
.dropdown2 {
  width: 100%;
  font-weight: 600;
  color: black;
  border: none;
  background-color: transparent;
  appearance: none;
  padding: 0px;
  box-sizing: border-box;
  text-align: left;
  text-align-last: left;
  display: block;
  margin: 0 auto;
}
}

</style>
