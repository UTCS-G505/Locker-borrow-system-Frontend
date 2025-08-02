<template>
  <div class="type-select-wrapper">
    <!-- 類型選擇 -->
    <select
      :value="modelValue"
      @change="onTypeChange"
      class="type-select"
    >
      <option v-for="type in typeOptions" :key="type" :value="type">
        {{ type }}
      </option>
    </select>

    <!-- 時間欄位 -->
    <div class="time-picker-inline">
      <div class="time-input-row">
        <span class="label-text">起始時間：</span>
        <input
          type="date"
          v-model="startDate"
          :min="modelValue === '臨時借用' ? today : '2025-09-01'"
          class="time-input"
          :disabled="modelValue === '學年借用'"
        />
      </div>
      <div class="time-input-row">
        <span class="label-text">結束時間：</span>
        <input
          type="date"
          v-model="endDate"
          :min="endMinDate"
          class="time-input"
          :disabled="modelValue === '學年借用'"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, watch, computed } from 'vue'

  defineProps({
    modelValue: {
      type: String,
      default: '學年借用',
    },
  })

  const emit = defineEmits(['update:modelValue', 'update:timeRange'])

  const typeOptions = ['學年借用', '臨時借用']

  const startDate = ref('')
  const endDate = ref('')

  const today = new Date().toISOString().slice(0, 10)

  const endMinDate = computed(() => {
    if (!startDate.value) return today
    return startDate.value > today ? startDate.value : today
  })

  function onTypeChange(event) {
    const selectedType = event.target.value
    emit('update:modelValue', selectedType)

    if (selectedType === '學年借用') {
      startDate.value = '2025-09-01'
      endDate.value = '2026-06-30'
    } else if (selectedType === '臨時借用') {
      const now = new Date()
      const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)
      startDate.value = today
      endDate.value = tomorrow.toISOString().slice(0, 10)
    }

    emit('update:timeRange', {
      start: startDate.value,
      end: endDate.value,
    })
  }

  watch([startDate, endDate], ([start, end]) => {
    if (!start || !end) return

    const correctedEnd = start > today ? start : today
    if (end < start || end < today) {
      endDate.value = correctedEnd
    }

    emit('update:timeRange', {
      start: startDate.value,
      end: endDate.value,
    })
  })
</script>

<style scoped>
  .type-select-wrapper {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: nowrap;
    width: 100%;
  }

  .type-select {
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
    cursor: pointer;
  }

  .time-picker-inline {
    display: flex;
    gap: 16px;
    font-size: 16px;
    flex-wrap: nowrap;
    align-items: center;
  }

  .time-input-row {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .label-text {
    font-weight: 600;
    white-space: nowrap;
  }

  .time-input {
    font-size: 16px;
    padding: 4px 8px;
    border-radius: 4px;
    border: 1px solid #ccc;
  }

  /* RWD */
  @media screen and (max-width: 425px) {
    .type-select-wrapper {
      flex-direction: column;
      align-items: stretch;
      gap: 12px;
    }

    .type-select {
      width: 100%;
      font-size: 16px;
    }

    .time-picker-inline {
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
    }

    .time-input-row {
      width: 100%;
    }

    .label-text,
    .time-input {
      font-size: 16px;
      width: 100%;
    }
  }
</style>