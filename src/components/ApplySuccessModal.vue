<script setup>
import {watch} from 'vue';
import PopupModal from '@/components/popups/PopupModal.vue'

const props = defineProps({
  modelValue: Boolean,
  locker: Object,
  borrowType: String,
  timeRange: Object,
  reason: String
})

const emit = defineEmits(['update:modelValue'])

//關閉彈窗函式
function close(){
  emit('update:modelValue', false)
}

//每次modelValue變化時，控制body滾動
watch(() => props.modelValue, (val) => {
    document.body.style.overflow = val ? 'hidden' : ''
});
</script>

<template>
  <PopupModal v-if="modelValue" @close="close">

    <template #header>
      <h2>申請成功</h2>
    </template>

    <template #content>
      <p>申請類型：{{ borrowType }}</p>
      <p>起迄時間：{{ timeRange.start }} ~ {{ timeRange.end }}</p>
      <p>系櫃號碼：{{ locker?.id }}</p>

      <div class="borrow-reason">
        <p>借用理由：</p>
        <p>{{ reason }}</p>
      </div>
    </template>

    <template #buttons>
      <button class="close-button" @click="close">關閉</button>
    </template>

  </PopupModal>
</template>

<style scoped>
  
.close-button {
  width: 100px;
  height: 30px;
  font-size: 16px;
  border-radius: 10px;
  border: 1px solid #DFE1E6;
  background-color: white;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0,0,0,0.25);
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 5px;
}

.close-button:hover {
  background-color:   #DFE1E6;
}

.borrow-reason {
  height: 12vh;
  overflow-y: auto; /* 出現垂直捲軸 */
  overflow-x: hidden; /* 禁止水平捲軸 */
  width: 100%; /* 讓捲動區塊佔滿寬度 */
  word-wrap: break-word; /* 自動換行 */
  word-break: break-word; /* 強制換行，避免長字串溢出 */
  white-space: normal; /* 確保文字可以換行 */
}

@media (max-width: 768px) {
  .borrow-reason {
    max-height: 8vh; /* 手機再縮小高度 */
  }
}
</style>
