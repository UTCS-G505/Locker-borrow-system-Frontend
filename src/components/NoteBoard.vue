<script setup>
import { ref, computed } from 'vue'
import IconSearch from './icons/IconSearch.vue';

const searchValue = ref('');

// sample data
const studentsList = ref([
  { id: 'U11016099', name: '學生一', note: '住宿生註記' },
  { id: 'U11116099', name: '學生二', note: null },
  { id: 'U11216099', name: '學生三', note: '違規註記' },
  { id: 'U11316099', name: '學生四', note: null },
  { id: 'U11416099', name: 'Student Five', note: null },
  { id: 'G11016099', name: '學生六', note: '住宿生註記' },
  { id: 'G11116099', name: '學生七', note: null },
  { id: 'G11216099', name: '學生八', note: '違規註記' },
  { id: 'G11316099', name: '學生九', note: null },
  { id: 'G11416099', name: '學生十', note: null },
  { id: 'M11016099', name: '學生十一', note: '住宿生註記' },
  { id: 'M11116099', name: '學生十二', note: null },
  { id: 'M11216099', name: 'Student Thirteen', note: null },
  { id: 'M11316099', name: '學生十四', note: null },
  { id: 'M11416099', name: '學生十五', note: null },
  { id: 'U11316100', name: '學生十六', note: '住宿生註記' },
  { id: 'U11316101', name: '學生十七', note: '違規註記' },
  { id: 'U11316102', name: '學生十八', note: '住宿生註記' },
  { id: 'U11316103', name: '學生十九', note: null },
  { id: 'U11316104', name: '學生二十', note: null },
  { id: 'U11316105', name: 'Student Twenty First', note: null },
  { id: 'U11316106', name: 'Student Twenty Second', note: null },
  { id: 'U11316107', name: 'Student Twenty Third', note: '違規註記' },
  { id: 'U11316108', name: 'Student Twenty Fourth', note: null },
  { id: 'U11316109', name: 'Student Twenty Fifth', note: null },
]);

const filteredStudents = computed(() => {
  return studentsList.value.filter(student =>
      !searchValue.value.trim() ||
      student.id.includes(searchValue.value) ||
      student.name.includes(searchValue.value)
    ).sort((studentA, studentB) => {
    const code = ['U', 'G', 'M'];
    if (code.indexOf(studentA.id.charAt(0)) < code.indexOf(studentB.id.charAt(0))) return -1;
    if (code.indexOf(studentA.id.charAt(0)) > code.indexOf(studentB.id.charAt(0))) return 1;
    if (studentA.id.substring(1) < studentB.id.substring(1)) return -1;
    if (studentA.id.substring(1) > studentB.id.substring(1)) return 1;
    return 0;
  });
});

const dormitoryNote = (student) => {
  student.note = '住宿生註記';
};
const violationNote = (student) => {
  student.note = '違規註記';
};
const clearNote = (student) => {
  student.note = null;
};
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
      <IconSearch />
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
            <button type="button" @click="dormitoryNote(student)">住宿生註記</button>
            <button type="button" @click="violationNote(student)">違規註記</button>
          </td>
          <td v-else>
            {{ student.note }}
            <button type="button" @click="clearNote(student)">取消</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
#search-bar {
  max-width: 100%;
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
