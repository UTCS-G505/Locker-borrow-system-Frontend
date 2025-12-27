<script setup>
import { ref } from 'vue'
import RecordTable from '../components/RecordTable.vue';
import CheckPopup from '../components/popups/CheckPopup.vue';
/* 先寫死3筆資料，方便檢視 */
const record = ref([
    {id:1, name:'陳胤華', type:'學年借用', startTime:'2024/9/1', endTime:'2025/6/30', num:'39', state:'審核中'},
    {id:2, name:'陳胤華', type:'學年借用', startTime:'2024/9/1', endTime:'2025/6/30', num:'39', state:'駁回'},
    {id:3, name:'陳胤華', type:'臨時借用', startTime:'2024/9/1', endTime:'2025/6/30', num:'39', state:'借用中'}
])

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
</script>

<template>
  <div class="recordWrapper">
    <h1 class="record">申請紀錄</h1>
    <!--監聽名為 'cancel'及'return' 的事件-->
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