<script setup>

import { defineEmits } from 'vue';

const emit = defineEmits(['close']);

function close() {
  emit('close')
};
</script>

<template>
  <Teleport to="body">
    <div class="modal-backdrop" @click.self="close">
      <div class="modal-content">

        <div class="modal-header">
          <slot name="登入"></slot>
        </div>
        <div class="content">
          <slot name="帳號"></slot>
        </div>
        <div class="content">
          <slot name="密碼"></slot>
        </div>
        <div class="content slot-hint">
          <slot name="提示"></slot>
        </div>
        <div class="buttons">
          <slot name="送出"></slot>
        </div>

      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.content.slot-hint {
    padding: 0px 10px 2px; /* 移除頂部間距，增加底部間距 */
    margin-top: 18px; /* 向上微調，靠近密碼欄位 */
}
.modal-backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(0,0,0,0.5);
  z-index: 1000;

  display: flex;
  justify-content: center; 
  align-items: center;
}
.modal-content {
  background: rgba(250, 250, 251, 0.95);
  padding: 24px;
  border-radius: 16px;
  width: 400px;
  max-width: 90%;
  height: 300px;
  max-height: 90vh;
  box-sizing: border-box;
  box-shadow: 2px 4px 4px rgba(0,0,0,0.35), -1.5px -0.5px 4px rgba(0,0,0,0.25);
  overflow: auto;
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
  display: flex;
  flex-direction: column;
  gap: 25px;
  padding: 20px 18px 0;
  align-items: center;
  justify-content: center; 
}
.content > div {
  display: flex;
  align-items: center;
  justify-content: center; 
}
.buttons {
  display: flex;
  justify-content: center;
  margin-top: 5px;
}
.confirm-button {
  width: 150px;
  height: 50px;
  color: black;
  background-color: white;
  border-radius: 10px;
  border: 1px solid #DFE1E6;
  font-size: 18px;
  cursor: pointer;
  user-select: none;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
}
.confirm-button:hover {
  background-color: #DFE1E6;
}
</style>