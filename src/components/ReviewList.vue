<template>
  <div class="review-list">
    <div class="scrollWrapper">
      <div class="insideTable">
        <table>
          <thead class="tableHead">
            <tr>
              <th v-if="selectedType === '借用'">
                <label class="custom-checkbox">
                  <input type="checkbox" v-model="allMobileSelected" />
                  <span></span>
                </label>
              </th>

              <th v-if="selectedType === '歸還'">
                <label class="custom-checkbox">
                  <input type="checkbox" v-model="allReturnSelected" />
                  <span></span>
                </label>
              </th>
              <th>申請人學號</th>
              <th>申請人</th>
              <th>
                <select v-model="gradeFilterProxy" class="dropdown2">
                  <option value="">年級</option>
                  <option value="大一">大一</option>
                  <option value="大二">大二</option>
                  <option value="大三">大三</option>
                  <option value="大四">大四</option>
                </select>
              </th>
              <th>
                <select v-model="borrowTypeFilterProxy" class="dropdown2">
                  <option value="">借用類型</option>
                  <option value="學年借用">學年借用</option>
                  <option value="臨時借用">臨時借用</option>
                </select>
              </th>
              <th>開始時間</th>
              <th>結束時間</th>
              <th>系櫃編號</th>
              <th>詳細資訊</th>
              <th v-if="selectedType === '審核'">
                <select v-model="statusFilterProxy" class="dropdown2">
                  <option value="">狀態</option>
                  <option value="審核中">審核中</option>
                  <option value="已駁回">已駁回</option>
                  <option value="借用中">借用中</option>
                  <option value="已歸還">已歸還</option>
                </select>
              </th>
            </tr>
          </thead>
          <tbody>
            <template v-for="item in applications" :key="item.id">
              <tr>
                <td v-if="selectedType === '借用'">
                  <label class="custom-checkbox">
                    <input
                      type="checkbox"
                      v-model="mobileSelectionsProxy"
                      :value="item.id"
                    />
                    <span></span>
                  </label>
                </td>

                <td v-if="selectedType === '歸還'">
                  <label class="custom-checkbox">
                    <input
                      type="checkbox"
                      v-model="returnSelectionsProxy"
                      :value="item.id"
                    />
                    <span></span>
                  </label>
                </td>
                <td>{{ item.studentId }}</td>
                <td>{{ item.name }}</td>
                <td>{{ item.grade }}</td>
                <td>{{ item.borrowType }}</td>
                <td>{{ item.startTime }}</td>
                <td>{{ item.endTime }}</td>
                <td>{{ item.cabinet }}</td>
                <td>
                  <button class="info" @click="emit('show-details', item)">
                    詳細資訊
                  </button>
                </td>
                <td v-if="selectedType === '審核'">
                  <span class="status-tag" :class="statusColor(item.status)">
                    {{ item.status }}
                  </span>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

// ----------------------------------------------------------------
// 1. Props (從父組件接收資料)
// ----------------------------------------------------------------
const props = defineProps({
  // 主要資料
  applications: { type: Array, required: true },
  selectedType: { type: String, required: true },

  // v-model 綁定的資料
  mobileSelections: { type: Array, required: true },
  returnSelections: { type: Array, required: true },
  gradeFilter: { type: String, required: true },
  borrowTypeFilter: { type: String, required: true },
  statusFilter: { type: String, required: true },
});

// ----------------------------------------------------------------
// 2. Emits (通知父組件更新資料)
// ----------------------------------------------------------------
const emit = defineEmits([
  "update:mobileSelections",
  "update:returnSelections",
  "update:gradeFilter",
  "update:borrowTypeFilter",
  "update:statusFilter",
  "show-details",
]);

// ----------------------------------------------------------------
// 3. v-model 代理 (Proxy)
// ----------------------------------------------------------------
// 為 v-model 建立 computed 代理，這樣才能在子組件中安全地讀寫
const gradeFilterProxy = computed({
  get: () => props.gradeFilter,
  set: (val) => emit("update:gradeFilter", val),
});
const borrowTypeFilterProxy = computed({
  get: () => props.borrowTypeFilter,
  set: (val) => emit("update:borrowTypeFilter", val),
});
const statusFilterProxy = computed({
  get: () => props.statusFilter,
  set: (val) => emit("update:statusFilter", val),
});
const mobileSelectionsProxy = computed({
  get: () => props.mobileSelections,
  set: (val) => emit("update:mobileSelections", val),
});
const returnSelectionsProxy = computed({
  get: () => props.returnSelections,
  set: (val) => emit("update:returnSelections", val),
});

// ----------------------------------------------------------------
// 4. 內部邏輯 (從父組件搬移過來)
// ----------------------------------------------------------------

