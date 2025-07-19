<script setup>
const devYear = 2025;

const language = navigator.language;
const copyrightOwner = language === "zh-TW" || language === "zh-CN" || language === "zh"
                        ? "臺北市立大學資訊科學系(含碩士班)"
                        : "Department of Computer Science, University of Taipei";
const allRightsReserved = language === "zh-TW" || language === "zh-CN" || language === "zh"
                            ? "版權所有"
                            : "All Rights Reserved";
</script>

<template>
  <p>Copyright © {{ devYear }} {{ copyrightOwner }} {{ allRightsReserved }}</p>
</template>

<style scoped>
p {
  text-align: center;
}
</style>
