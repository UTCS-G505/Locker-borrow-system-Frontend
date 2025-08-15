<script setup>
import { ref } from 'vue'
import PopupModal from './PopupModal.vue';
const emit = defineEmits(['close', 'submit']);

const date = ref(null);
const title = ref('');
const content = ref('');

if(!date.value){
  const today = new Date();
  date.value = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
}

function submit() {
  // 驗證必填
  if (!title.value.trim()) {
    document.getElementById('title').style.borderColor = 'red';
  }
  if (!content.value.trim()) {
    document.getElementById('content').style.borderColor = 'red';
  }
  if (!title.value.trim() || !content.value.trim()) {
    return;
  }

  emit('submit', {
    title: title.value.trim(),
    date: date.value,
    content: content.value.trim()
  })
};
</script>

<template>
  <PopupModal @close="emit('close')">
    <template #header>
      <h2>新增公告</h2>
    </template>

    <template #content>
      <h3>發布日期</h3>
      <input id="date" v-model="date" type="date" placeholder="請輸入日期（必填）" />

      <h3>公告標題 (<span id="title-length">{{ title.length }}</span>/20)</h3>
      <input id="title" v-model="title" type="text" placeholder="請輸入公告標題（必填）" maxlength="20" />
      
      <h3>公告內容</h3>
      <textarea id="content" v-model="content" rows="4" placeholder="請輸入公告內文（必填）"></textarea>
    </template>

    <template #buttons>
      <button class="confirm-button" @click="submit">送出</button>        
    </template>
  </PopupModal>
</template>

<style scoped>
input, textarea {
  width: 100%;
  resize: none;
  padding: 8px;
  font-size: 14px;
  box-sizing: border-box;
  border-radius: 6px;
  border: 1px solid #DFE1E6;
  background-color: #FFF;
  font-family: inherit;
}
.buttons {
  display: flex;
  justify-content: center;
  margin-top: 5px;
}
.confirm-button {
  width: 100px;
  height: 30px;
  color: black;
  background-color: white;
  border-radius: 10px;
  border: 1px solid #DFE1E6;
  font-size: 16px;
  cursor: pointer;
  user-select: none;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
}
.confirm-button:hover {
  background-color: #DFE1E6;
}
</style>
