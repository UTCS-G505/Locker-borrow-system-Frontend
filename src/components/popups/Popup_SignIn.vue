<script setup>
import { defineEmits } from 'vue';
import PopupModal from './PopupModal.vue'; 

const emit = defineEmits(['close']);

function close() {
  emit('close')
};
</script>

<template>
  <PopupModal @close="close">
    
    <template #header>
      <slot name="登入"></slot>
    </template>

    <template #content>
      <div class="signin-layout">
        <div class="input-group">
          <slot name="帳號"></slot>
        </div>

        <div class="input-group">
          <slot name="密碼"></slot>
        </div>

        <div class="hint-group">
          <slot name="提示"></slot>
        </div>
      </div>
    </template>

    <template #buttons>
      <slot name="送出"></slot>
    </template>

  </PopupModal>
</template>

<style scoped>

.signin-layout {
  display: flex;
  flex-direction: column;

  align-items: center;
  gap: 20px; 
  padding: 7px 0;
}

:deep(.modal-content) {
  width: 400px; 
  max-width: 90%; 
}

.input-group {
  width: 70%;
  display: flex;
  justify-content: center;
}

.hint-group {
  margin-top: -5px; 
  width: 70%;
  display: flex;
  justify-content: center;
}
</style>