// "全選" 邏輯 (完全複製您原本的邏輯，僅將 .value 改為 props 和 emits)
const allMobileSelected = computed({
  get() {
    const ids = props.applications.map((app) => app.id);
    if (ids.length === 0) return false;
    return ids.every((id) => props.mobileSelections.includes(id));
  },
  set(checked) {
    if (checked) {
      // 勾選時：只選目前畫面可見的項目 (覆蓋)
      emit("update:mobileSelections", props.applications.map((app) => app.id));
    } else {
      // 取消勾選時：移除目前畫面可見的 id (保留非可見選項)
      const visibleIds = new Set(props.applications.map((app) => app.id));
      const newSelections = props.mobileSelections.filter(
        (id) => !visibleIds.has(id)
      );
      emit("update:mobileSelections", newSelections);
    }
  },
});

const allReturnSelected = computed({
  get() {
    const ids = props.applications.map((app) => app.id);
    if (ids.length === 0) return false;
    return ids.every((id) => props.returnSelections.includes(id));
  },
  set(checked) {
    if (checked) {
      // 勾選時：只選目前畫面可見的項目 (覆蓋)
      emit("update:returnSelections", props.applications.map((app) => app.id));
    } else {
      // 取消勾選時：移除目前畫面可見的 id (保留非可見選項)
      const visibleIds = new Set(props.applications.map((app) => app.id));
      const newSelections = props.returnSelections.filter(
        (id) => !visibleIds.has(id)
      );
      emit("update:returnSelections", newSelections);
    }
  },
});

// 狀態顏色 邏輯
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
</script>

<style scoped>
/* 這裡是所有從原檔案搬移過來的 "表格相關" 樣式
*/
.review-list {
  margin: 0 auto;
  padding: 5px 20px;
  font-family: "Noto Sans TC", sans-serif;
  width: 100%;
}
.scrollWrapper {
  overflow-x: auto; /* 可左右滑動 */
  width: 100%;
  border-radius: 14px;
  border: 1px solid #dfe1e6;
  border-collapse: separate;
}

.insideTable {
  position: relative;
  overflow-y: hidden;
  margin: 10px auto 0 auto;
  /* min-width: 1152px; */
  max-width: 100%;
  z-index: 0;
  margin-top: 0px;
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
tbody tr:not(:last-child) td:first-child {
  background-image: linear-gradient(
    to right, /* 從左到 right 畫背景 */
    transparent 0%, /* 從 0% 開始是透明 */
    transparent 10px, /* 前 10px 是透明的(也就是左邊留空隙) */
    rgba(236, 232, 232, 0.35) 10px /* 第 10px 開始畫淡灰色線 */
  );
  background-repeat: no-repeat;
  background-position: bottom;
  background-size: 100% 4px;
}
tbody tr:not(:last-child) td:not(:last-child):not(:first-child) {
  background-image: linear-gradient(
    to right,
    rgba(236, 232, 232, 0.35) 0px,
    rgba(236, 232, 232, 0.35) 100%
  );
  background-repeat: no-repeat;
  background-position: bottom;
  background-size: 100% 4px;
}
tbody tr:not(:last-child) td:last-child {
  background-image: linear-gradient(
    to right, /* 從左到 right 畫背景 */
    rgba(236, 232, 232, 0.35) 0px, /* 第 10px 開始畫淡灰色線 */
    rgba(236, 232, 232, 0.35) calc(100% - 10px), /* 畫到 right 剩 10px 為止 */
    transparent calc(100% - 10px) /* 最後 10px 再變回透明（也就是 right 邊留空隙） */
  );
  background-repeat: no-repeat;
  background-position: bottom;
  background-size: 100% 4px;
}
tbody tr:last-child td {
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
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 6px; /* 陰影高度，可調整 */
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.12); /* 只往下陰影 */
  pointer-events: none;
}

.info {
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
  background-color: #dbf6f3;
  color: #0d4436;
}

/* 審核中 - 橘色 */
.status-pending {
  background-color: #fde7c6;
  color: #a5551f;
}

/* 駁回 - 紅色 */
.status-rejected {
  background-color: #ffe9fb;
  color: #a22282;
}

/* 已歸還 - 灰色 */
.status-returned {
  background-color: #f3f7f9;
  color: #5e6064;
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

.dropdown2 {
  width: auto;
  font-size: 20px;
  font-weight: 560;
  color: #000;
  border: none;
  background-color: transparent;
  white-space: nowrap;
  margin: 0;

  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background: url('data:image/svg+xml;utf8,<svg fill="gray" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"/></svg>')
    no-repeat right 6px center;
  background-size: 30px 60px;
  padding: 0px 30px;
}

.dropdown2 option {
  font-size: 14px;
  border: 1px solid #ccc;
  background-color: white;
  padding: 5px;
  color: black;
  cursor: pointer;
}

@media screen and (max-width: 865px) {
  .custom-checkbox input[type="checkbox"] {
    margin-left: 0px;
  }
}
</style>
