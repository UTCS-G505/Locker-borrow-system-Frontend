<script setup>
import { RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import AppNavBar from './components/AppNavBar.vue';
</script>

<template>
  <header>
    <nav>
      <AppNavBar />
    </nav>
  </header>
  
  <main>
    <RouterView />
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
  margin: 0 auto;
  padding: 0;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

main {
  min-height: 80vh;
  margin: 0 auto;
  padding: 2rem;
}
</style>
