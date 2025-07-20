<script setup>
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
                        <button class="operate_button">詳細資料</button>
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

.inside_table{
    border-radius: 25px; 
    overflow: hidden;
    width: 105%;
    padding: 10px;
    margin: 20px auto;
    background-color: white;
    position: relative;
}

table{
    border-radius: 25px;
    border:4px solid #ECE8E8; 
    border-collapse: separate; 
    border-spacing: 0;
    overflow: hidden;
    width: 97%;
}

tbody tr:last-child td {
  padding-bottom: 50px; /* 你想要的空白高度 */
}

td,th{
    border: none;
    padding: 8px 12px;

}

tr th{
    padding: 4px;
}

tr td{
    text-align: center;
    padding: 4px;
}

.head{
    background-color: aliceblue
}

tbody td{
    border-bottom: 2px solid #ECE8E8;
}

#data{
    font-size: 20px;
    color: black;
    border-spacing: 0px;
}

.bottom_space{
    height: 200px;
}

.operate_button{
    border: none;
    border-color:black;
    background-color: #ECE8E8;
    border-radius: 20px;
    padding: 6px;
}

td{
    font-size: 16px;
    color: black;
}

.empty-row td {
  height: 200px; 
  border: none;
  background: transparent;
}

</style>