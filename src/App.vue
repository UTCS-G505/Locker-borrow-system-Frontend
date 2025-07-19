<script setup>
import { RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import AppNavBar from './components/AppNavBar.vue';
import AppFooter from './components/AppFooter.vue'
</script>

<template>
  <header>
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />
    </div>

    <nav>
      <AppNavBar />
    </nav>
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
  min-height: 10vh;
  max-height: 100vh;
  margin: 0 auto;
  padding: 2rem;
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

footer {
  min-height: 10vh;
  margin: 0 auto;
  padding: 2rem;
}

@media print {
  header, footer {
    display: none;
  }
}
</style>
