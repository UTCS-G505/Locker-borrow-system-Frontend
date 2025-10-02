<template>
  <section class="upboard">
  <!-- 手機版操作列 -->
  <div v-if="isMobile" class="mobile-ops">
    <div class="mobile-header-row">
    <div class="mobile-header-top">
      <h1>審核申請</h1>

      <!-- 下拉式表單 -->
          <div class="select-wrapper">
          <select v-model="selectedType" class="dropdown">
            <option value="借用">借用申請</option>
            <option value="歸還">歸還申請</option>
            <option value="審核">審核紀錄</option>
          </select>
        </div>
        </div>
      <!-- 按鈕 -->
      <div class="mobile-header-bottom">
      <button class="btn" @click="approveMobile"  v-if="selectedType === '借用'">通過</button>
      <button class="btn" @click="rejectMobile"  v-if="selectedType === '借用'">駁回</button>
      <button
          class="topbutton"
          v-if="selectedType === '歸還'"
          @click="submitReturnConfirmations"
        >
          送出
        </button>
    </div>
    </div>

    <!-- 搜尋欄 -->
    <input
            type="text"
            v-model="searchName"
            placeholder="搜尋"
             class="mobile-search search-input"
    />
  </div>

    <!-- 上方控制列 -->
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
      <div class="scrollWrapper">
        <div class="insideTable">
        <table>
          <thead class="tableHead">
            <tr>
              <th>申請人學號</th>
              <th>申請人</th>
              <th>
                <select v-model="gradeFilter" class="dropdown2">
                <option value="">年級</option>
                <option value="大一">大一</option>
                <option value="大二">大二</option>
                <option value="大三">大三</option>
                <option value="大四">大四</option>
              </select>
              </th>
              <th>
                <select v-model="borrowTypeFilter" class="dropdown2">
                  <option value="">借用類型</option>
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
                  <option value="">狀態</option>
                  <option value="審核中">審核中</option>
                  <option value="已駁回">已駁回</option>
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
                <td><button class="info">詳細資訊</button></td>
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
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, reactive, computed, watch } from "vue";
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
    status: "已駁回",
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
      return ["審核中", "已駁回", "借用中", "已歸還"].includes(app.status) &&
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
    app.status = "已駁回";
  }
}


function statusColor(status) {
  switch (status) {
    case "借用中":
      return "status-borrowing";
    case "已駁回":
      return "status-rejected";
    case "審核中":
      return "status-pending";
    case "已歸還":
      return "status-returned";
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
      app.status = "已駁回";
    }
  });
  mobileSelections.value = [];
}



//當切換頁面時重置所有過濾器
watch(selectedType, () => {
  searchName.value = "";
  borrowTypeFilter.value = "";
  gradeFilter.value = "";
  statusFilter.value = "";
});
</script>

<style scoped>
html, body {
  margin: 0;
  padding: 0;
}
.upboard {
  background: transparent;
  border: none ;
  box-shadow: none ;
  margin: 0;
  padding: 0;
}
.header-bar h1 {
  font-size: 30px;
  color: black;
  margin: 0;
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
}
.review-list {
  margin: 0 auto;
  padding: 5px 20px;
  font-family: "Noto Sans TC", sans-serif;
  width: 100%;
}
.scrollWrapper {
  overflow-x: auto; /* 可左右滑動 */
  width: 100%;
  background: transparent;
  border: none;
  box-shadow: none;
}

.insideTable {
  border-collapse: separate;
  border-spacing: 0;
  background-color: white;
  border-radius: 14px;
  border: 1px solid #dfe1e6;
  min-width: 1152px;
  overflow: hidden;
  table-layout: auto;
}

table {
  border-spacing: 0;
  width: 100%;
  background-color: white;
  table-layout: auto;
}

thead {
  background-color: aliceblue;
}
th {
  background-color: aliceblue;
  padding: 10px;
  text-align: center;
  font-size: 20px;
  font-weight: 560;
  white-space: nowrap;
  align-items: center;
  justify-content: space-between;
  position: relative;
  vertical-align: middle;
  color: #000;

}



