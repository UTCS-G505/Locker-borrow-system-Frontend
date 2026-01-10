<script setup>

import { useAuthStore } from '@/stores/auth'; // 引入 store
const authStore = useAuthStore(); // 初始化 store

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
    if(item.return_accepted === false){
      return '借用中';
    }
    return '已歸還';
  }
  return '未知狀態'
}

/* 讓子元件可以合法發出事件(沒有這行可能會出錯) */

const emit = defineEmits(['cancel', 'return', 'show-details'])
function cancel(id) {
  emit('cancel', id)
}

function toggleReturn(id) {
  emit('return', id)
}


function showDetails(id) {
  // 發出訊號，把 ID 傳給父組件
  emit('show-details', id) 
}
</script>

<template>
  <div class="allTable">
    <div class="scrollWrapper">
      <div class="insideTable">
        <table>
          <thead class="head">
            <tr id="data">
              <th>申請人</th>
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
            <!--用item.id(唯一值)比較安全，index可能因為資料排序而有變動-->
            <tr v-for="item in props.records" :key="item.id">
              <td>{{ authStore.user?.name || item.user_id }}</td>
              <td>{{ item.reason }}</td>
              <td class="mobileHide">{{ item.start_date }}</td>
              <td class="mobileHide">{{ item.end_date }}</td>
              <td class="mobileHide">{{ item.locker_id }}</td>
              <td>
                <button class="operateButton" @click="showDetails(item.id)">詳細資訊</button>
              </td>
              <td>{{ formatState(item) }}</td>
              <td>
                <button v-if="formatState(item) === '審核中'" @click="cancel(item.id)" class="operateButton">取消</button>
                <button v-else-if="formatState(item) === '借用中' || formatState(item) === '歸還中'" @click="toggleReturn(item.id)"
                  class="operateButton">
                  {{ formatState(item) === '借用中' ? '歸還' : '取消' }}
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
/*
  table那邊外層包了兩個<div>，我有嘗試過包一層會沒效果，包兩層才有，
  然後CSS設定在第二層，這部分我有先跟Allen說過，那邊有點玄(?)，歡迎電神們的討論~~
*/

.scrollWrapper {
  overflow-x: auto;
  /* 出現橫向滾動條 */
  width: 100%;
  /* 確保包覆容器不會收縮 */
  border-radius: 14px;
  border: 1px solid #DFE1E6;
  border-collapse: separate;
  /* 如果用collapse，圓角會被吃掉 */
}

.insideTable {
  overflow-y: hidden;
  /* 跟 border-radius 做搭配，讓內容不要超出圓角邊框 */
  margin: 10px auto 0 auto;
  max-width: 100%;
  /* 保護不要暴衝超出容器 */
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
  /* 製作下方陰影處 */
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
  /* 讓偽元素定位參考 */
  text-align: center;
  /* 字體置中 */
  padding-bottom: 10px;
  font-size: 20px;
  color: black;
}

tbody tr {
  height: 45px;
  background-image: linear-gradient(to right,
      /* 從左到右畫背景 */
      transparent 0%,
      /* 從 0% 開始是透明 */
      transparent 10px,
      /* 前 10px 是透明的(也就是左邊留空隙) */
      rgba(236, 232, 232, 0.35) 10px,
      /* 第 10px 開始畫淡灰色線 */
      rgba(236, 232, 232, 0.35) calc(100% - 10px),
      /* 畫到右邊剩 10px 為止 */
      transparent calc(100% - 10px),
      /* 最後 10px 再變回透明（也就是右邊留空隙） */
      transparent 100%
      /* 到結束的時候還是透明 */
    );
  background-repeat: no-repeat;
  /* 不要重複，不然會疊加 */
  background-position: bottom;
  /* 將背景線貼在每列的下方 */
  background-size: 100% 4px;
  /* 100% 的意思為寬度是整列(含前後透明區域) */
}

tbody tr:last-child {
  background-image: none;
  /* 如果沒有這行，會讓下面再出現一條線 */
}

td,
th {
  border: none;
  /* 不要有預設的格線 */
  padding: 8px;
  white-space: nowrap;
  /* 不允許自動換行 */
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
  /* 滑鼠放上去時會變灰色 */
}

th:nth-child(7),
td:nth-child(7) {
  width: 17%;
  text-align: center;
}

th:nth-child(8),
td:nth-child(8) {
  width: 9.7%;
  text-align: center;
}

.emptyRow td {
  height: 200px;
  /* 製作下方空白處 */
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

  th:nth-child(7),
  td:nth-child(7) {
    text-align: center;
  }

  th:nth-child(8),
  td:nth-child(8) {
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
    /* 手機版沒有顯示開始時間、結束時間、系櫃編號，因此使用此程式碼讓它隱藏 */
  }

  tbody tr {
    height: 30px;
  }

  th:nth-child(7),
  td:nth-child(7) {
    width: 16%;
    text-align: center;
  }

  th:nth-child(8),
  td:nth-child(8) {
    width: 16%;
    text-align: center;
  }
}
</style>