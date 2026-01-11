<script setup>

import { ref,onMounted,nextTick } from 'vue';
import { Record } from '@/api/main';
import RecordTable from '../components/RecordTable.vue';
import InfoPopup from '@/components/popups/InfoPopup.vue';

//引入 store 名稱與路徑，讓每個頁面都知道現在是誰在操作
import { useAuthStore } from '@/stores/auth';
const authStore = useAuthStore();
const record = ref([]);

// 彈窗相關變數
const detailModalRef = ref(null);
const modalData = ref([]);

const formatDate = (dateStr) => {
  if(!dateStr) return '';

  return dateStr.split('T')[0];
}

const formatDateTime = (dateStr) => {
  if(!dateStr) return '';

  return dateStr.replace('T',' ');
}

onMounted(async () =>{
  try{
    const currentUserId = authStore.user?.id;

    if(currentUserId){
      const allRecordsResponse = await Record.getList(currentUserId);
      record.value = allRecordsResponse || [];
      console.log("從伺服器抓到真資料",record.value);
    }
  } catch (err){
    console.error("獲取申請紀錄列表失敗",err);
  }
});

function handleCancel(id){
  const item = record.value.find(r => r.id === id)
  if(item.borrow_accepted === null){
    item.state = '取消申請' // 手動加入 state ，可以觸發畫面更新
  }
}

function handleReturn(id) {
  const item = record.value.find(r => r.id === id)

  if(item.borrow_accepted === true && item.return_accepted !== true){
    if(item.state === '歸還中'){
      item.state = '' // 清空手動狀態，讓它變回"借用中"
    }else{
      item.state = '歸還中'
    }
  }
}


const handleShowDetails = async (id) =>{
  const item = record.value.find(r => r.id === id);
  if (!item) return;
  console.log("查看詳細資訊:", item);

  let statusText = item.state;

  if(!statusText){
    if(item.borrow_accepted === null){
      statusText = '審核中';
    }else if(item.borrow_accepted === false){
      statusText = '駁回';
    }else if(item.borrow_accepted === true){
      if(item.return_available === false){
        statusText = '借用中';
      } else if(item.return_available === true && !item.return_accepted_date){
        statusText = '歸還中';
      } else if(item.return_available === true && item.return_accepted_date && item.return_accepted === true){
        statusText = '已歸還';
      } else {
        statusText = '狀態異常'; // 防呆用
      }
    }
  }

  modalData.value = [
    { label: '借用類型', value: item.temporary ? '臨時借用' : '學年借用'},

    { label: '借用時間(起)', value: formatDate(item.start_date) },
    { label: '借用時間(迄)', value: formatDate(item.end_date) },

    { label: '借用系櫃編號', value: item.locker_id },
    { label: '申請借用時間', value: formatDateTime(item.apply_date) }, 

    { label: '借用理由', value: item.reason, isFullRow: true, isBox: true },

    { label: '系辦審核時間', value: formatDateTime(item.review_date) || '' }, 
    { label: '系辦審核結果', value: statusText },

    // 駁回原因 (如果有)
    ...(item.borrow_accepted === false ? [
        { label: '駁回理由', value: item.reject_reason || '未填寫理由', isFullRow: true, isBox: true }
    ] : []),

    // 歸還資訊
    ...(['歸還中', '已歸還'].includes(statusText) ? [
        { label: '申請歸還時間', value: formatDateTime(item.return_available_date) || '' },
        { label: '系辦審核時間', value: formatDateTime(item.return_accepted_date) || '' }, // 歸還的審核時間
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