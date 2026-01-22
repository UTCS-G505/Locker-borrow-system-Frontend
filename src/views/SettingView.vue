<script setup>
import { ref } from 'vue';
import GeneralSetting from '@/components/GeneralSetting.vue';
import NoteBoard from '@/components/NoteBoard.vue';
import AnnounceBoard from '@/components/AnnounceBoard.vue';

const board = ref('note');
const BoardMap = {
  note: NoteBoard,
  announcement: AnnounceBoard
};

if (location.hash) {
  const hash = location.hash.slice(1);
  if (hash in BoardMap) {
    board.value = hash;
  }
  else {
    location.hash = '';
  }
}

const setHash = () => {
  location.hash = `#${board.value}`
}
</script>

<template>
  <div id="setting-board">
    <GeneralSetting v-model:board="board" @update:board="setHash" />
    <hr>
    <component :is="BoardMap[board]" />
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
