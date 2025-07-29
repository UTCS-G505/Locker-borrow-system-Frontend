<!-- LockerStatus.vue -->
<template>
  <div class="container">
    <div class="locker-grid">
      <div
        v-for="locker in lockers"
        :key="locker.id"
        class="locker"
        :class="{
          borrowed: locker.isBorrowed,
          reviewed: locker.isReviewed,
          selectable: !locker.isBorrowed && !locker.isReviewed,
          hovered: hoverId === locker.id && !locker.isBorrowed &&!locker.isReviewed,
        }"
        @mouseenter="hoverId = locker.id"
        @mouseleave="hoverId = null"
        @click="!locker.isBorrowed &&!locker.isReviewed && $emit('select', locker)"
      >
        <div class="locker-content">
          <div class="locker-name">{{ locker.name }}</div>
          <div v-if="locker.isBorrowed" class="locker-code">
            {{ locker.code || '********' }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  defineProps(['lockers'])
  defineEmits(['select'])
  const hoverId = ref(null)
</script>

<style scoped>
  /*櫃子外面的框，框的大小固定*/
  .container {
    overflow-x: auto;
    max-width:100%;
    margin: 0 auto;
    display: block;
    height: auto;
    width:100%;
    border: 0.5px solid #d0d2d8ff;
    border-radius: 16px;
    padding: 40px;
    box-sizing: border-box;
    align-items: center;
    justify-content: center;
  }

  /*排列櫃子，四個櫃子一個column*/
  .locker-grid {
    display: grid;
    justify-content: space-between;
    grid-template-rows: repeat(4,minmax(60px,1fr));
    grid-auto-flow: column;
    gap: 20px;
    min-width: 600px;
  }

  /*單一櫃子*/
  .locker {
    box-sizing: border-box;
    width: 100%;
    max-width:140px;
    min-width: 120px;
    height: 70px;
    padding: 4px;

    display: flex;
    align-items: flex-start; /* 靠上對齊 */
    justify-content: flex-start; /* 靠左對齊 */
    text-align: left;

    border-radius: 5px;
    border: 0.5px solid #dfe1e6;
    cursor: pointer;
    user-select: none;

    padding-left: 8px;
    padding-top: 6px;

    flex-shrink:0;
  }


  .locker-content {
    position: relative;
    width: 100%;
    height: 100%;
  }


  /* 中間顯示 locker.code（限已借用） */
  .locker-code {
    position: absolute;
    top: 70%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 14px;
    font-family: monospace;
    color: #5a5a5a;
    text-align: center;
  }

  /* 狀態樣式 */
  .borrowed {
    background-color: #dbdcdd;  
  }

  .reviewed {
    background-color: #97acca ;  
    color:white;
  }

  .selectable {
    background-color: #c3e2f8;
  }

  .hovered {
    outline: 4px solid #b4e2d7;
    outline-offset: -2px;
    background-color:white;
  }
</style>