<template>
  <select
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

  defineProps({
    modelValue: String
  })

  defineEmits(['update:modelValue'])
</script>

<style scoped>
  .grade-select {
    padding: 6px 36px 6px 12px;
    border: 1px solid #ccc;
    border-radius: 12px;
    background-color: white;
    color: #333;
    font-size: 18px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    appearance: none;
    background-image: url("data:image/svg+xml;utf8,<svg fill='gray' height='16' viewBox='0 0 24 24' width='16' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>");
    background-repeat: no-repeat;
    background-position: right 8px center;
    background-size: 16px 16px;
  }
</style>