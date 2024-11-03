<script setup>
import Foo from '#components/Foo.vue'
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

```ts
import { t } from '@typp/core'
import validator from '@typp/validator'

t.use(validator)

const Dog = t({ name: String, age: Number })

const dog0 = Dog.validate({ name: 'dog', age: 1 })
// => { name: 'dog', age: 1 }
const dog1 = Dog.validate({ name: 'dog', age: '1' })
// => ValidateError: Data is partially match
```

<Foo />
