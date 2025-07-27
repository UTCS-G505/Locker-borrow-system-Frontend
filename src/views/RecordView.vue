<script setup>
import { ref } from 'vue'
import Record_table from '../components/Record_table.vue';

/* 先寫死3筆資料，方便檢視 */
const record = ref([
    {id:1, name:'陳胤華', type:'學年借用', start_time:'2024/9/1', end_time:'2025/6/30', num:'39', state:'審核中'},
    {id:2, name:'陳胤華', type:'學年借用', start_time:'2024/9/1', end_time:'2025/6/30', num:'39', state:'駁回'},
    {id:3, name:'陳胤華', type:'臨時借用', start_time:'2024/9/1', end_time:'2025/6/30', num:'39', state:'借用中'}
])

function HandleCancel(id){
  const item = record.value.find(r => r.id === id)
  if(item.state === '審核中'){
    item.state = '取消申請'
  }
}

/* 此地方有跟陳胤華討論過，按下"歸還"按鈕，狀態要變為"歸還中"；按下"取消歸還"按鈕，狀態要變為"借用中" (互相轉換狀態)*/
function HandleReturn(id){
  const item = record.value.find(r => r.id === id)
  if(item.state === '借用中'){
    item.state = '歸還中'
  }else if(item.state === '歸還中'){
    item.state = '借用中'
  }
}

</script>

<template>
  <h1 class="record">申請紀錄</h1>
  <!--監聽名為 'cancel'及'return' 的事件-->
  <Record_table :records = "record" @cancel = "HandleCancel" @return = "HandleReturn"/>
</template>

<style scoped>
  .record{
    font-size: 30px;
    color: black;
    position: absolute;
    top: 120px;
    left: 55px;
}
</style>
