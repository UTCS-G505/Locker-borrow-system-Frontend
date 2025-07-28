<template>
  <div class="modal-backdrop" @click.self="close">
    <div class="modal-content">
      <div class="modal-header">
          <h2>確認借用</h2>
      </div>

      <div class="content">          
          <h3>櫃子編號：{{ locker.name }}</h3>
          <h3>借用類型：{{ borrowType }}</h3>
          <h3>借用時間：
            <span v-if="timeRange.start">{{ timeRange.start }}</span> ~ 
            <span v-if="timeRange.end">{{ timeRange.end }}</span>
          </h3>

          <h3>
            <div class = "borrow-reason">
              借用理由（非必填）
            </div>
            <textarea v-model="reason" rows="4" placeholder="請輸入借用理由"></textarea>
          </h3>
      </div>


      <div class="buttons">
        <button class="confirm-button" @click="confirm">送出</button>        
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, watch, defineProps, defineEmits } from 'vue'

  const props = defineProps({
    locker: {
      type: Object,
      required: true
    },
    borrowType: {
      type: String,
      required: true
    },
    timeRange: {
      type: Object,
      required: true
    }
  })


  const emit = defineEmits(['close', 'confirm'])

  const reason = ref('')

  // 按確認按鈕時，emit confirm 事件並帶回 locker 與 reason
  function confirm() {
    if (reason.value.trim()) {
      emit('confirm', { locker: props.locker, reason: reason.value.trim() })
    }else{
      emit('confirm', { locker: props.locker})
    }
  }

  // 點背景或取消按鈕關閉彈窗
  function close() {
    emit('close')
  }

  // 當 locker 改變時，重設理由欄
  watch(() => props.locker, () => {
    reason.value = ''
  })
</script>

<style scoped>
  .modal-backdrop {
    position: fixed;
    inset: 0;  
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .modal-content {
    background: rgba(250, 250, 251, 0.95); /* #FAFAFB 對應的 rgba + 透明度 95% */
    padding: 24px;
    border-radius: 16px;
    width: 608px;
    height: 332px;
    box-sizing: border-box;
    box-shadow: 
      2px 4px 4px rgba(0,0,0,0.35),
      -1.5px -0.5px 4px rgba(0,0,0,0.25);
    display: flex;
    flex-direction: column;
    margin-top: 250px;
  }

  .content{
    padding-left: 10px;
    padding-top: 15px;
  }

  /*確認借用 */
  .modal-header {
    width: 608px;
    min-height: 60px;
    background-color: #E8F7FF;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: -25px -24px 0px -24px; /* 把 header 撐出 padding 區域 */
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
    box-sizing: border-box;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  }

  .borrow-reason{
    margin: 0px 0px 5px 0;
  }

  h2 {
    margin-top: 0;
    text-align: center;
    font-weight: 700;
    font-size: 24px;
  }

  label {
    display: block;
    margin-bottom: 16px;
    font-weight: 600;
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
    background-color:white;
    border-radius: 10px;
    border: 1px solid #DFE1E6;
    font-size: 16px;
    cursor: pointer;
    user-select: none;
  }
  .confirm-button:hover {
    background-color: #DFE1E6;
  }

  button:disabled {
    cursor: not-allowed;
  }

  @media (max-width: 425px) {
    .modal-backdrop {
      overflow-y: auto;
      padding: 10px; /* 防止縮小後碰到螢幕邊界 */
    }

    .modal-content {
      transform: scale(0.85);
      transform-origin: top center;
      width: 100%;
      max-width: 100%;
      height: auto;
    }

    .modal-header {
      width: auto;
    }
  }

</style>