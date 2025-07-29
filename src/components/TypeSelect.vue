<template>
  <div class="type-select-wrapper">
    <!-- 左：選擇類型按鈕 -->
    <button @click="toggleDropdown" class="view-button">{{ modelValue }}</button>

    <!-- 下拉選單 -->
    <div v-if="showDropdown" class="dropdown-menu">
      <div
        v-for="type in typeOptions"
        :key="type"
        class="dropdown-item"
        @click="selectType(type)"
      >
        {{ type }}
      </div>
    </div>

    <!-- 右：時間輸入區 -->
    <div class="time-picker-inline">
      <template v-if="modelValue === '臨時借用'">
        <div class="time-input-now">
            <span class="label-text">起始時間：</span>
            <input 
              type="date" 
              v-model="startDate"
              :min="today"
              class="time-input"
            />
        </div>

        <div class="time-input-now">
            <span class="label-text">結束時間：</span>
            <input 
              type="date"
              v-model="endDate" 
              :min="endMinDate"
              class="time-input"
            />
        </div>
      </template>

      <template v-else-if="modelValue === '學年借用'">
        <label>起始時間： 2025-09-01 </label>
        <label>結束時間： 2026-06-30 </label>
      </template>
    </div>
  </div>
</template>


<script setup>
  import { ref, watch, computed } from 'vue'

  const emit = defineEmits(['update:modelValue', 'update:timeRange'])

  const typeOptions = ['學年借用', '臨時借用']
  const showDropdown = ref(false)

  // 時間欄位（預設為空）
  const startDate = ref('')
  const endDate = ref('')

  //  結束時間的最小值 = max(today, startTime)
  const endMinDate = computed(() => {
    if (!startDate.value) return today
    return startDate.value > today ? startDate.value : today
  })

  // 今天日期 yyyy-mm-dd
  const today = new Date().toISOString().slice(0, 10)

  //下拉選單
  function toggleDropdown() {
    showDropdown.value = !showDropdown.value
  }

  //選擇借用類型
  function selectType(type) {
    emit('update:modelValue', type)
    showDropdown.value = false

    if (type === '學年借用') {
      startDate.value = ''
      endDate.value = ''
      emit('update:timeRange', null) // 清除臨時借用區間

    } else if (type === '臨時借用') {
      // 預設起始、結束時間為隔天（可調整）
      const now = new Date()
      const tomorrow = new Date(now.getTime() + 24*60*60*1000)

      startDate.value = today
      endDate.value = tomorrow.toISOString().slice(0,10)

      emit('update:timeRange', {
        start: startDate.value,
        end: endDate.value,
      })
    }
  }

  //  當起訖時間改變時，自動修正並發送
    watch([startDate, endDate], ([start, end]) => {
    if (!start || !end) return

    // 如果 end 比 start 早或比 today 早，自動修正
    const correctedEnd = start > today ? start : today
    if (end < start || end < today) {
      endDate.value = correctedEnd
    }

    emit('update:timeRange', { start: startDate.value, end: endDate.value })
  })

</script>

<style scoped>
  .view-button {
    background-color: white;
    color: black;
    border: 1px solid #aaa;
    border-radius: 12px;
    padding: 6px 20px;
    cursor: pointer;
    font-size: 16px;
    user-select: none;
  }
  .view-button:hover {
    background-color: #DFE1E6;
  }

  .dropdown-menu {
    position: absolute;
    background-color: white;
    border: 1px solid #ccc;
    border-radius: 8px;
    margin-top: 4px;
    padding: 4px 0;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    z-index: 10;
    width: 140px;
  }

  .dropdown-item {
    padding: 8px 16px;
    cursor: pointer;
    font-size: 16px;
  }

  .dropdown-item:hover {
    background-color: #f0f0f0;
  }

  .time-picker-container {
    font-size: 16px;
    margin-top: 8px;
  }

  .time-picker-container label {
    display: block;
    margin-top: 8px;
    font-weight: 600;
  }

  .type-select-wrapper {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: nowrap;
    width: 100%;
  }


  .time-picker-inline label {
    font-weight: 600;
    display: flex;
    flex-direction: column;
  }

  .time-picker-inline {
    display: flex;
    gap: 16px;
    font-size: 16px;
    flex-wrap: nowrap;
    align-items: center;
  }

  /* 這是時間輸入與文字一行排列的容器 */
  .time-input-row {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  /* 文字label的樣式 */
  .label-text {
    font-weight: 600;
    white-space: nowrap;
  }

  /* 輸入框寬度可調 */
  .time-input {
    font-size: 16px;
    padding: 4px 8px;
    border-radius: 4px;
    border: 1px solid #ccc;
  }


  .static-text {
    font-size: 16px;
    padding: 4px 8px;
    border-radius: 4px;
    background-color: #f5f5f5;
    border: 1px solid #ccc;

  }
  @media screen and (max-width: 425px) {
    .type-select-wrapper {
      flex-direction: column;
      align-items: stretch;
      gap: 12px;
    }

    .view-button {
      width: 100%;
      font-size: 16px;
    }

    .time-picker-inline {
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
    }

    .time-input-now {
      width: 100%;
    }

    .label-text,
    .time-input {
      font-size: 16px;
      width: 100%;
    }
  }
</style>