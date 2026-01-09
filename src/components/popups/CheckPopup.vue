<!-- 標題為空的確認彈窗，依照不同按鈕套用
點擊後有close,confirm兩種形式，依照個別確認指令可串接不同操作 -->

<script setup>
//import { ref, watch } from 'vue'
import PopupModal from './PopupModal.vue';

defineProps({
  operation:String,
})

const emit = defineEmits(['close', 'confirm']);
</script>

<template>
  <PopupModal @close="emit('close')">
    <template #header>
      <h2>{{operation}}</h2>
    </template>

    <template #content>
      <h3>是否確認執行此操作？</h3>
    </template>

    <template #buttons>
      <button class="confirm-button" @click="emit('confirm')">確認</button>
      <button class="confirm-button" @click="emit('close')">取消</button>     
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
