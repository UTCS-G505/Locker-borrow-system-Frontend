<template>
  <PopupModal v-if="show" @close="close">

    <template #header>
      <h2 class="modal-title">駁回</h2>
    </template>

    <template #content>
      <div class="modal-body-content">
        <label class="modal-label">駁回原因</label>
        <textarea
          class="modal-textarea"
          v-model="rejectReason"
        ></textarea>

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
    </template>

    <template #buttons>
      <button class="submit-btn" @click="submit">送出</button>
    </template>

  </PopupModal>
</template>

<script setup>
  import { ref } from 'vue';
  import PopupModal from '@/components/popups/PopupModal.vue';
  defineProps({
    quickOptions: {
      type: Array,
      default: () => ["詳細資訊1", "詳細資訊2", "詳細資訊3"],
    },
  });
  const emit = defineEmits(['submit']);

  const show = ref(false);
  const rejectReason = ref("");
  const open = () => {
  show.value = true;
  document.body.style.overflow = "hidden";
};
  const close = () => {
    rejectReason.value = "";
    show.value = false;
    document.body.style.overflow = "";
  };
  const submit = () => {
    if (!rejectReason.value.trim()) {
      alert("請輸入駁回原因！");
      return;
    }
    emit("submit", rejectReason.value);
    close();
  };

  const selectOption = (option) => {
    rejectReason.value = option;
  };
  defineExpose({
    open
  });

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
  box-shadow: none;
  border-radius: 15px;
  margin-bottom: 12px;
  background: white;
  color: black;
  font-size: 14px;
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

  .quick-options {
    display: flex;
    flex-direction: column;   /* 【關鍵】垂直排列，這就是「直接換行」 */
    align-items: center;      /* 讓變短的按鈕在畫面正中間對齊 */
    gap: 12px;                /* 按鈕上下的間距 */
    margin-bottom: 15px;
  }

  .quick-option-btn {
    width: 250px;             /* 【關鍵】設定一個固定長度，讓它變短 */
    max-width: none;
    flex: none;

    padding: 5px 0;           /* 上下內距 */
    font-size: 0.9rem;
    border-radius: 10px;      /* 圓角，變成膠囊狀比較好看 */
  }

  .submit-btn {
    padding: 2px 24px;
    font-size: 1rem;
  }


}

</style>
