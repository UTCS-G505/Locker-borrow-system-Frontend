<template>
  <!-- Modal 外層遮罩，點擊此區會關閉 modal -->
  <div v-if="modelValue" class="modal-overlay" @click.self="$emit('update:modelValue', false)">

    <!-- Modal 主體容器（點這裡不會觸發關閉） -->
    <div class="modal">
      <!-- 上方標題區塊 -->
      <div class="modal-header">
        <h2>申請成功</h2>
      </div>

      <!-- 下方內容區塊 -->
      <div class="modal-body">
        <p>申請類型：學期借用</p>
        <p>起迄時間：2025/3/29 ~ 2025/12/6</p>
        <p>系櫃號碼：<span class="locker-number">93</span></p>
<<<<<<< HEAD
        <p>借用理由：</p>
=======
>>>>>>> b7c4a02 (把code review提到的所有問題進行修正)
      </div>
    </div>
  </div>
</template>

<script setup>
console.log("ModalSuccess mounted!")
defineProps({
  modelValue: Boolean
});
defineEmits(['update:modelValue']);
</script>

<style scoped>
/* Modal 遮罩背景 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

/* Modal 外框容器 */
.modal {
  position: absolute;
<<<<<<< HEAD
  top: 260px;
=======
  top: 64px;
>>>>>>> b7c4a02 (把code review提到的所有問題進行修正)
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  max-width: 400px;
  border-radius: 12px;
  background: white;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.35);
  overflow: hidden;
  text-align: center;
  z-index: 1001;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

/* Modal 標題區塊 */
.modal-header {
  background: #EFF9FFCC;
  padding: 6px 12px;
  font-size: 20px;
  font-weight: bold;
  color: #222;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.25);
  z-index: 1;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

/* Modal 內文區塊 */
.modal-body {
  background: #F6F7F9F2;
  padding: 20px 16px;
  font-size: 20px;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
  font-weight: 500;
  color: #222;
  line-height: 1.6;
<<<<<<< HEAD
  text-align: left;
=======
>>>>>>> b7c4a02 (把code review提到的所有問題進行修正)
}

/* Modal 標題文字樣式 */
.modal h2 {
  font-size: 30px;
  color: #222;
  margin-bottom: 0;
}

<<<<<<< HEAD
/* 關閉按鈕 */
.close-btn {
  margin-top: 15px;
  padding: 8px 16px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

=======
>>>>>>> b7c4a02 (把code review提到的所有問題進行修正)
/* 桌機版調整位置 */
@media (min-width: 1024px) {
  .modal {
    top: 200px; /* 如果桌機的導覽列比較高可以調整這個值 */
    width: 400px;
  }
}
</style>
