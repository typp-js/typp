<template>
  <PlaygroundClient v-bind="$attrs" />
</template>

<script lang="ts" setup>
import { defineClientComponent } from 'vitepress'

const slots = defineSlots()
const PlaygroundClient = defineClientComponent(
  () => import('#components/Playground.client.vue'),
  [{}, slots]
)
</script>
