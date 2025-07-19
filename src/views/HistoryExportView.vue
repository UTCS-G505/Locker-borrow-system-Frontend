<script setup>
import { ref } from 'vue';


// sample data
const students = ref([
  { id: 'A123456789', name: 'John Doe', type: '學年借用', startTime: '2023-01-01', endTime: '2023-06-30', lockerNo: '11' },
  { id: 'B987654321', name: 'Jane Smith', type: '學期借用', startTime: '2023-07-01', endTime: '2023-12-31', lockerNo: '12' },
  { id: 'C567890123', name: 'Bob Johnson', type: '學年借用', startTime: '2023-01-01', endTime: '2023-06-30', lockerNo: '13' },
  { id: 'D321098765', name: 'Alice Brown', type: '學期借用', startTime: '2023-07-01', endTime: '2023-12-31', lockerNo: '14' },
  { id: 'E890123456', name: 'Charlie Davis', type: '學年借用', startTime: '2023-01-01', endTime: '2023-06-30', lockerNo: '15' },
  { id: 'F654321098', name: 'Emily Wilson', type: '學期借用', startTime: '2023-07-01', endTime: '2023-12-31', lockerNo: '16' },
  { id: 'G123456789', name: 'Michael Johnson', type: '學年借用', startTime: '2023-01-01', endTime: '2023-06-30', lockerNo: '17' },
  { id: 'H987654321', name: 'Olivia Taylor', type: '學期借用', startTime: '2023-07-01', endTime: '2023-12-31', lockerNo: '18' },
  { id: 'I567890123', name: 'William Anderson', type: '學年借用', startTime: '2023-01-01', endTime: '2023-06-30', lockerNo: '19' },
  { id: 'J321098765', name: 'Sophia Thomas', type: '學期借用', startTime: '2023-07-01', endTime: '2023-12-31', lockerNo: '20' },
  { id: 'K890123456', name: 'James Clark', type: '學年借用', startTime: '2023-01-01', endTime: '2023-06-30', lockerNo: '21' },
  { id: 'L654321098', name: 'Emma Lewis', type: '學期借用', startTime: '2023-07-01', endTime: '2023-12-31', lockerNo: '22' },
  { id: 'M123456789', name: 'Benjamin Walker', type: '學年借用', startTime: '2023-01-01', endTime: '2023-06-30', lockerNo: '23' },
  { id: 'N987654321', name: 'Isabella Hall', type: '學期借用', startTime: '2023-07-01', endTime: '2023-12-31', lockerNo: '24' },
  { id: 'O567890123', name: 'Lucas Young', type: '學年借用', startTime: '2023-01-01', endTime: '2023-06-30', lockerNo: '25' },
  { id: 'P321098765', name: 'Mia Adams', type: '學期借用', startTime: '2023-07-01', endTime: '2023-12-31', lockerNo: '26' },
])

window.print();
</script>

<template>
  <h1>臺北市立大學資訊科學系 系櫃借用紀錄表</h1>
  <table>
    <thead>
      <tr>
        <th>申請人學號</th>
        <th>姓名</th>
        <th>借用類型</th>
        <th>起始日期</th>
        <th>結束日期</th>
        <th>系櫃編號</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="student in students" :key="student.id">
        <td>{{ student.id }}</td>
        <td>{{ student.name }}</td>
        <td>{{ student.type }}</td>
        <td>{{ student.startTime }}</td>
        <td>{{ student.endTime }}</td>
        <td>{{ student.lockerNo }}</td>
      </tr>
    </tbody>
  </table>
  <p id="print-date">列印日期: {{ new Date().toLocaleString() }}</p>
</template>

<style scoped>
h1 {
  text-align: center;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  margin-bottom: 20px;
}

th, td {
  padding: 8px;
  text-align: left;
  border: 1px solid #ddd;
}

#print-date {
  text-align: right;
}

@page {
  size: A4, portrait;
}

@media print {
  tr {
    break-inside: avoid;
  }
}
</style>