<script setup>
import Playground from '#components/Playground.vue'
</script>

# 快速开始

如果你想简单体验一下 `typp`，你可以按照本篇中的内容快速上手。

## 简介

`typp` 是一个与 TypeScript 类型系统进行一一对应的运行时类型系统描述工具，通过对类型信息进行动态描述，我们可以通过强大的插件系统来对类型进行验证、转换、序列化等操作，同时我们也能享受在编译时的类型检查。

`typp` 非常注重系统内的可扩展性，在设计之初便考虑到了许多的场景：自定义类型、自定义教养规则、自定义类型转换等等。这些在 `typp` 中都能够轻而易举的做到，通过 `typp` 你能很方便的将运行时的类型系统与 TypeScript 的类型系统进行无缝对接。

## 方式

你可以通过一下两种方式来体验或使用 `typp`：

- Playground
- NPM

### NPM

现在我们先简单介绍一下如何在项目中使用它，首先你可以通过 NPM 来安装 `typp`：

```bash
npm install @typp/core @typp/validator
```

#### 使用

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