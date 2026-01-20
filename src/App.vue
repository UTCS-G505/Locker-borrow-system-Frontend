<script setup>
import { RouterView } from 'vue-router'
import AppNavBar from './components/AppNavBar.vue';
import AppNavBar_LogOut from './components/AppNavBar_LogOut.vue';
import AppFooter from './components/AppFooter.vue'
import { useAuthStore } from './stores/auth';

const authStore = useAuthStore();
</script>

<template>
  <header>
    <AppNavBar v-if="authStore.isAuthenticated" />
    <AppNavBar_LogOut v-else />
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

main {
  margin: 0 auto;
  padding: 2rem;
}

footer {
  min-height: 10vh;
  margin: 0 auto;
  padding: 2rem;
}

@media screen and (max-width: 1023px) {
  header {
    position: sticky;
    top: 0;
    z-index: 100;
  }
}

@media print {
  * {
    margin: 0;
    padding: 0;
    background-color: white;
  }

  header,
  footer {
    display: none;
  }

  main {
    padding: 0;
    background-color: white;
  }
}
</style>
