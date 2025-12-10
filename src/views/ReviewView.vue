<template>
  <div class="review-page">
    <!-- 目前頁面標題 -->
    <div class="title">
      <h1>審核申請頁面</h1>
    </div>

    <!-- 測試用：駁回按鈕 -->
    <button class="reject-btn" @click="showModal = true">駁回</button>

    <!-- 駁回申請彈出視窗 -->
    <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
      <div class="modal-container">
        <h2 class="modal-title">駁回</h2>

        <!-- 駁回原因 -->
        <label class="modal-label">駁回原因</label>
        <textarea
          class="modal-textarea"
          v-model="rejectReason"
          placeholder="請輸入駁回原因"
        ></textarea>

        <!-- 常用選項 -->
        <div class="quick-options">
          <button
            v-for="option in quickOptions"
            :key="option"
            class="quick-option-btn"
            @click="rejectReason = option"
          >
            {{ option }}
          </button>
        </div>

        <!-- 送出按鈕 -->
        <div class="modal-actions">
          <button class="submit-btn" @click="submitReject">送出</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showModal: false,
      rejectReason: "",
      quickOptions: ["常用選項1", "常用選項2", "常用選項3"]
    };
  },
  methods: {
    submitReject() {
      console.log("駁回原因:", this.rejectReason);
      alert(`已送出駁回原因: ${this.rejectReason}`);
      this.showModal = false; // 關閉視窗
    }
  }
};
</script>

<style scoped>
/* 頁面標題區塊 */
.title {
  text-align: center;
  margin: 20px 0;
}

/* 測試用駁回按鈕 */
.reject-btn {
  display: block;
  margin: 20px auto;
  padding: 10px 20px;
  background: #d9534f;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
.reject-btn:hover {
  background: #c9302c;
}

/* 彈出視窗外層 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

/* 彈出視窗本體 */
.modal-container {
  background: white;
  width: 500px;
  max-width: 90%;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  animation: fadeIn 0.2s ease-in-out;
}

.modal-title {
  text-align: center;
  font-size: 1.5rem;
  margin-bottom: 15px;
}

.modal-label {
  display: block;
  font-weight: bold;
  margin-bottom: 8px;
}

.modal-textarea {
  width: 100%;
  height: 80px;
  padding: 10px;
  resize: none;
  border: 1px solid #ccc;
  border-radius: 6px;
  margin-bottom: 15px;
}

/* 常用選項按鈕 */
.quick-options {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 15px;
  justify-content: center;
}

.quick-option-btn {
  background: #f0f0f0;
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 6px 12px;
  cursor: pointer;
}
.quick-option-btn:hover {
  background: #e0e0e0;
}

/* 送出按鈕 */
.modal-actions {
  text-align: center;
}
.submit-btn {
  background: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
.submit-btn:hover {
  background: #0056b3;
}

/* RWD：手機版調整 */
@media (max-width: 480px) {
  .modal-container {
    width: 95%;
    padding: 15px;
  }
  .modal-title {
    font-size: 1.2rem;
  }
  .quick-options {
    flex-direction: column;
    align-items: stretch;
  }
  .quick-option-btn {
    width: 100%;
  }
}

/* 動畫 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
