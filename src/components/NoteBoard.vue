<script setup>
import { onMounted } from 'vue';      
import { User } from '@/api/main.js'; 
import { ref, computed } from 'vue'
import { SsoUser } from '@/api/sso';
import IconSearch from './icons/IconSearch.vue';
import PopupViolationNote from './popups/PopupViolationNote.vue';
import CheckPopup from './popups/CheckPopup.vue';

const searchValue = ref('');
const showPopup = ref(false);
const showPopupCheck=ref(false);
const selectedStudent = ref(null);
const title = ref('');

// Note ID
const USER_STATE = { NONE: 0, DORM: 1, VIOLATION: 2 };

// 空的響應式陣列，用來接 API 資料
const studentsList = ref([]);

// 直接填入學號姓名在Board上
onMounted(async () => {
  const data = await User.getAll();
  if (!data) return;

  studentsList.value = await Promise.all(
    data.map(async (user) => {
      const apiData = await getUserData(user.id);
      let note = null;
      switch (user.state) {
        case 1:
          note = '住宿生註記';
          break;
        case 2:
          note = '違規註記';
          break;
      }

      return {
        id: apiData[0],
        name: apiData[1],
        note: note
      };
    })
  );
});

const filteredStudents = computed(() => {
  return studentsList.value.filter(student =>
      !searchValue.value.trim() ||
      student.id.includes(searchValue.value) ||
      student.name.includes(searchValue.value) ||
      searchValue.value === '無註記' && !student.note ||
      searchValue.value === '住宿生註記' && student.note === '住宿生註記' ||
      searchValue.value === '違規註記' && student.note === '違規註記'
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
  title.value = '住宿生註記';
  selectedStudent.value = student;
  showPopupCheck.value = true;
};
const handleDormitoryNote = async () => {
  try {
    await User.postNote(selectedStudent.value.id, USER_STATE.DORM, null);
    selectedStudent.value.note = '住宿生註記';
    title.value = '';
  } catch (err) {
    console.error("dormitory note failed!", err);
    alert("發生錯誤！住宿生註記失敗");
  }
  showPopupCheck.value = false;
}

const violationNote = (student) => {
  selectedStudent.value = student;
  showPopup.value = true;
};
const handleViolationNote = async ( payload ) => {
  const { user, reason } = payload;
  try {
    await User.postNote(user.id, USER_STATE.VIOLATION, reason);
    selectedStudent.value.note = '違規註記';
    alert(`學號：${user.id}\n姓名：${user.name}\n事由：${reason}`);
  } catch (err) {
    console.error("violation note failed!", err);
    alert("發生錯誤！違規註記失敗");
  }
  showPopup.value = false;
}

const clearNote = (student) =>{
  selectedStudent.value = student;
  title.value = '取消註記'
  showPopupCheck.value = true;
}
const handleClearNote = async () => {
   try {
    await User.postNote(selectedStudent.value.id, USER_STATE.NONE, null);
    selectedStudent.value.note = null;
    title.value = ''
  } catch (err) {
    console.error("clear note failed!", err);
    alert("發生錯誤！註記清除失敗");
  }
  showPopupCheck.value = false;
};

const confirmWhat =()=>{
  if(title.value==='住宿生註記') handleDormitoryNote();
  else if(title.value==='取消註記') handleClearNote();
}

let getUserData = async (userId) => {
  //沒有被借走的話就顯示空字串
  if(userId === null){
    return null;
  }

  let data = await SsoUser.getGet(userId);
  let value = ['', ''];
  console.log(data);
  if( data !== null) {
    value[0] = data.account;
    value[1] = data.name;
  }
  return value;
}

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

  <PopupViolationNote
    v-if="showPopup"
    :user="selectedStudent"
    @close="showPopup = false"
    @confirm="handleViolationNote"
  />

  <CheckPopup
    v-if="showPopupCheck"
    :operation="title"
    @close="showPopupCheck = false"
    @confirm="confirmWhat"
  />
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
  box-shadow: 0 2px 4px #0000001a;
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
  min-width: 1024px;
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

tr {
  border-bottom: rgba(236,232,232,.35) solid 4px;
}

th, td {
  padding: 0.8rem;
}

th:first-child {
  border-top-left-radius: 10px;
}

th:last-child {
  border-top-right-radius: 10px;
}

th:first-child, td:first-child {
  width: 20%;
  min-width: 200px;
}

th:nth-child(2), td:nth-child(2) {
  width: 30%;
  min-width: 450px;
}

th:last-child, td:last-child {
  min-width: 400px;
}

button {
  color: #000;
  background-color: #FFF;
  border: 2px solid #DFE1E6;
  border-radius: 10px;
  padding: 0 1.5rem;
  margin-right: 1rem;
  font-size: 20px;
  box-shadow: 0 2px 4px #0000001a;
}

button:hover {
  background-color: #DFE1E6;
  cursor: pointer;
}

@media screen and (max-width: 425px) {
  #search-bar input::-webkit-input-placeholder {
    font-size: 16px;
  }

  table {
    min-width: 700px;
    font-size: 16px;
  }

  thead {
    font-size: 20px;
  }
  
  button {
    font-size: 16px;
  }
}
</style>
