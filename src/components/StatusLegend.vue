<template>
    <div class="alignment">
        <div class="status-legend">
            <div class="status-color color-borrowed"></div>
            <span>借用中</span>
        </div>
        <div class="status-legend">
            <div class="status-color color-reviewing"></div>
            <span>審核中</span>
        </div>
        <div class="status-legend">
            <div class="status-color color-selected"></div>
            <span>選中標示</span>
        </div>
    </div>
</template>

<style scoped>
.status-legend {
  display: flex;
  align-items: center;
  margin-left: 16px;
  font-size: 14px;
}

.status-color {
  width: 16px;
  height: 16px;
  margin-right: 6px;
  border: 1px solid #999;
}

.color-borrowed {
  background-color: #d9d9d9;
}

.color-reviewing {
  background-color: #cfe2f3;
}

.color-selected {
  background-color: #fff;
  border: 2px solid #90c9ae;
}

.alignment {
    display : flex;
}
</style>