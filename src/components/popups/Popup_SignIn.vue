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
        <div class="buttons">
          <slot name="送出"></slot>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
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
   
  width: 398px;
  max-width: 90%;
  height: 292px;
  max-height: 90vh;
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
  display: flex;
  flex-direction: column;
  gap: 25px;
  padding: 15px 10px 0;
  align-items: center;
}

.content > div {
  align-items: center;
}

.buttons {
  display: flex;
  justify-content: center;
  margin-top: 5px;
}
</style>