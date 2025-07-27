<script setup>

/* 子元件用props接收父元件傳來的record資料，它是個Array*/
const props = defineProps({
    records: Array
})

/* 讓子元件可以合法發出事件(沒有這行可能會出錯) */
const emit = defineEmits(['cancel','return'])

function cancel(id){
    emit('cancel',id)
}

function toggleReturn(id){
    emit('return',id)
}

</script>

<template>
    <div class="all_table"> 
        <div class="inside_table">
        <table>
            <thead class="head">
                <tr id="data">
                    <th>申請人</th>
                    <th>借用類型</th>
                    <th>開始時間</th>
                    <th>結束時間</th>
                    <th>系櫃編號</th>
                    <th>詳細資訊</th>
                    <th>狀態</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
                <!--用item.id(唯一值)比較安全，index可能因為資料排序而有變動-->
                <tr v-for="(item,index) in props.records" :key="item.id">
                    <td>{{item.name}}</td>
                    <td>{{item.type}}</td>
                    <td>{{item.start_time}}</td>
                    <td>{{item.end_time}}</td>
                    <td>{{item.num}}</td>
                    <td>
                        <button class="operate_button">詳細資訊</button>
                    </td>
                    <td>{{item.state}}</td>
                    <td>
                        <button v-if="item.state === '審核中' " @click="cancel(item.id)"  class="operate_button">取消申請</button> 
                        <button v-else-if="item.state === '借用中' || item.state === '歸還中' " @click="toggleReturn(item.id)" class="operate_button">
                            {{item.state === '借用中'?'歸還':'取消歸還'}}
                        </button>
                    </td>
                </tr>
                <tr class="empty-row"> <!-- "empty-row" 作用是第三筆資料輸出後，下面留的空白處-->
                    <td colspan="8"></td> <!-- " colspan="8" "作用是要橫跨8個欄位的寬度-->
                </tr>
            </tbody>
        </table>
        </div>
    </div>
</template>

<style>

/*
    table那邊外層包了兩個<div>，我有嘗試過包一層會沒效果，包兩層才有，
    然後CSS設定在第二層，這部分我有先跟Allen說過，那邊有點玄(?)，歡迎電神們的討論~~
*/

.inside_table{
    position: relative;
    border-radius: 25px; 
    overflow: hidden; /* 跟 border-radius 做搭配，讓內容不要超出圓角邊框 */
    width: 105%;
    padding: 10px;
    margin: 20px auto;
    background-color: white;
}

table{
    border-radius: 25px;
    overflow: hidden;
    border:4px solid #ECE8E8; 
    border-collapse: separate; /* 如果用collapse，圓角會被吃掉 */
    border-spacing: 0;
    width: 97%;
}

.head{
    background-color: aliceblue;
}

.head th{
    border-bottom:2px solid #ECE8E8;
}

#data{
    font-size: 20px;
    color: black;
    border-spacing: 0px;
}

tr th{
    padding: 4px;
}

tr td{
    text-align: center; /* 字體置中 */
    padding: 4px;
    font-size: 17px;
    color: black;
    border-bottom: 2px solid #ECE8E8; /* 每一筆資料結束後，下面加入線條使每一筆資料分隔 */
}

td,th{
    border: none; /* 不要有預設的格線 */
    padding: 8px 12px; /* 上下8px，左右12px */
}

.operate_button{
    border: none;
    background-color: #ECE8E8;
    border-radius: 10px;
    padding: 2px 8px;
    cursor: pointer;
}

.empty-row td {
  height: 200px; /* 製作下方空白處 */
  border: none;
  background: transparent;
}

</style>