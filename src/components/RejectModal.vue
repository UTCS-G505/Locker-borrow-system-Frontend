<template>
  <div v-if="show" class="modal-overlay" @click.self="close">
    <div class="modal-container">
      <!-- 上半部 -->
      <div class="modal-header">
        <h2 class="modal-title">駁回</h2>
      </div>

      <div class="divider"></div>

      <div class="modal-body">
        <!-- 駁回原因 -->
        <label class="modal-label">駁回原因</label>
        <textarea
          class="modal-textarea"
          v-model="rejectReason"
        ></textarea>

        <!-- 常用選項 -->
        <div class="quick-options">
          <button
            v-for="option in quickOptions"
            :key="option"
            class="quick-option-btn"
            @click="selectOption(option)"
          >
            {{ option }}
          </button>
        </div>
      </div>

      <div class="modal-actions">
        <button class="submit-btn" @click="submit">送出</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "RejectModal",
  props: {
    quickOptions: {
      type: Array,
      default: () => ["詳細資訊1", "詳細資訊2", "詳細資訊3"],
    },
  },
  emits: ["submit"],
  data() {
    return {
      show: false,
      rejectReason: "",
    };
  },
  methods: {
    open() {
      this.show = true;
    },
    close() {
      this.rejectReason = "";
      this.show = false;
    },
    submit() {
      if (!this.rejectReason.trim()) {
        alert("請輸入駁回原因！");
        return;
      }
      this.$emit("submit", this.rejectReason);
      this.close();
    },
    selectOption(option) {
      this.rejectReason = option;
    },
  },
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal-container {
  background: white;
  width: 750px;
  max-width: 90%;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.2);
  animation: fadeIn 0.2s ease-in-out;
}

.modal-header {
  background: #e6f2ff;
  padding: 22px;
  text-align: center;
}

.modal-title {
  font-size: 2.25rem;
  margin: 0;
}

.divider {
  height: 3px;
  background: #ccc;
}

.modal-body {
  background: #f5f5f5;
  padding: 22px;
}

/* 調整駁回原因文字 */
.modal-label {
  display: block;
  font-weight: 500;   /* 不那麼粗 */
  margin-bottom: 12px;
  font-size: 1.75rem; /* 再大一些 */
  color: black;
}

.modal-textarea {
  width: 100%;
  height: 120px;
  padding: 15px;
  resize: none;
  border: none;
  outline: none;
  border-radius: 15px;
  margin-bottom: 22px;
  background: white;
  color: black;
  font-size: 1.125rem;
}

.quick-options {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 22px;
}

.quick-option-btn {
  background: white;       
  border: 1px solid #ccc;
  border-radius: 20px;     
  padding: 9px 12px;
  cursor: pointer;
  text-align: center;
  font-size: 1.125rem;
  color: black;
  flex: 1;
  max-width: 120px;
  transition: background 0.2s, box-shadow 0.2s;
  box-shadow: 0 4px 8px rgba(0,0,0,0.15); /* 陰影 */
}

.quick-option-btn:hover {
  background: #f0f0f0;
  box-shadow: 0 6px 12px rgba(0,0,0,0.2); /* 滑過加強陰影 */
}

.modal-actions {
  text-align: center;
  background: #f5f5f5;
  padding: 15px;
}

.submit-btn {
  background: white;
  color: black;
  padding: 15px 30px;
  border: 1px solid #ccc;
  border-radius: 20px;     
  cursor: pointer;
  font-size: 1.125rem;
  transition: background 0.2s, box-shadow 0.2s;
  box-shadow: 0 4px 8px rgba(0,0,0,0.15); /* 陰影 */
}

.submit-btn:hover {
  background: #f0f0f0;
  box-shadow: 0 6px 12px rgba(0,0,0,0.2); /* 滑過加強陰影 */
}

@media (max-width: 768px) {
  .modal-container {
    width: 95%;
  }

  .modal-title {
    font-size: 1.8rem;
  }

  .modal-label {
    font-size: 1.5rem; /* 手機版稍小 */
  }

  .modal-textarea {
    height: 100px;
    font-size: 1rem;
    padding: 12px;
  }

  .quick-option-btn {
    padding: 8px 12px;
    font-size: 1rem;
    max-width: 100px;
  }

  .submit-btn {
    padding: 12px 24px;
    font-size: 1rem;
  }

  .quick-options {
    flex-direction: column;
    gap: 10px;
  }
}

@media (max-width: 480px) {
  .modal-title {
    font-size: 1.5rem;
  }

  .modal-label {
    font-size: 1.3rem; /* 小螢幕調整 */
  }

  .modal-textarea {
    height: 90px;
    font-size: 0.95rem;
  }

  .quick-option-btn {
    font-size: 0.95rem;
    padding: 7px 10px;
    max-width: 100%;
  }

  .submit-btn {
    font-size: 0.95rem;
    padding: 10px 20px;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
