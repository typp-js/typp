<script setup>
import Playground from '#components/Playground.vue'

const code = `
import { t, type Pretty } from '@typp/core'
import validator from '@typp/validator'

t.use(validator)

const Dog = t({ name: String, age: Number })

const dog0 = Dog.validate({ name: 'dog', age: 1 })
//   _?
type Dog0 = Pretty<typeof dog0>

Dog.validate({ name: 'dog', age: '1' })
`
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

<Playground :code="code" />
