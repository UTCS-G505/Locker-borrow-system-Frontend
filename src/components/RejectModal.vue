<template>
  <div v-if="show" class="modal-overlay" @click.self="close">
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
          @click="selectOption(option)"
        >
          {{ option }}
        </button>
      </div>

      <!-- 送出與取消 -->
      <div class="modal-actions">
        <button class="submit-btn" @click="submit">送出</button>
        <button class="cancel-btn" @click="close">取消</button>
      </div>
    </div>
  </div>
  	<!-- 
    <button @click="openRejectModal">駁回</button>
    <RejectModal ref="rejectModal" @submit="handleRejectSubmit" />
    直接引用這些
    -->
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
      this.rejectReason += (this.rejectReason ? "\n" : "") + option;
    },
  },
};
/*
import RejectModal from "@/components/RejectModal.vue";

export default {
  components: { RejectModal },
  methods: {
    openRejectModal() {
      this.$refs.rejectModal.open(); // 叫子元件的 open 方法
    },
    handleRejectSubmit(reason) {
      console.log("駁回原因：", reason); 
    },
  },
}; 
這段直接引用
*/ 
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
}
.modal-container {
  margin: 100px auto;
  background: white;
  padding: 20px;
  width: 300px;
}
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

.cancel-btn {
  margin-left: 10px;
  background: #6c757d;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
.cancel-btn:hover {
  background: #5a6268;
}

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

 