---
layout: page
title: Playground
pageClass: playground-page
---

<script setup>
import Playground from '#components/Playground.vue'
</script>

<Playground style="margin-top: 0; height: 100%">

```ts
import { t } from '@typp/core'

const Dog = t({ name: String, age: Number })
```

</Playground>
