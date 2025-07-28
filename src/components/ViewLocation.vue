<template>
  <button class="view-button" @click="$emit('click')">查看位置</button>
</template>

<style scoped>
.view-button {
  margin-left: 8px;
  padding: 6px 12px;
  border: 1px solid #ccc;
  border-radius: 12px;
  background-color: white;
  color: #333;
  font-size: 14px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: background-color 0.2s ease;
}
.view-button:hover {
  background-color: #DFE1E6;
}
</style>