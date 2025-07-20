<script setup>

</script>

<template>
  <main>
    <h1>This is HomeView</h1>
  </main>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
}

.section-title {
  color: black;
  font-size: 2.25rem;
  margin: 0.5rem;
}

.announcement-section,
.rule-section {
  display: flex;
  flex-direction: column;
}

.announcement-box {
  background-color: white;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  border: 1px solid #DFE1E6;
  border-radius: 0.75rem;
  padding: 1rem;
  gap: 0.5rem;
}

.announcement-item {
  display: flex;
}

.announcement-header {
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.divider {
  width: 0.05rem;
  height: 80%;
  border-radius: 25%;
  background-color: #6B7280;     /* gray-500 */
  margin: auto 0;
}

.announcement-title {
  font-size: 1.125rem;
  font-weight: 600;
  cursor: pointer; /* 游標變成手指 */
  color: black; /* 保持原本顏色 */
  text-decoration: none; /* 預設無底線 */
  transition: color 0.2s ease; /* 滑過時平滑變化 */
}

.announcement-title:hover {
  text-decoration: underline; /* 加上底線 */
}

@media (min-width: 640px) {
  .announcement-title {
    font-size: 1.5rem;
  }
}

.announcement-date {
  font-size: 0.875rem;
  color: #6B7280; /* gray-500 */
}


.toggle-button {
  font-size: 0.875rem;
  color: #9CA3AF; /* gray-400 */
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  margin-top: 0.5rem;
}

.rules-list {
  background-color: white;
  width: 100%;
  display: flex;
  flex-direction: column;
  border: 1px solid #DFE1E6;
  border-radius: 0.75rem;
  padding: 1rem;
  list-style-position: inside;
  font-size: 1rem;
  line-height: 1.75rem;
  gap: 0.5rem;
}

@media (min-width: 640px) {
  .rules-list {
    font-size: 1.125rem;
  }
  .announcement-header {
    gap: 0.75rem;
  }

  .divider {
    width: 0.1rem;
  }
}
</style>
