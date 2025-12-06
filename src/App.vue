<script setup>
import { RouterView } from 'vue-router'
import AppNavBar from './components/AppNavBar.vue';
import AppFooter from './components/AppFooter.vue'

import { ref } from 'vue'
import FailedDialog from './components/FailedDialog.vue'
const failedDialogRef = ref(null)
const submitApplication = () => {
  // 假設這裡是 API 回報錯誤
  console.log("API Error occurred")

  // 呼叫彈窗開啟
  failedDialogRef.value.open()
}
</script>


<template>
  <header>
    <AppNavBar />
  </header>

  <main>
    <button class="trigger" @click="submitApplication">模擬申請失敗</button>
    <RouterView />
    <FailedDialog ref="failedDialogRef" />
  </main>

  <footer>
    <AppFooter />
  </footer>
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
  margin: 0 auto;
  padding: 0;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

main {
  margin: 0 auto;
  padding: 2rem;
}

footer {
  min-height: 10vh;
  margin: 0 auto;
  padding: 2rem;
}
.trigger { 
  background-color: #007BFF;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
}

.trigger:hover {
  background-color: #0056b3;
}
</style>
