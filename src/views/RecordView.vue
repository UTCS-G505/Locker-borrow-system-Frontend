<template>
  <div class="title">
    <h1>申請紀錄頁面</h1>

    <!-- 駁回按鈕 -->
    <button @click="openRejectModal">駁回</button>

    <!-- 駁回彈窗 -->
    <RejectModal ref="rejectModal" @submit="handleRejectSubmit" />
  </div>
</template>

<script>
import RejectModal from "@/components/RejectModal.vue";

export default {
  components: { RejectModal },
  methods: {
    openRejectModal() {
      this.$refs.rejectModal.open(); // 呼叫子元件方法
    },
    handleRejectSubmit(reason) {
      console.log("駁回原因：", reason); 
    },
  },
};
</script>

<style scoped>
@media (min-width: 1024px) {
  .title {
    min-height: 100vh;
    display: flex;
    align-items: center;
    flex-direction: column; /* 讓標題與按鈕垂直排 */
    gap: 20px;
  }
}
</style>