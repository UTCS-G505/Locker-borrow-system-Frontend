<script setup>
import { ref, watch } from 'vue'
import PopupModal from './PopupModal.vue';

const checkPopup = ref(false)

const open = () => {
  checkPopup.value = true
}

const close = () => {
  checkPopup.value = false
}

const submit = () => {
  alert("successful")
  checkPopup.value = false
}

watch(checkPopup, (val) => {
document.body.style.overflow = val ? 'hidden' : ''
})
</script>

<template>

  <button class="trigger" @click="open">模擬操作確認</button>

  
  <PopupModal @close="close" v-if="checkPopup">
    <template #header>
      <h2>歸還</h2>
    </template>

    <template #content>
      <h3>確認是否歸還</h3>
    </template>

    <template #buttons>
      <button class="confirm-button" @click="submit">確認</button>
      <button class="confirm-button" @click="close">取消</button>     
    </template>
  </PopupModal>

</template>

<style scoped>

/* 按鈕 */
.trigger {
  padding: 2px 12px;
  background: #F3F7F9;
  color:#000000;
  border: 1px solid gray;
  border-radius: 10px;
  cursor: pointer;
  font-size: 15px;
}
.trigger:hover{
  background: #DBDCDD;
}

input, textarea {
  width: 100%;
  resize: none;
  padding: 8px;
  font-size: 14px;
  box-sizing: border-box;
  border-radius: 6px;
  border: 1px solid #DFE1E6;
  color: #000;
  background-color: #FFF;
  font-family: inherit;
}

.buttons {
  display: flex;
  justify-content: center;
  margin-top: 5px;
  gap: 12px; /* 按鈕之間的距離 */
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
  margin: 0 6px;
  
}

.confirm-button:hover {
  background-color: #DFE1E6;
}
</style>
