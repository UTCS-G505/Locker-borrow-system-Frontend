<template>
  <div
    class="type-select-wrapper"
    :class="{
      'temporary-mode': modelValue === '臨時借用',
      'year-mode': modelValue === '學年借用',
    }"
  >
    <!-- 類型選擇 -->
    <select
      id="type-select"
      :value="modelValue"
      @change="onTypeChange"
      class="type-select"
    >
      <option v-for="type in typeOptions" :key="type" :value="type">
        {{ type }}
      </option>
    </select>

    <!-- 時間欄位 -->
    <div class="time-align">
      <div class="time-picker-inline">
        <div class="time-input-row">
          <label for="start-date" class="label-text">起始時間：</label>
          <input
            id="start-date"
            type="date"
            v-model="startDate"
            :min="modelValue === '臨時借用' ? today : '2025-09-01'"
            class="time-input"
            :disabled="modelValue === '學年借用'"
          />
        </div>
        <div class="time-input-row">
          <label for="end-date" class="label-text">結束時間：</label>
          <input
            id="end-date"
            type="date"
            v-model="endDate"
            :min="endMinDate"
            class="time-input"
            :disabled="modelValue === '學年借用'"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, watch, computed, onMounted } from 'vue'

  const props = defineProps({
    modelValue: {
      type: String,
      default: '學年借用',
    },
  })

  const emit = defineEmits(['update:modelValue', 'update:timeRange'])

  const typeOptions = ['學年借用', '臨時借用']

  const startDate = ref('')
  const endDate = ref('')
  const today = new Date().toLocaleDateString('sv-SE')

  const endMinDate = computed(() => {
    if (!startDate.value) return today
    return startDate.value > today ? startDate.value : today
  })

  function initializeDates(type) {
    if (type === '學年借用') {
      startDate.value = '2025-09-01'
      endDate.value = '2026-06-30'
    } else {
      const tomorrow = new Date(Date.now() + 86400000)
      startDate.value = today
      endDate.value = tomorrow.toISOString().slice(0, 10)
    }

    emit('update:timeRange', {
      start: startDate.value,
      end: endDate.value,
    })
  }

  function onTypeChange(event) {
    const selectedType = event.target.value
    emit('update:modelValue', selectedType)
    initializeDates(selectedType)
  }

  onMounted(() => {
    initializeDates(props.modelValue)
  })

  watch([startDate, endDate], ([start, end]) => {
    if (props.modelValue === '學年借用') return
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

  /* 下拉選單：固定外觀、不因 hover 變灰 */
  .type-select {
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

  /* 不論哪種模式，下拉選單 hover 都不變色 */
  .type-select:hover {
    background-color: white; /* 取消灰底 */
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
    font-size: 16px;
    font-weight: 600;
    white-space: nowrap;
  }

  /* 日期輸入框 */
  .time-input {
    font-size: 16px;
    padding: 4px 8px;
    border-radius: 4px;
    border: 1px solid #ccc;
    background-color: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    color: #000;
  }

  /* 只有臨時借用模式才有 hover 灰底 */
  .temporary-mode .time-input:not(:disabled):not(:focus):hover {
    background-color: #DFE1E6;
    cursor: pointer;
  }

  /* 學年借用：即使 hover 也保持白色（且 disabled 自然無法點） */
  .year-mode .time-input:hover {
    background-color: white;
    cursor: not-allowed;
  }

  /* 讓臨時借用時，標籤也呈現可點的手型（點 label 會觸發 input） */
  .temporary-mode .label-text {
    cursor: pointer;
  }
  .year-mode .label-text {
    cursor: default;
  }

  /* RWD */
  @media screen and (max-width: 729px) {
    .type-select-wrapper {
      flex-direction: column;
      align-items: stretch;
      gap: 12px;
    }

    .type-select {
      width: 120px;
      font-size: 16px;
    }

    .time-picker-inline {
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
    }

    .time-input-row {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .label-text {
      width: auto;
      white-space: nowrap;
    }

    .time-input {
      width: 100%;
    }

    .time-align {
      width: 100%;
      max-width: 100%;
      box-sizing: border-box;
      padding-right: 40px;
    }
  }
</style>
