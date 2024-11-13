---
layout: page
title: Playground
pageClass: playground-page
head:
  - - link
    - rel: stylesheet
      href: //cdn.jsdelivr.net/npm/luna-object-viewer/luna-object-viewer.css
  - - link
    - rel: stylesheet
      href: //cdn.jsdelivr.net/npm/luna-data-grid/luna-data-grid.css
  - - link
    - rel: stylesheet
      href: //cdn.jsdelivr.net/npm/luna-dom-viewer/luna-dom-viewer.css
  - - link
    - rel: stylesheet
      href: //cdn.jsdelivr.net/npm/luna-console/luna-console.css
  - - script
    - src: //cdn.jsdelivr.net/npm/luna-object-viewer/luna-object-viewer.js
  - - script
    - src: //cdn.jsdelivr.net/npm/luna-data-grid/luna-data-grid.js
  - - script
    - src: //cdn.jsdelivr.net/npm/luna-dom-viewer/luna-dom-viewer.js
  - - script
    - src: //cdn.jsdelivr.net/npm/luna-console/luna-console.js
---

<script setup>
import Playground from '#components/Playground.vue'
</script>

<Playground
  style="--radius: 0px; --shadow: none; margin-top: 0; height: calc(100vh - 64px);"
  class="xl"
  store
  enableLogs
  defaultEditable
  diableOpenInNew
>

```ts
import { t } from '@typp/core'

export default t({ name: String, age: Number })
```

</Playground>
