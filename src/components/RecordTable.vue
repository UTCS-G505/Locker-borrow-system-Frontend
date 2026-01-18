<script setup>
import { Record } from '@/api/main';

/* 子元件用props接收父元件傳來的record資料，它是個Array*/
const props = defineProps({
records: Array
})

// formatState 是用於顯示文字，把 null 、 true 、 false 轉變成審核中、借用中之類的中文文字
const formatState = (item) => {
/*手動加入 item.state 可以讓使用者點擊按鈕後立刻看到結果。 
  如果不加，formatState(item) 就不能執行，因為 Vue 認為資料沒變 */
if(item.state){
  return item.state;
}

if(item.borrow_accepted === null){
  return '審核中';
}
if(item.borrow_accepted === false){
  return '駁回';
}
if(item.borrow_accepted === true){
  if(item.return_available === false){
    return '借用中';
  }
  if(item.return_available === true && !item.return_accepted_date){
    return '歸還中';
  }
  if(item.return_available === true && item.return_accepted_date && item.return_accepted === true){
    return '已歸還';
  }
}
return '未知狀態'
}

const formatDate = (dateStr) => {
if(!dateStr) return '';

return dateStr.split('T')[0];
}

/* 讓子元件可以合法發出事件(沒有這行可能會出錯) */
const emit = defineEmits(['cancel', 'refresh', 'show-details'])

function cancel(id) {
emit('cancel', id)
}

function showDetails(id) {
emit('show-details', id)
}

// 申請歸還 (借用中 → 歸還中)
const handleReturn = async (id) => {
if (!confirm("確定要申請歸還嗎？")) return;

try {
  const response = await Record.postReturn(id, true);

  if (response && response.code === 0) {
    alert(`申請成功\n${response.message}`);
    emit('refresh'); 
  } else {
    alert(`申請失敗\n${response?.message || '未知錯誤'}`);
  }
} catch (error) {
  console.error('申請歸還錯誤:', error);
  alert("系統發生錯誤,請稍後再試");
}
}

// 撤回歸還申請 (歸還中 → 借用中)
const handleCancelReturn = async (id) => {
if (!confirm("確定要撤回歸還申請嗎？")) return;

try {
  const response = await Record.postReturn(id, false);

  if (response && response.code === 0) {
    alert(`撤回成功\n${response.message}`);
    emit('refresh');
  } else {
    alert(`撤回失敗\n${response?.message || '未知錯誤'}`);
  }
} catch (error) {
  console.error('撤回歸還錯誤:', error);
  alert("系統發生錯誤,請稍後再試");
}
}
</script>

<template>
<div class="allTable">
  <div class="scrollWrapper">
    <div class="insideTable">
      <table>
        <thead class="head">
          <tr id="data">
            <th>借用類型</th>
            <th class="mobileHide">開始時間</th>
            <th class="mobileHide">結束時間</th>
            <th class="mobileHide">系櫃編號</th>
            <th>詳細資訊</th>
            <th>狀態</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in props.records" :key="item.id">
            <td>{{ item.temporary ? '臨時借用' : '學年借用' }}</td>
            <td class="mobileHide">{{ formatDate(item.start_date) }}</td>
            <td class="mobileHide">{{ formatDate(item.end_date) }}</td>
            <td class="mobileHide">{{ item.locker_id }}</td>
            <td>
              <button class="operateButton" @click="showDetails(item.id)">詳細資訊</button>
            </td>
            <td>{{ formatState(item) }}</td>
            <td>
              <!-- 審核中 → 顯示「取消」 -->
              <button 
                v-if="formatState(item) === '審核中'" 
                @click="cancel(item.id)" 
                class="operateButton"
              >
                取消
              </button>

              <!-- 借用中 → 顯示「歸還」 -->
              <button 
                v-else-if="formatState(item) === '借用中'" 
                @click="handleReturn(item.id)"
                class="operateButton"
              >
                歸還
              </button>

              <!-- 歸還中 → 顯示「取消」 -->
              <button 
                v-else-if="formatState(item) === '歸還中'" 
                @click="handleCancelReturn(item.id)"
                class="operateButton"
              >
                取消
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</div>
</template>

<style scoped>
.scrollWrapper {
overflow-x: auto;
width: 100%;
border-radius: 14px;
border: 1px solid #DFE1E6;
border-collapse: separate;
}

.insideTable {
overflow-y: hidden;
margin: 10px auto 0 auto;
max-width: 100%;
margin-top: 0px;
}

table {
overflow: hidden;
border: none;
border-spacing: 0;
width: 100%;
background-color: white;
min-width: 900px;
}

.head {
background-color: aliceblue;
box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.head th {
border-bottom: 2px solid #ECE8E8;
}

#data {
font-size: 25px;
color: black;
border-spacing: 0px;
}

tr td {
position: relative;
text-align: center;
padding-bottom: 10px;
font-size: 20px;
color: black;
}

tbody tr {
height: 45px;
background-image: linear-gradient(to right,
    transparent 0%,
    transparent 10px,
    rgba(236, 232, 232, 0.35) 10px,
    rgba(236, 232, 232, 0.35) calc(100% - 10px),
    transparent calc(100% - 10px),
    transparent 100%
  );
background-repeat: no-repeat;
background-position: bottom;
background-size: 100% 4px;
}

tbody tr:last-child {
background-image: none;
}

td,
th {
border: none;
padding: 8px;
white-space: nowrap;
}

.operateButton {
border: 2px solid #dbdcdd;
background-color: white;
box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
border-radius: 10px;
padding: 2px 12px;
cursor: pointer;
font-size: 20px;
color: black;
}

.operateButton:hover {
background-color: #dbdcdd;
}

th:nth-child(6),
td:nth-child(6) {
width: 17%;
text-align: center;
}

th:nth-child(7),
td:nth-child(7) {
width: 9.7%;
text-align: center;
}

.emptyRow td {
height: 200px;
border: none;
background: transparent;
}

@media (max-width: 984px) and (min-width: 641px) {
.operateButton {
  padding: 2px 6px;
  font-size: 15px;
}

th {
  font-size: 19px;
}

tr td {
  font-size: 16px;
}

th:nth-child(6),
td:nth-child(6) {
  text-align: center;
}

th:nth-child(7),
td:nth-child(7) {
  text-align: center;
}
}

/* 手機版 */
@media (max-width: 640px) {
tr td {
  font-size: 15px;
}

th {
  font-size: 17px;
}

.operateButton {
  font-size: 14px;
}

.mobileHide {
  display: none;
}

tbody tr {
  height: 30px;
}

th:nth-child(6),
td:nth-child(6) {
  width: 16%;
  text-align: center;
}

th:nth-child(7),
td:nth-child(7) {
  width: 16%;
  text-align: center;
}
}
</style>