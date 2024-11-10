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

## 原初类型（Primitive）

原初类型是 JavaScript 中的最基本数据类型，会对应到运行时的最小数据形状。

### `string`

字符串类型是 JavaScript 中最常见的数据类型之一，它表示一个文本数据。

<Playground global style="height: 300px">

```ts
const strSchema = t.string()

strSchema.validate('hello')
strSchema.validate(1)

//    _?
const s0 = strSchema.validate.narrow('hello')
//    _?
const s1 = strSchema.parse(1)
//    _?
const s2 = strSchema.tryValidate('hello')
//    _?
const s3 = strSchema.tryValidate(1)
```

</Playground>

#### `string.length` <Badge type="warning" text="TODO" />

字符串类型的长度属性，表示字符串的长度。

<Playground style="height: 200px">

```ts
// t.string().length(10).validate('hello')
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
