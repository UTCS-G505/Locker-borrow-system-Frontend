<script setup>
import { ref, computed } from 'vue'

const searchValue = ref('');

// sample data
const studentsList = [
  { id: 'U11016099', name: '學生一', note: '住宿生註記' },
  { id: 'U11116099', name: '學生二', note: null },
  { id: 'U11216099', name: '學生三', note: '違規註記' },
  { id: 'U11316099', name: '學生四字', note: null },
  { id: 'U11416099', name: 'Student Five Words', note: null }
];

const filteredStudents = computed(() => {
  console.log(searchValue.value);
  if (!searchValue.value.trim())
    return studentsList;
  return studentsList.filter(student =>
    student.name.includes(searchValue.value) ||
    student.id.includes(searchValue.value)
  );
});
</script>

<template>
  <div id="search-bar">
    <input
      type="text"
      id="search"
      name="search"
      placeholder="搜尋"
      v-model="searchValue"
    />
    <label for="search">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
      </svg>
    </label>
  </div>

  <div id="note-board">
    <table>
      <thead>
        <tr>
          <th>學號</th>
          <th>姓名</th>
          <th>註記</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="student in filteredStudents" :key="student.id">
          <td>{{ student.id }}</td>
          <td>{{ student.name }}</td>

          <td v-if="student.note == null">
            <button type="button">住宿生註記</button>
            <button type="button">違規註記</button>
          </td>
          <td v-else>
            {{ student.note }}
            <button type="button">取消</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
#search-bar {
  width: 100%;
}

#search-bar input{
  max-width: 100%;
  border: 2px solid #DFE1E6;
  border-radius: 10px;
  padding: 0.5rem;
  margin-bottom: 1rem;
  font-size: 20px;
}

#search-bar svg {
  margin-left: -30px;
}

#note-board {
  width: 100%;
  overflow-x: auto;
}

table {
  width: 100%;
  min-width: 768px;
  border-collapse: collapse;
  font-size: 20px;
}

thead {
  background-color: #EBF7FF;
  box-shadow: 0 2px 2px 0 #DFE1E6;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  font-size: 25px;
  text-align: left;
}

th, td {
  padding: 0.8rem 0.5rem;
}

th:first-child {
  border-top-left-radius: 10px;
}

th:last-child {
  border-top-right-radius: 10px;
}

button {
  background-color: #FFF;
  border: 2px solid #DFE1E6;
  border-radius: 10px;
  padding: 0 1.5rem;
  margin-right: 1rem;
  font-size: 20px;
}

button:hover {
  background-color: #DFE1E6;
}
</style>