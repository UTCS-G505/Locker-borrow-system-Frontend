<template>
  <!-- 年級下拉選單 -->
  <select
    id="grade-select"
    :value="modelValue"
    @change="$emit('update:modelValue', $event.target.value)"
    class="grade-select"
  >
    <option v-for="grade in grades" :key="grade" :value="grade">
      {{ grade }}
    </option>
  </select>
</template>

<script setup>
  const grades = ['一年級', '二年級', '三年級', '四年級']

  // 接收父層傳入的 modelValue，用來綁定目前選中的值（v-model）
  defineProps({
    modelValue: String
  })

  // 宣告可發出的事件，這裡是為了支援 v-model 雙向綁定
  defineEmits(['update:modelValue'])
</script>

<style scoped>
  .grade-select {
    padding: 6px 36px 6px 12px;
    border: 1px solid #ccc;
    border-radius: 12px;
    background-color: white;
    color: #333;
    font-size: 16px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    appearance: none;
    background-image: url("data:image/svg+xml;utf8,<svg fill='gray' height='16' viewBox='0 0 24 24' width='16' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>");
    background-repeat: no-repeat;
    background-position: right 8px center;
    background-size: 16px 16px;
  }
  .grade-select:not(:disabled):hover {
    background-color: white; /* 取消灰底 */
    cursor: pointer;
  }

  /* 禁用選項的 hover 背景色（不同瀏覽器處理方式不同） */
  .grade-select option:hover,
  .grade-select option:focus,
  .grade-select option:active {
    background-color: white !important;
    color: #333;
  }
</style>