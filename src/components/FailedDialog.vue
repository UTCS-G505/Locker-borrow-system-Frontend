<script setup>
import { ref } from 'vue'

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
  <Teleport to="body">
    <div v-if="showDialog" class="modal-backdrop" @click.self="close">
      <div class="modal-content">

        <div class="modal-header">
          <h1 class="title">申請失敗</h1>
        </div>

        <div class="content">
          <div class="message-container">
            <p class="message">您的申請未能通過。</p>
          </div>
        </div>

        <div class="buttons">
        </div>

      </div>
    </div>
  </Teleport>
</template>

<style scoped>
/* =========================================
   1. 這裡補上 PopupModal 模板原本的 CSS
   (原本你的 CSS 寫的是 overlay/dialog，這裡要改成對應 HTML 的名稱)
   ========================================= */

.modal-backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(0,0,0,0.5); /* 半透明黑底 */
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
  max-width: 90%; /* 手機版防爆版 */
  max-height: 90vh;
  overflow-y: auto;
  box-sizing: border-box;
  box-shadow: 2px 4px 4px rgba(0,0,0,0.35), -1.5px -0.5px 4px rgba(0,0,0,0.25);
}

.modal-header {
  min-height: 60px;
  background-color: #E8F7FFCC; /* 淺藍色標題底 */
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
  min-height: 20px; /* 避免沒按鈕時下方太空 */
} 
.title {
  font-size: 2.5rem;
  font-weight: 450;
  color: #000000ff;
  margin: 0;
}

.message-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30px 0; /* 增加一點上下距離比較好看 */
}

.message {
  font-size: 2rem;
  color: #000000ff;
  text-align: center;
  margin: 0;
}
</style>
