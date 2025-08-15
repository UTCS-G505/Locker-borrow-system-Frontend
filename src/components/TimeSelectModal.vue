<!-- TimeSelectModal.vue -->
<template>
  <div class="modal-backdrop" @click.self="close">
    <div class="modal-content">
      <h3 v-if="locker"> 選擇借用時間 - 櫃子 {{ locker.name }}</h3>
      <h3 v-else> 選擇借用的時間</h3>
      <input type="datetime-local" v-model="selectedTime" />

      <div class="modal-actions">
        <button @click="confirm">確定</button>
        <button @click="close">取消</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue' 

const props = defineProps({
  locker: Object,
})

const emit = defineEmits(['confirm', 'close'])

const selectedTime = ref(null)

function confirm() {
  if (selectedTime.value) {
    emit('confirm', {
      locker: props.locker,
      time: selectedTime.value,
    })
  }
}
function close() {
  emit('close')
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0; left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.3);
  min-width: 300px;
}

.modal-actions {
  margin-top: 16px;
  display: flex;
  justify-content: space-between;
}
</style>
