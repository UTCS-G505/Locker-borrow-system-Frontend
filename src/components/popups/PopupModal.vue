<script setup>
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
          <slot name="header"></slot>
        </div>
        <div class="content">
          <slot name="content"></slot>
        </div>
        <div class="buttons">
          <slot name="buttons"></slot>
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
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.modal-content {
  background: rgba(250, 250, 251, 0.95);
  padding: 24px;
  border-radius: 16px;
  width: 608px;
  max-width: 90%;
  max-height: 90vh;
  overflow-y: auto;
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
  padding: 15px 10px 0;
}
.buttons {
  display: flex;
  justify-content: center;
  margin-top: 5px;
}
</style>