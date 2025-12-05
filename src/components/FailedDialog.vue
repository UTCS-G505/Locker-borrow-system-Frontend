<script setup>
import { ref } from 'vue'
import PopupModal from './popups/PopupModal.vue'

const showDialog = ref(false)

const open = () => {
  showDialog.value = true
}

const close = () => {
  showDialog.value = false
}

defineExpose({
  open
})
</script>

<template>
  <PopupModal v-if="showDialog" @close="close">

    <template #header>
      <h1 class="title">申請失敗</h1>
    </template>
    <template #content>
      <hr class="divider" />
      <p class="message">您的申請未能通過。</p>
    </template>
    <template #buttons>
    </template>

  </PopupModal>
</template>

<style scoped>
.trigger {
  font-size:1.2rem;
  background: rgb(150, 183, 244); /* 淺藍色 */
  color: #000000;
  border: none;
  padding: 0.6rem 1.8rem; /* 本來是0.8rem 2.0rem */
  border-radius: 0.2rem;
  cursor: pointer;
  transition: background 0.2s;
}
.trigger:hover {
  background: #016bff;  /* 深藍色 */
}

.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.dialog {
  width: 40%;
  height: 30%;
  background: #f6f7f9f2;
  border-radius: 16px;
  box-shadow:
    2px 4px 4px rgba(0, 0, 0, 0.35),
    -1.5px -0.5px 4px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
}

.dialog-header {
  width: 100%;
  background: #EFF9FFCC;
  padding: 10px 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.title {
  font-size: 2.5rem;
  font-weight: 450;
  color: #000000ff;
  margin: 0;
}

.divider {
  width: 100%;
  border: none;
  border-top: 1px solid #ccc;
  margin: 0;
}

.message {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  color: #000000ff;
  text-align: center;
  width: 100%;
  margin: 0;
}
</style>
