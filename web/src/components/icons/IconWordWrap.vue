<template>
  <svg v-if="wrap" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M3 6h8a3 3 0 110 6H6" />
    <path d="M9 15l-2-2 2-2" />
  </svg>
  <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M3 6h14" />
    <path d="M3 14h14" />
  </svg>
</template>

<script setup>
defineProps({ wrap: { type: Boolean, default: true } })
</script>
