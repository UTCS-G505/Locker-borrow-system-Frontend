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
  background-color: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-container {
  background: rgba(250, 250, 251, 0.95);
  padding: 24px;
  border-radius: 16px;
  width: 608px;
  max-width: 90%;
  height: 349px;
  box-sizing: border-box;
  box-shadow: 2px 4px 4px rgba(0,0,0,0.35),-1.5px -0.5px 4px rgba(0,0,0,0.25);
}

.modal-header {
  min-height: 60px;
  background-color: #E8F7FF;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: -25px -24px 0 -24px;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.modal-title {
  font-size: 2.25rem;
  margin: 0;
  font-weight: 14px;
  color: #222;
}

.modal-body {
  background: transparent;
  padding: 6px 16px;
}

/* 調整駁回原因文字 */
.modal-label {
  display: block;
  font-weight: 500;   /* 不那麼粗 */
  margin-bottom: 12px;
  font-size: 1.75rem; /* 再大一些 */
  color: black;
  padding-left: 12px;
}

.modal-textarea {
  width: 100%;
  height: 120px;
  padding: 8px;
  resize: none;
  border: none;
  outline: none;
  border-radius: 15px;
  margin-bottom: 12px;
  background: white;
  color: black;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 8px;
  display: block;      /* 確保是獨立一行 */
  margin: 0 auto 16px;
}

.quick-options {
  display: flex;
  justify-content: space-between;
  gap: 0;
  margin-bottom: 12px;
}

.quick-option-btn {
  background: white;
  border: 1px solid #DFE1E6;
  border-radius: 10px;
  padding: 4px 12px;
  cursor: pointer;
  text-align: center;
  font-size: 16px;
  color: black;
  flex: none;
  max-width: 120px;
  transition: background 0.2s, box-shadow 0.2s;
  box-shadow: 0 2px 6px rgba(0,0,0,0.25);
}

.quick-option-btn:hover {
  background-color:   #DFE1E6;
}

.modal-actions {
  text-align: center;
  background: transparent;
  padding: 10px;
}

.submit-btn {
  width: 100px;
  height: 30px;
  background: white;
  color: black;
  padding: 8px 24px;
  border: 1px solid #DFE1E6;
  border-radius: 10px;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.2s, box-shadow 0.2s;
  box-shadow: 0 2px 6px rgba(0,0,0,0.25);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: normal;
}

.submit-btn:hover {
  background-color:   #DFE1E6;
}

@media (max-width: 768px) {
  .modal-container {
    width: 95%;
  }

  .modal-title {
    font-size: 1.5rem;
  }

  .modal-label {
    font-size: 1.25rem; /* 手機版稍小 */
  }

  .modal-textarea {
    height: 80px;
    font-size: 0.9rem;
    padding: 8px;
    margin-bottom: 10px;
  }

  .quick-option-btn {
    padding: 2px 10px;
    font-size: 1rem;
    max-width: none;
    width: 100%;
    box-sizing: border-box;
  }

  .submit-btn {
    padding: 2px 24px;
    font-size: 1rem;
  }

  .quick-options {
    flex-direction: column;
    gap: 10px;
    margin-bottom: -4px;
  }
}

</style>
