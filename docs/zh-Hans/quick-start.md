<script setup>
import Playground from '#components/Playground.vue'
</script>

# 快速开始

如果你想体验 `typp`，你可以按照本教程对本工具进行快速上手。

## 方式

- Playground
- NPM

## NPM

你可以通过 NPM 来安装 `typp`：

```bash
npm install @typp/core @typp/validator
```

### 使用

<Playground style="height: 300px">

```ts
import { type Pretty, t } from '@typp/core'
import validator from '@typp/validator'

t.use(validator)

const Dog = t({ name: String, age: Number })

const dog = Dog.validate({ name: 'dog', age: 1 })
//   _?
type Dog = Pretty<typeof dog>

Dog.validate({ name: 'dog', age: '1' })
```

</Playground>
