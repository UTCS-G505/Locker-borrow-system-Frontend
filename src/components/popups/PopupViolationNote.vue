<script setup>
import { ref } from 'vue'
import PopupModal from './PopupModal.vue';

const props = defineProps({
  user: Object,
});
const emit = defineEmits(['close', 'confirm']);

const reason = ref('');

function confirm() {
  // 驗證必填
  if (!reason.value.trim()) {
    document.getElementsByTagName('textarea')[0].style.borderColor = 'red';
    return;
  }
  emit('confirm', {
    user: props.user,
    reason: reason.value.trim()
  })
};
</script>

<template>
  <PopupModal @close="emit('close')">
    <template #header>
      <h2>違規註記</h2>
    </template>

    <template #content>
      <div class="user-info">
        <h3>學號：{{ user.id }}</h3>
        <h3>姓名：{{ user.name }}</h3>
      </div>
      <h3 class="violation-reason">事由：</h3>
      <textarea id="reason" v-model="reason" rows="4" placeholder="請輸入違規事由（必填）"></textarea>
      <div class="common-reasons">
        <button @click="reason = '未於期限內淨空系櫃'">未於期限內淨空系櫃</button>
        <button @click="reason = '故意損壞系櫃'">故意損壞系櫃</button>
      </div>
    </template>

    <template #buttons>
      <button class="confirm-button" @click="confirm">送出</button>
    </template>
  </PopupModal>
</template>

<style scoped>
.user-info {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.violation-reason {
  margin: 0 0 5px 0;
}

textarea {
  width: 100%;
  resize: none;
  padding: 8px;
  font-size: 14px;
  box-sizing: border-box;
  border-radius: 10px;
  border: 1px solid #DFE1E6;
  font-family: inherit;
}

.common-reasons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 10px;
}

.common-reasons button {
  width: 100%;
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

.common-reasons button:hover {
  background-color: #DFE1E6;
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

@media screen and (max-width: 600px) {
  .user-info {
    grid-template-columns: 1fr;
  }
  
  .common-reasons {
    grid-template-columns: 1fr;
  }
}
</style>