thead tr {
  background-image: none !important; /* 移除背景線 */
}
tr {
  background-image: linear-gradient(
    to right, /* 從左到右畫背景 */
    transparent 0%, /* 從 0% 開始是透明 */
    transparent 10px, /* 前 10px 是透明的(也就是左邊留空隙) */
    rgba(236, 232, 232, 0.35) 10px, /* 第 10px 開始畫淡灰色線 */
    rgba(236, 232, 232, 0.35) calc(100% - 10px), /* 畫到右邊剩 10px 為止 */
    transparent calc(100% - 10px), /* 最後 10px 再變回透明（也就是右邊留空隙） */
    transparent 100%  /* 到結束的時候還是透明 */
  );

  background-repeat: no-repeat;
  background-position: bottom;
  background-size: 100% 4px;
}

tbody tr:last-child {
  background-image: none;
}

td {
  padding: 9px;
  text-align: center;
  white-space: nowrap; /* 防止換行，方便滑動 */
  vertical-align: middle;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  color: #000;
}

.tableHead {
  position: relative; /* 為偽元素定位 */
  background-color: aliceblue;
}

.tableHead::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 6px;         /* 陰影高度，可調整 */
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.12); /* 只往下陰影 */
  pointer-events: none;
}


.info{
  border: 1px solid #ccc;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
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
.status-tag {
  padding: 5px 10px;
  border-radius: 8px;
  font-size: 18px;
  display: inline-block;
  color: black;
  font-weight: normal;
  min-width: 80px; /* 最小寬度，所有狀態一致 */
  text-align: center;
}
/* 借用中 - 綠色 */
.status-borrowing {
  background-color: #DBF6F3;
  color: #0D4436;
}

/* 審核中 - 橘色 */
.status-pending {
  background-color: #FDE7C6;
  color: #A5551F;
}

/* 駁回 - 紅色 */
.status-rejected {
  background-color: #FFE9FB;
  color: #A22282;
}

/* 已歸還 - 灰色 */
.status-returned {
  background-color: #F3F7F9;
  color: #5E6064;
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
  width: 200px;
  padding-right: 30px;
  background-image: url("data:image/svg+xml;utf8,<svg fill='gray' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path d='M10 2a8 8 0 105.293 14.293l5.707 5.707 1.414-1.414-5.707-5.707A8 8 0 0010 2zm0 2a6 6 0 110 12 6 6 0 010-12z'/></svg>");
  background-repeat: no-repeat;
  background-position: right 8px center;
  background-size: 16px 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.search-input:hover {
  background-color: #eee;
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
  margin-left: 35px;
}

.custom-checkbox span {
  display: inline-block;
  width: 28px;
  height: 28px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
  transition: background-color 0.2s, border-color 0.2s;
  position: relative;
}

/* 勾勾 */
.custom-checkbox input[type="checkbox"]:checked + span::after {
  content: "";
  position: absolute;
  left: 9px;
  top: 4px;
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

.action-buttons {
  display: flex;
  gap: 10px;
}
.dropdown2 {
  width:auto;
  font-size: 20px;
  font-weight: 560;
  color: #000;
  border: none;
  background-color: transparent;
  white-space: nowrap;
  margin: 0 ;

  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background:url('data:image/svg+xml;utf8,<svg fill="gray" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"/></svg>') no-repeat right 6px center;
  background-size: 30px 60px;
  padding: 0px 30px
}

.dropdown2 option {
  font-size: 14px;
  border: 1px solid #ccc;
  background-color: white;
  padding: 5px;
  color: black;
  cursor: pointer;
}
.select-wrapper {
  display: inline-block;
  position: relative;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  background-color: white;
  overflow: hidden;
}

.select-wrapper .dropdown {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  border: 1px solid #ccc;
  width: 120px;
  height: 36px;
  padding: 0 30px 0 10px;
  border-radius: 12px;
  background: white;
  font-size: 14px;
  cursor: pointer;
}

.select-wrapper::after {
  content: '▼';
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

/* ✅ 手機版樣式 */
@media screen and (max-width: 768px) {
  .mobile-ops {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin:0;
    padding: 10px;
     padding: 0 20px;
    border-radius: 8px;
  }
/* 手機版：水平排列 */
.mobile-header-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-start;  /* 初始同一行靠左 */
  gap: 10px;
}
.mobile-header-top {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: space-between; /* 標題與下拉左右對齊 */
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
  font-size: 32px;
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
  height : 36px;
}
.custom-checkbox input[type="checkbox"] {
  margin-left: 0px;
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

</style>
