<template>
  <Teleport to="body">
    <div class="modal-backdrop" @click.self="close">
      <div class="modal-content">
        <div class="modal-header">
          <h2>確認借用</h2>
        </div>
          <div class="content">
            <h3>櫃子編號：{{ locker.name }}</h3>
            <h3>借用類型：{{ borrowType }}</h3>
            <h3>借用時間：{{ timeRange.start }} ~ {{ timeRange.end }}</h3>
            <h3>
              <div class="borrow-reason">借用理由（必填）</div>
              <textarea id="borrow-reason" v-model="reason" rows="4" placeholder="請輸入借用理由"></textarea>
            </h3>
          </div>
        <div class="buttons">
          <button class="confirm-button" @click="confirm">送出</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
  import { ref, watch, onMounted } from 'vue'

  const props = defineProps({
    locker: Object,
    borrowType: String,
    timeRange: Object,
  })

  const emit = defineEmits(['close', 'confirm'])

  const reason = ref('')

  function confirm() {
    // 驗證必填
    if (!reason.value.trim()) {
      alert('請輸入借用理由')
      return
    }

    emit('confirm', {
      locker: props.locker,
      reason: reason.value.trim()
    })
  }

  function close() {
    emit('close')
  }

  // 每次 locker 改變時重設理由（並檢查借用類型）
  watch(() => props.locker, () => {
    if (props.borrowType === '學年借用') {
      reason.value = '學年借用'
    } else {
      reason.value = ''
    }
  })

  // 掛載時也做一次檢查
  onMounted(() => {
    if (props.borrowType === '學年借用') {
      reason.value = '學年借用'
    }
  })
</script>


<style scoped>
  .modal-backdrop {
    position: fixed;
    inset: 0;
    background-color: rgba(0,0,0,0.5);
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
    max-width: 90%;
    max-height: 90vh;
    overflow-y: auto;
    box-sizing: border-box;
    box-shadow: 2px 4px 4px rgba(0,0,0,0.35), -1.5px -0.5px 4px rgba(0,0,0,0.25);
  }

  .modal-header {
    min-height: 60px;
    background-color: #E8F7FF;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: -25px -24px 0px -24px;
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  }

  .content {
    padding: 15px 10px 0;
  }

  .borrow-reason {
    margin: 0 0 5px 0;
  }

  textarea {
    width: 100%;
    resize: none;
    padding: 8px;
    font-size: 14px;
    box-sizing: border-box;
    border-radius: 6px;
    border: 1px solid #ccc;
    font-family: inherit;
  }

  .buttons {
    display: flex;
    justify-content: center;
    margin-top: 5px;
  }

  .confirm-button {
    width: 100px;
    height: 30px;
    color: black;
    background-color: white;
    border-radius: 10px;
    border: 1px solid #DFE1E6;
    font-size: 16px;
    cursor: pointer;
    user-select: none;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
  }
  .confirm-button:hover {
    background-color: #DFE1E6;

  }
</style>
