<script setup>
//加入nextTick
import { ref,nextTick } from 'vue'
import RecordTable from '../components/RecordTable.vue';
import InfoPopup from '@/components/popups/InfoPopup.vue';
/* 先寫死3筆資料，方便檢視 */
const record = ref([
    {id:1, name:'陳胤華', type:'學年借用', startTime:'2024/9/1', endTime:'2025/6/30', num:'39', state:'審核中'},
    {id:2, name:'陳胤華', type:'學年借用', startTime:'2024/9/1', endTime:'2025/6/30', num:'39', state:'駁回'},
    {id:3, name:'陳胤華', type:'臨時借用', startTime:'2024/9/1', endTime:'2025/6/30', num:'39', state:'借用中'}
])

// 彈窗相關變數
const detailModalRef = ref(null);
const modalData = ref([]);

function handleCancel(id){
  const item = record.value.find(r => r.id === id)
  if(item.state === '審核中'){
    item.state = '取消申請'
  }
}
/* 此地方有跟陳胤華討論過，按下"歸還"按鈕，狀態要變為"歸還中"；按下"取消歸還"按鈕，狀態要變為"借用中" (互相轉換狀態)*/
function handleReturn(id){
  const item = record.value.find(r => r.id === id)
  if(item.state === '借用中'){
    item.state = '歸還中'
  }else if(item.state === '歸還中'){
    item.state = '借用中'
  }
}

function handleShowDetails(id) { 
  // 因為 RecordTable 只有傳 ID 出來 (依照你原本 handleCancel 的邏輯推測)
  // 我們先去抓出那筆資料
  const item = record.value.find(r => r.id === id);
  if (!item) return;

  console.log("查看詳細資訊:", item);

  // 組裝彈窗需要的資料格式
  modalData.value = [
    { label: '申請人', value: item.name },
    { label: '借用類別', value: item.type },
    { label: '狀態', value: item.state },
    // 這裡模擬一個申請時間，實際上你可能要從後端抓
    { label: '申請時間', value: '2025/6/30 9:50' }, 
    { label: '時間起', value: item.startTime },
    { label: '時間迄', value: item.endTime },
    
    // 借用原因 (跨欄顯示)
    { label: '借用原因', value: '沒有宿舍QAQ', isFullRow: true, isBox: true },
    
    // ★ 重點：動態判斷是否為駁回 ★
    // 如果狀態是 '駁回'，我們就多加一個欄位
    ...(item.state === '駁回' ? [
        { label: '駁回原因', value: '你明明就有', isFullRow: true, isBox: true }
    ] : []),
    // 之後如果你後端傳過來的資料 (item) 裡面真的有包含駁回原因（例如欄位叫 rejectReason），就把這行改成：
    // { label: '駁回原因', value: item.rejectReason, isFullRow: true, isBox: true }


    // 簽核時間 (模擬資料)
    { label: '系助教簽核時間', value: '2025/8/11' },
    { label: '系主任簽核時間', value: '2025/8/11' },
  ];

  // 打開彈窗
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
    <!--監聽名為 'cancel'及'return' 的事件-->
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