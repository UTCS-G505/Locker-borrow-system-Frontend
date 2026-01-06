<script setup>
//加入nextTick
import { ref,nextTick } from 'vue'
import RecordTable from '../components/RecordTable.vue';
import InfoPopup from '@/components/popups/InfoPopup.vue';
/* 修改模擬資料，加入簽核時間欄位 */
import CheckPopup from '../components/popups/CheckPopup.vue';
/* 先寫死3筆資料，方便檢視 */
const record = ref([
    {
      id:1, 
      name:'陳胤華', 
      type:'學年借用', 
      startTime:'2024/9/1', 
      endTime:'2025/6/30', 
      num:'39', 
      state:'審核中',
      // ★ 模擬情境：助教已經簽了，但主任還沒簽 -> 所以還卡在審核中
      assistantTime: '2025/7/1 14:00', 
      directorTime: '' 
    },
    {
      id:2, 
      name:'陳胤華', 
      type:'學年借用', 
      startTime:'2024/9/1', 
      endTime:'2025/6/30', 
      num:'39', 
      state:'駁回',
      // ★ 模擬情境：可能助教就直接駁回了
      assistantTime: '2025/7/2 09:00', 
      directorTime: ''
    },
    {
      id:3, 
      name:'陳胤華', 
      type:'臨時借用', 
      startTime:'2024/9/1', 
      endTime:'2025/6/30', 
      num:'39', 
      state:'借用中',
      // ★ 模擬情境：兩個人都簽了 -> 狀態變借用中
      assistantTime: '2025/8/1 10:00', 
      directorTime: '2025/8/5 16:30',
      returnApplyTime: '2025/6/30 14:00', // 模擬申請歸還時間
      returnApproveTime: null             // 模擬還沒通過 (留白)
    }
])

// 彈窗相關變數
const detailModalRef = ref(null);
const modalData = ref([]);
const showCancelModal = ref(false);       // 取消申請 (審核中 -> 取消)
const showReturnModal = ref(false);       // 歸還 (借用中 -> 歸還中)
const showCancelReturnModal = ref(false); // 取消歸還 (歸還中 -> 借用中)
const currentId = ref(null);        // 記錄目前操作的是哪一筆 ID

function handleCancel(id){
  const item = record.value.find(r => r.id === id)
  // 只有審核中才需要跳窗
  if(item && item.state === '審核中'){
    currentId.value = id;
    showCancelModal.value = true;
  }
}

//區分狀況，借用中才跳窗
function confirmCancel(){
  const item = record.value.find(r => r.id === currentId.value)
  if(item && item.state === '審核中'){
    item.state = '取消申請'
  }
  showCancelModal.value = false; // 關閉彈窗
}

function handleReturn(id){
  const item = record.value.find(r => r.id === id)
  
  // 記錄現在操作哪一筆
  currentId.value = id;

  if(item.state === '借用中'){
    // 如果是借用中 -> 要變成歸還中 -> 開啟「歸還」彈窗
    showReturnModal.value = true;
  } else if(item.state === '歸還中'){
    // 如果是歸還中 -> 要變回借用中 -> 開啟「取消歸還」彈窗
    showCancelReturnModal.value = true;
  }
}

//新增 confirmReturn：確認後執行歸還 (原本的邏輯移到這)
function confirmReturn(){
  const item = record.value.find(r => r.id === currentId.value)
  if(item && item.state === '借用中'){
    item.state = '歸還中'
  }
  showReturnModal.value = false; // 關閉彈窗
}

function confirmCancelReturn(){
  const item = record.value.find(r => r.id === currentId.value)
  if(item && item.state === '歸還中'){
    item.state = '借用中'; // 變回借用狀態
  }
  showCancelReturnModal.value = false;
}

function handleShowDetails(id) { 
  const item = record.value.find(r => r.id === id);
  if (!item) return;

  console.log("查看詳細資訊:", item);

  modalData.value = [
    { label: '申請人', value: item.name },
    { label: '借用類別', value: item.type },
    { label: '狀態', value: item.state },
    { label: '申請時間', value: '2025/6/30 9:50' }, 
    { label: '時間起', value: item.startTime },
    { label: '時間迄', value: item.endTime },
    
    { label: '借用原因', value: '沒有宿舍QAQ', isFullRow: true, isBox: true },
    
    // 駁回原因 (這段邏輯保留，因為這通常是額外欄位)
    ...(item.state === '駁回' ? [
        { label: '駁回原因', value: '你明明就有', isFullRow: true, isBox: true }
    ] : []),

    
    // 如果 item.assistantTime 是有值的，就會顯示時間
    // 如果是空字串 ''，畫面就會留白，但保留標題
    { 
      label: '系助教簽核時間', 
      value: item.assistantTime 
    },
    { 
      label: '系主任簽核時間', 
      value: item.directorTime 
    },

    ...(['歸還中', '已歸還'].includes(item.state) ? [
        { 
          label: '申請歸還時間', 
          value: item.returnApplyTime 
        },
        { 
          label: '歸還通過時間', 
          value: item.returnApproveTime // 如果是 null，畫面會自動留白
        }
    ] : []),
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
    <RecordTable :records = "record" @cancel = "handleCancel" @return = "handleReturn"/>

    <CheckPopup 
      v-if="showCancelModal" 
      operation="取消申請" 
      @confirm="confirmCancel" 
      @close="showCancelModal = false" 
    />

    <CheckPopup 
      v-if="showReturnModal" 
      operation="歸還" 
      @confirm="confirmReturn" 
      @close="showReturnModal = false" 
    />

    <CheckPopup 
      v-if="showCancelReturnModal" 
      operation="取消歸還" 
      @confirm="confirmCancelReturn" 
      @close="showReturnModal = false" 
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
