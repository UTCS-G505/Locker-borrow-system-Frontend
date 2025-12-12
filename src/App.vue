<script setup>
import { RouterView } from 'vue-router'
import AppNavBar_LogOut from './components/AppNavBar_LogOut.vue';
import AppFooter from './components/AppFooter.vue'
</script>

<template>
  <header>
    <AppNavBar_LogOut />
  </header>

  <main>
    <RouterView />
  </main>

  <footer>
    <AppFooter />
  </footer>
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
  margin: 0 auto;
  padding: 0;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

main {
  margin: 0 auto;
  padding: 2rem;
}

footer {
  min-height: 10vh;
  margin: 0 auto;
  padding: 2rem;
}
</style>
