<script setup>
import GeneralSetting from '@/components/GeneralSetting.vue';
import NoteBoard from '@/components/NoteBoard.vue';
</script>

<template>
  <div id="setting-board">
    <GeneralSetting />
    <hr>
    <NoteBoard />
  </div>
</template>

<style scoped>
#setting-board {
  width: 100%;
  border: 1px solid #DFE1E6;
  border-radius: 14px;
  background-color: #fff;
  padding: 2rem;
}

hr {
  margin: 1rem 0;
  border: 1.5px solid #DFE1E6;
}
</style>
