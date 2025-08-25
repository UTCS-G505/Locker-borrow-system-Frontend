<template>
  <div class="title">
    <h1>申請借用頁面</h1>

    <button class="submit-btn" @click="showSuccessModal = true">送出</button>

    <!-- 彈窗元件 -->
    <ApplySuccessModal v-model:modelValue="showSuccessModal" />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import ApplySuccessModal from '@/components/ApplySuccessModal.vue'

const showSuccessModal = ref(false)

watch(showSuccessModal, (val) => {
document.body.style.overflow = val ? 'hidden' : ''
})
</script>

<style scoped>
.submit-btn {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  font-size: 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
.submit-btn:hover {
  background-color: #0056b3;
}

@media (min-width: 1024px) {
  .title {
    min-height: 100vh;
    display: flex;
    align-items: center;
    flex-direction: column;
  }
}
</style>
