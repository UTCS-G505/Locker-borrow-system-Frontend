<script setup>
import { ref } from 'vue'

defineProps({
  board: {
    type: String,
    default: 'note',
    required: true
  }
})

const emit = defineEmits(['update:board'])

const today = new Date();
const startDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
const endDate = `${today.getFullYear() + 1}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
const initialStartDate = ref(startDate);
const initialEndDate = ref(endDate);

const updateSemesterInterval = () => {
  const start = document.getElementById('start').value;
  const end = document.getElementById('end').value;
  if(end <= start){
    // TODO: alert popup, message:"學年結束時間應晚於學年起始時間"
    return;
  }
};

const handleBorrowHistory = () => {
  console.log('handleBorrowHistory');
  // window.open('/export/history', '_blank', 'noopener');
};
const handleBorrowOverview = () => {
  console.log('handleBorrowOverview');
  // window.open('/export/overview', '_blank', 'noopener');
};
</script>

<template>
  <div id="general-setting">
    <div>
      <div class="board-select">
        <select id="boardselect" :value="board" @change="emit('update:board', $event.target.value)">
          <option value="note">身分註記</option>
          <option value="announcement">公告與規則</option>
        </select>
      </div>
      <form class="semester-form" @submit.prevent="updateSemesterInterval">
        <label for="start">學年起：</label>
        <input type="date" class="input-field" id="start" name="start" :value="initialStartDate">
        <label for="end">學年迄：</label>
        <input type="date" class="input-field" id="end" name="end" :value="initialEndDate">
        <button type="submit">儲存</button>
      </form>
    </div>
    <div class="export-button">
      <button id="borrow-record" type="button" @click="handleBorrowHistory">借用紀錄</button>
      <button id="borrow-overview" type="button" @click="handleBorrowOverview">借用概況圖</button>
    </div>
  </div>
</template>

<style scoped>
#boardselect {
  min-width: 160px;
  border: 2px solid #DFE1E6;
  border-radius: 10px;
  padding: 0.5rem;
  margin-right: 1rem;
  font-size: 16px;
  box-shadow: 0 2px 4px #0000001a;
  appearance: none;
  background-color: #FFF;
  background-image: url("data:image/svg+xml;utf8,<svg fill='gray' height='16' viewBox='0 0 24 24' width='16' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>");
  background-repeat: no-repeat;
  background-position: right 8px center;
  background-size: 16px 16px;
}

.board-select,
.semester-form,
.export-button {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: left;
  font-size: 20px;
  margin-bottom: 1rem;
}

.semester-form .input-field {
  color: #000;
  background-color: #FFF;
  border: 2px solid #DFE1E6;
  border-radius: 10px;
  margin-right: 1rem;
  padding: 0.5rem;
  font-size: 16px;
  box-shadow: 0 2px 4px #0000001a;
}

.semester-form button,
.export-button button {
  background-color: #FFF;
  border: 2px solid #DFE1E6;
  border-radius: 10px;
  font-size: 16px;
  box-shadow: 0 2px 4px #0000001a;
}

.semester-form button {
  padding: 0.5rem;
}

.export-button button {
  padding: 0.5rem 1rem;
  margin: 0 1rem;
}

.semester-form button:hover,
.export-button button:hover {
  background-color: #DFE1E6;
}

select, button {
  cursor: pointer;
  color: #000;
}

@media screen and (min-width: 426px) {
  #boardselect,
  .semester-form label,
  .semester-form .input-field,
  .semester-form button,
  .export-button button {
    font-size: 20px;
  }
}

@media screen and (max-width: 1439px) {
  #borrow-record {
    margin-left: 0;
  }
}

@media screen and (max-width: 1024px) {
  .semester-form {
    flex-direction: column;
    align-items: start;
  }

  .semester-form label,
  .semester-form button {
    margin-top: 0.5rem;
  }

  .semester-form .input-field,
  .semester-form button,
  .export-button button {
    width: 100%;
  }

  .export-button {
    flex-direction: column;
    align-items: start;
  }
  
  .export-button button {
    margin-top: 0.5rem;
    margin-left: 0;
  }
}

@media screen and (min-width: 1440px) {
  #general-setting {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  #general-setting div{
    display: flex;
    flex-direction: row;
  }

  .semester-form {
    margin-right: 4rem;
  }

  .export-button button {
    margin: 0 0.5rem;
  }
}
</style>
