<script setup>
import { ref } from 'vue'

const checkPopup = ref(false)

const open = () => {
  checkPopup.value = true
}

const close = () => {
  checkPopup.value = false
}
</script>

<template>
    <button class="trigger" @click="open">模擬操作確認</button>
    <div v-if="checkPopup" class="overlay" @click.self="close">
        <div class="checkPopup">
            <h1 class="value">是否確認執行此操作？</h1>
            <!-- 確認、返回按鈕 -->
            <div class="button-group">
              <button class="button-confirm" @click.self="close">確認</button>
              <button class="button-cancel" @click.self="close">返回</button>
            </div>
        </div>
    </div>
    
</template>

<style scoped>

/* 按鈕 */
.trigger {
  padding: 8px 16px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

/* 覆蓋背景 */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

/* 彈窗本體 */
.checkPopup {
  background: white;
  width: 400px;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

/* 內文 */
.value{
 text-align: center;
}

/* 確認、返回按鈕 */
.button-group {
      display: flex;
      justify-content: center;
      gap: 15px;
      margin-top: 30px;
    }

    .button-group button {
      padding: 10px 20px;
      font-size: 16px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .button-confirm {
      background-color: #4CAF50;
      color: white;
    }

    .button-confirm:hover {
      background-color: #7dc381;
    }

    .button-cancel {
      background-color: #ccc;
      color: #333;
    }

    .button-cancel:hover {
      background-color: #bbb;
    }

</style>