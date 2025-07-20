<script setup>
/* 
    下面有個"empty-row" 作用是第三筆資料輸出後，下面留的空白處；
    而" colspan="8" "作用是要橫跨 8 欄位的寬度
*/
const record = [
    {name:'陳胤華', type:'學年借用', start_time:'2024/9/1', end_time:'2025/6/30', num:'39', state:'審核中'},
    {name:'陳胤華', type:'學年借用', start_time:'2024/9/1', end_time:'2025/6/30', num:'39', state:'駁回'},
    {name:'陳胤華', type:'臨時借用', start_time:'2024/9/1', end_time:'2025/6/30', num:'39', state:'借用中'}
]
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
                <tr v-for="(item,index) in record" :key="index">
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
                        <button v-if="index == 0" class="operate_button">取消申請</button> 
                        <button v-else-if="index == 2" class="operate_button">歸還</button>
                    </td>
                </tr>
                <tr class="empty-row">
                    <td colspan="8"></td>
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
}

.empty-row td {
  height: 200px; /* 製作下方空白處 */
  border: none;
  background: transparent;
}

</style>