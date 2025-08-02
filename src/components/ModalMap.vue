<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <!-- 位置圖 -->
    <div class="modal-content" @click.stop>
      <div class="modal-color-bar">
        <div class="up-color">
          <h1>公誠樓三樓</h1>
        </div>
      </div>

      <div class="floor-plan">
        <div class="area-locker year1" @click="select('一年級')">大一</div>
        <div class="area-locker year2" @click="select('二年級')">大二</div>
        <div class="area-locker year3" @click="select('三年級')">大三</div>
        <div class="area-locker year4" @click="select('四年級')">大四</div>
        <div class="area stairs">樓梯間</div>
        <div class="area toilet">廁所</div>
        <div class="area classroom">G314</div>
      </div>
    </div>
  </div>
</template>

<script setup>
  const emit = defineEmits(['select', 'close'])
  function select(grade) {
    emit('select', grade)
  }
</script>

<style scoped>
  .modal-overlay {
    position: fixed;
    top: 0; left: 0;
    width: 100vw; height: 100vh;
    background: rgba(0, 0, 0, 0.4);
    display: flex; justify-content: center; align-items: center;
    z-index: 999;
  }

  .modal-content {
    background: #FAFAFB;
    border-radius: 10px;
    padding: 40px;
    width: 90%;
    max-width: 600px;
    position: relative;
    font-size: clamp(0.5rem, 1vw, 1rem); /* 響應式文字大小，含最小限制 */
  }

  .modal-color-bar {
    position: absolute;
    top: -30px;
    left: 0;
    width: 100%;
    height: 70px;
    display: flex;
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  }

  .up-color {
    flex: 1;
    background-color: #EBF7FF;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .up-color h1 {
    font-size: 1.2em;
    margin: 0;
  }

  .floor-plan {
    position: relative;
    width: 100%;
    aspect-ratio: 2 / 1;
    font-size: 1em;
  }

  .area, .area-locker {
    position: absolute;
    padding: 4% 2%;
    background-color: #fff;
    border-radius: 8px;
    font-size: 1em;
    box-shadow: 0 2px 6px rgba(0,0,0,0.08);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .area-locker {
    background-color: #ebf7ff;
  }

  /* 等比例區塊定位（百分比） */
  .year1 { top: 40%; left: 6.6%; width: 20%; height: 25%; }
  .year2 { top: 15%; left: 6.6%; width: 20%; height: 25%; }
  .year3 { top: 30%; left: 60%; width: 30%; height: 15%; }
  .year4 { top: 13%; left: 60%; width: 30%; height: 15%; }
  .stairs { top: 70%; left: 6.6%; width: 20%; height: 25%; }
  .classroom { top: 62%; left: 45%; width: 20%; height: 33.3%; }
  .toilet { top: 62%; left: 65%; width: 30%; height: 33.3%; }

  /*768px以上時字變大 */
  @media screen and (min-width: 768px) {
    .modal-content {
      font-size: 1rem;
    }

    .floor-plan {
      font-size: 1em;
    }

    .area, .area-locker {
      font-size: 1em;
    }

    .up-color h1 {
      font-size: 1.4em;
    }
  }

  @media (max-width: 425px) {
    .floor-plan {
      height: auto;
      transform: scale(0.9); /* 根據螢幕大小適當縮放 */
      transform-origin: bottom;
    }

    .modal-content {
      overflow-x: auto; /* 避免因地圖變大導致超出遮蓋層 */
      padding: 20px;
    }

    .up-color {
      flex: 1;
      background-color: #EBF7FF;
      display: flex;
      justify-content: center;
      align-items: center;
      padding-top: 30px;
    }
    .up-color h1 {
      font-size: 2em;
      margin: 0;
    }
  }
</style>