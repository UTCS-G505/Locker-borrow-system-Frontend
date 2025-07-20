<script setup>
import Record_table from '../components/Record_table.vue';

</script>

<template>
  <h1 class="record">申請紀錄</h1>
  <Record_table />
</template>

<style scoped>
.text{
  font-size: 35px;
  color: black;
  position: absolute;
  top: 16px;
  left: 580px;
}
.navbar span{
  color: black;
  font-weight: bold;
  font-size: 23px;
}
.triangle-down{
  width: 0;
  height: 0;
  margin-top: 12px;
  font-size: 23px;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 6px solid black;
  top: 10px;
  cursor: pointer;
}
#first_text{
  padding-left: 120px;
}
#last_text{
  display: inline-flex;
  gap: 4px;
  color: black;
  font-weight: bold;
  padding-right: 50px;
  font-size: 20px;
  cursor: pointer; /*讓滑鼠變手指 使用者體驗更佳*/
}
.navbar{
  position: absolute;
  top: 110px;
  left: 0%;
  width: 100vw;
  display: flex;
  padding:10px 0;
  justify-content: space-between;
  background-color: aliceblue;
  gap: 10px;
}
.record{
  font-size: 30px;
  color: black;
  position: absolute;
  top: 375px;
  left: 55px;
}

</style>