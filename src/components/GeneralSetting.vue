<script setup>
import { ref } from 'vue'

const today = new Date();
const startDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
const endDate = `${today.getFullYear() + 1}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
const initialStartDate = ref(startDate);
const initialEndDate = ref(endDate);
</script>

<template>
  <div class="general-setting">
    <form class="semester-form" method="post">
      <h3>設定學年起迄</h3>
      <label for="start">學年起：</label>
      <input type="date" class="input-field" id="start" name="start" :value="initialStartDate">
      <label for="end">學年迄：</label>
      <input type="date" class="input-field" id="end" name="end" :value="initialEndDate">
      <button type="submit">儲存</button>
    </form>
    <div class="export-button">
      <h3>資料匯出</h3>
      <button id="borrow-record" type="button">借用紀錄</button>
      <button id="borrow-overview" type="button">借用概況圖</button>
    </div>
  </div>
</template>

<style scoped>
h3 {
  margin-right: 1rem;
}

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
  border: 2px solid #DFE1E6;
  border-radius: 10px;
  margin-right: 1rem;
  padding: 0.5rem;
  font-size: 20px;
}

.semester-form button,
.export-button button {
  background-color: #FFF;
  border: 2px solid #DFE1E6;
  border-radius: 10px;
  font-size: 20px;
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
  .general-setting {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
  }

  .semester-form {
    margin-right: 4rem;
  }

  .export-button button {
    margin: 0 0.5rem;
  }
}
</style>