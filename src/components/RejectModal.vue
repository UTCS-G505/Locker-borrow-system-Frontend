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
      document.body.style.overflow = "hidden";
    },
    close() {
      this.rejectReason = "";
      this.show = false;
      document.body.style.overflow = "";
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
  background: #f5f5f5;
  width: 800px;
  max-width: 90%;
  height: 420px;
  max-width: 90%;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.2);
  animation: fadeIn 0.2s ease-in-out;
}

.modal-header {
  background: #e6f2ff;
  padding: 16px;
  text-align: center;
  box-shadow: 0 3px 8px rgba(0,0,0,0.12);
}

.modal-title {
  font-size: 2.25rem;
  margin: 0;
  font-weight: bold;
  color: #1A1A1A;
}

.modal-body {
  background: transparent;
  padding: 6px 40px;
}

/* 調整駁回原因文字 */
.modal-label {
  display: block;
  font-weight: normal;   /* 不那麼粗 */
  margin-bottom: 4px;
  font-size: 2rem; /* 再大一些 */
  color: black;
  padding-left: 12px;
}

.modal-textarea {
  width: 100%;
  height: 120px;
  padding: 15px;
  resize: none;
  border: none;
  outline: none;
  border-radius: 15px;
  margin-bottom: 12px;
  background: white;
  color: black;
  font-size: 1.125rem;
}

.quick-options {
  display: flex;
  justify-content: center;
  gap: 10.75rem;
  margin-bottom: 12px;
}

.quick-option-btn {
  background: white;
  border: 1px solid #DFE1E6;
  border-radius: 12px;
  padding: 6px 12px;
  cursor: pointer;
  text-align: center;
  font-size: 1.25rem;
  color: black;
  flex: 1;
  max-width: 120px;
  transition: background 0.2s, box-shadow 0.2s;
  box-shadow: 0.5px 1px 4px 0px #00000040;
}

.quick-option-btn:hover {
  background: #f0f0f0;
  box-shadow: 0 6px 12px rgba(0,0,0,0.2); /* 滑過加強陰影 */
}

.modal-actions {
  text-align: center;
  background: transparent;
  padding: 10px;
}

.submit-btn {
  background: white;
  color: black;
  padding: 4px 40px;
  border: 1px solid #DFE1E6;
  border-radius: 12px;
  cursor: pointer;
  font-size: 1.25rem;
  transition: background 0.2s, box-shadow 0.2s;
  box-shadow: 0.5px 1px 4px 0px #00000040;
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

</style>
