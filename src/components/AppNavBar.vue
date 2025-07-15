<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
    <RouterLink to="/">Home</RouterLink>
    <RouterLink to="/apply">Apply</RouterLink>
    <RouterLink to="/record">Record</RouterLink>
    <RouterLink to="/review">Review</RouterLink>
    <RouterLink to="/setting">Setting</RouterLink>
</template>

<style scoped>
a.router-link-exact-active {
  color: var(--color-text);
}

a.router-link-exact-active:hover {
  background-color: transparent;
}

a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

a:first-of-type {
  border: 0;
}
</style>