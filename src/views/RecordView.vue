<script setup>
import { ref,onMounted } from 'vue';
import { Record } from '@/api/main';
import RecordTable from '../components/RecordTable.vue';

//引入 store 名稱與路徑，讓每個頁面都知道現在是誰在操作
import { useAuthStore } from '@/stores/auth';

/* 先寫死3筆資料，方便檢視 */
/*const record = ref([
    {id:1, name:'陳胤華', type:'學年借用', startTime:'2024/9/1', endTime:'2025/6/30', num:'39', state:'審核中'},
    {id:2, name:'陳胤華', type:'學年借用', startTime:'2024/9/1', endTime:'2025/6/30', num:'39', state:'駁回'},
    {id:3, name:'陳胤華', type:'臨時借用', startTime:'2024/9/1', endTime:'2025/6/30', num:'39', state:'借用中'}
])*/

const authStore = useAuthStore();
const record = ref([]);

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

const handleShowDetail = async (id) =>{
  try{
    const detailResponse = await Record.getGet(id);
    if(detailResponse){
      alert(`詳細資訊：\n編號：${detailResponse.id}`);
    }
  } catch (err){
    console.error("獲取詳細資訊失敗",err);
  }
}
  

function handleCancel(id){
  const item = record.value.find(r => r.id === id)
  if(item.borrow_accepted === null){
    item.state = '取消申請' // 手動加入 state ，可以觸發畫面更新
  }
}
/* 此地方有跟陳胤華討論過，按下"歸還"按鈕，狀態要變為"歸還中"；按下"取消歸還"按鈕，狀態要變為"借用中" (互相轉換狀態)*/
function handleReturn(id){
  const item = record.value.find(r => r.id === id)
  if(item.borrow_accepted === true && item.return_accepted === false){
    if(item.state === '歸還中'){
      item.state = '' // 清空手動狀態，讓它變回"借用中"
    }else{
      item.state = '歸還中'
    }
  }
  
}
</script>

<template>
  <div class="recordWrapper">
    <h1 class="record">申請紀錄</h1>
    <!--監聽名為 'cancel'及'return' 的事件-->
    <RecordTable :records = "record" @cancel = "handleCancel" @return = "handleReturn" @showDetail = "handleShowDetail"/>
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