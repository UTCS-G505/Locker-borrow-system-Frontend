<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <h3>公誠樓三樓</h3>
      <p>{{ grade }}</p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps(['grade'])
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}
.modal-content {
  background: linear-gradient(to bottom, #cfe2f3 50%, #ffffff 50%);
  padding: 24px;
  border-radius: 12px;
  min-width: 300px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  text-align: left;
}
</style>