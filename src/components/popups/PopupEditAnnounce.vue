<script setup>
import { ref } from 'vue'
import PopupModal from './PopupModal.vue';

const props = defineProps({
  announcement: {
    type: Object,
    required: true
  }
})
const emit = defineEmits(['close', 'submit']);

const date = ref(props.announcement.date.replaceAll('/', '-'));
const title = ref(props.announcement.title);
const content = ref(props.announcement.content);

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
    id: props.announcement.id,
    title: title.value.trim(),
    date: date.value.replaceAll('-', '/'),
    content: content.value.trim()
  })
};
</script>

<template>
  <PopupModal @close="emit('close')">
    <template #header>
      <h2>編輯公告</h2>
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
.modal-backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.modal-content {
  background: rgba(250, 250, 251, 0.95);
  padding: 24px;
  border-radius: 16px;
  width: 608px;
  max-width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-sizing: border-box;
  box-shadow: 2px 4px 4px rgba(0,0,0,0.35), -1.5px -0.5px 4px rgba(0,0,0,0.25);
}
.modal-header {
  min-height: 60px;
  background-color: #E8F7FFCC;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: -25px -24px 0px -24px;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  box-shadow: 0px 1px 4px 0px #00000040;
}
.content {
  padding: 15px 10px 0;
}
input, textarea {
  width: 100%;
  resize: none;
  padding: 8px;
  font-size: 14px;
  box-sizing: border-box;
  border-radius: 6px;
  border: 1px solid #DFE1E6;
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