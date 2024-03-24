---
title: vite-plugin-preset-inline-px-to-viewport
lang: zh-CN
---

# vite-plugin-preset-inline-px-to-viewport

应用于行内样式转化为 viewport 单位的 vite 插件。

## 原理

1、利用 rollup transform 钩子做转化处理
2、利用 postcss API 做 css 检测、正则校验匹配替换

## 协议（使用方式上）

### 静态行内样式

```vue
<div
  fixed
  top-600px
  style="border: 5px solid #000; width: 100px; padding: 0 10px"
>
  行内
</div>
```

### <font color=red>动态行内样式：暂不支持</font>

```vue
<!-- 暂不支持 -->
<div :style="{ height: '50px' }">
  行内
</div>
```

## API

### Attributes

```typescript
export interface PresetInlinePx2ViewportOptions {
  /** 应用周期，默认 build */
  apply?: 'serve' | 'build'

  /** 要转化的单位 */
  unitToConvert?: string

  /** UI设计稿的宽度 */
  viewportWidth?: number

  /** 转换后的精度，即小数点位数 */
  unitPrecision?: number

  /** 指定需要转换成的视窗单位，默认vw */
  viewportUnit?: string

  /** 指定字体需要转换成的视窗单位，默认vw */
  fontViewportUnit?: string

  /** 默认值1，小于或等于1px则不进行转换 */
  minPixelValue?: number

  /** 指定转换的css属性的单位，*代表全部css属性的单位都进行转换 */
  propList?: string[]

  include?: string | RegExp | readonly (string | RegExp)[]
  exclude?: string | RegExp | readonly (string | RegExp)[]
}
```

## 基础用法

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import PresetInlinePx2ViewPort from 'vite-plugin-preset-inline-px-to-viewport'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // 行内 style 转化
    PresetInlinePx2ViewPort({
      apply: command,
      unitToConvert: 'px', // 要转化的单位
      viewportWidth: Number(env.VITE_POSTCSS_VIEWPORT_WIDTH), // UI设计稿的宽度
      unitPrecision: 6, // 转换后的精度，即小数点位数
      propList: ['*'], // 指定转换的css属性的单位，*代表全部css属性的单位都进行转换
      viewportUnit: 'vw', // 指定需要转换成的视窗单位，默认vw
      fontViewportUnit: 'vw', // 指定字体需要转换成的视窗单位，默认vw
      minPixelValue: 1 // 默认值1，小于或等于1px则不进行转换
    })
  ]
})
```

## 例子

```vue
<template>
  <div
    fixed
    top-600px
    style="border: 5px solid #000; width: 100px; padding: 0 10px"
  >
    行内
  </div>
</template>
```
