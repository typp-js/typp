---
layout: page
title: Playground
pageClass: playground-page
---

<script setup>
import Playground from '#components/Playground.vue'
</script>

<Playground
  style="--radius: 0px; margin-top: 0; height: calc(100vh - 64px);"
  class="xl"
  defaultEditable
>

```ts
import { t } from '@typp/core'

export default t({ name: String, age: Number })
```

</Playground>
