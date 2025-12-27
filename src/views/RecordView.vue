<script setup>
import { ref, onMounted } from 'vue'
import { Record } from '@/api/main.js'
import RecordTable from '../components/RecordTable.vue'

// 申請紀錄資料
const record = ref([])

// 頁面載入時獲取資料
onMounted(async () => {
  await fetchRecords()
})

// 從後端獲取申請紀錄列表
async function fetchRecords() {
  try {
    // 呼叫 API 獲取資料
    const data = await Record.getAll?.()

    if (data) {
      record.value = data
      console.log('獲取到的申請紀錄:', data)
    } else {
      console.warn('未獲取到資料,使用測試資料')
      // 如果 API 還沒好或失敗,使用測試資料
      record.value = [
        {
          id:'46950f52-d9cd-4253-8645-8228a401a9bd',
          name:'測試用戶',
          type:'臨時借用',
          startTime:'2024/9/1',
          endTime:'2025/6/30',
          num:'39',
          state:'借用中'
        }
      ]
    }
  } catch (error) {
    console.error('獲取申請紀錄失敗:', error)
    // API 失敗時使用測試資料
    record.value = [
      {
        id:'46950f52-d9cd-4253-8645-8228a401a9bd',
        name:'測試用戶',
        type:'臨時借用',
        startTime:'2024/9/1',
        endTime:'2025/6/30',
        num:'39',
        state:'借用中'
      }
    ]
  }
}

// 取消借用申請 (使用 /record/cancel API)
function handleCancel(id) {
  const item = record.value.find(r => r.id === id)
  if (item?.state === '審核中') {
    // TODO: 這裡之後要調用取消借用的 API
    // await Record.postCancel?.(id)
    item.state = '取消申請'
  }
}

// 處理資料刷新 (當 RecordTable 中的歸還/撤回操作成功後)
function handleRefresh() {
  console.log('重新獲取最新資料...')
  fetchRecords()
}
</script>

<template>
  <div class="recordWrapper">
    <h1 class="record">申請紀錄</h1>

    <!-- 如果有資料才顯示表格 -->
    <RecordTable
      v-if="record.length > 0"
      :records="record"
      @cancel="handleCancel"
      @refresh="handleRefresh"
    />

    <!-- 無資料時顯示提示 -->
    <div v-else class="empty-state">
      <p>目前沒有申請紀錄</p>
    </div>
  </div>
</template>

<style scoped>
.recordWrapper {
  padding-top: 10px;
}

.record {
  font-size: 30px;
  color: #1a1a1a;
  margin-left: 15px;
  margin-bottom: 0;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #666;
  font-size: 18px;
}

/* 手機版 */
@media (max-width: 640px) {
  .recordWrapper {
    padding-top: 30px;
  }

  .record {
    font-size: 24px;
    margin-left: 12px;
  }

  .empty-state {
    padding: 40px 20px;
    font-size: 16px;
  }
}
</style>
