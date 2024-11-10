---
next:
  text: '类型运算'
  link: './compound.md'
---

<script setup>
import Playground from '#components/Playground.vue'
</script>

# 常用类型

在 Typp 中的设计中，我们借用了一些现有的概念，以用来减少用户的学习成本。这些概念包括了 TypeScript、Flow 等静态类型检查工具中的一些概念，以及一些 JavaScript 本身的概念。

基于一些共识，我们按照一些已经存在的观点在这里介绍 Typp 中的一些常用类型，以及它们的常见用法。

## 原初类型（Primitive）

原初类型是 JavaScript 运行时的最小数据类型，在值领域中它们是不可变的，不可分解的，不可变更的。原初类型包括了字符串、数字、布尔值、大整数、符号、空值、未定义值。

> - [MDN - 原始值（Primitive）](https://developer.mozilla.org/zh-CN/docs/Glossary/Primitive)
> - [JavaScript 数据类型和数据结构#原始值](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures#%E5%8E%9F%E5%A7%8B%E5%80%BC)
> - [常用的原初类型: `string`, `number`, 和 `boolean`](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#the-primitives-string-number-and-boolean)
> - [TypeScript 中的基础类型](https://www.typescriptlang.org/docs/handbook/basic-types.html)
> - [Flow 中的原初类型](https://flow.org/en/docs/types/primitives/)
> - [Zod 中的原初类型](https://zod.dev/?id=primitives)

:::tip

- 值领域（Value Domain）：在运行时的实际数据

:::

### `string`

字符串类型是 JavaScript 中最常见的数据类型之一，它表示一个文本数据。我们可以通过如下的方式来定义一个字符串类型：

```ts
const strSchema = t.string()
```

当我们安装了对应的校验器插件之后，我们可以使用 `validate` 方法来校验一个字符串类型的值：

```ts
const strSchema = t.string()

strSchema.validate('hello') // [!code focus]
// => 'hello' // [!code focus]
```

当我们传入一个非字符串类型的值时，校验器会抛出一个错误：

```ts
const strSchema = t.string()

strSchema.validate(1) // [!code focus]
// => TypeError: Expected string, but got number // [!code focus]
```

在 Playground 中看看：

<Playground global style="height: 380px">

```ts
const strSchema = t.string()

strSchema.validate('hello')
strSchema.validate(1)

//           _?
export const s0 = strSchema.validate.narrow('hello')
//           _?
export const s1 = strSchema.parse(1)
// => '1'
//           _?
export const s2 = strSchema.tryValidate('hello')
//           _?
export const s3 = strSchema.tryValidate(1)
```

</Playground>

### `number`

### `boolean`

### `bigint`

### `symbol`

## 空类型

空类型是原初类型的子集，表示没有值的情况，但由于相对于原初类型而言，空类型的值更加明确，所以它们是独立的类型。

### `undefined`

### `null`

### `void`

## 顶层/底层

除了与 JavaScript 运行时进行一一对应的原初类型之外，在类型之间的关系上，还有两个特殊的类型，它们并不与 JavaScript 运行时的数据形状一一对应，而是用于描述类型关系的边界。

- 顶层类型：表示所有类型的父类型，是所有类型的 super type。
- 底层类型：表示所有类型的子类型，是所有类型的 sub type。

### `any`

### `unknown`

### `never`

## 字面量

字面量类型是一种特殊的类型，它表示一个具体的值，而不是一个范围。
