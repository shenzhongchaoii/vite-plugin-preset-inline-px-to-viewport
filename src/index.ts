import type { Plugin } from 'vite'
import { parse } from 'vue/compiler-sfc'
import type {
  PresetInlinePx2ViewportOptions,
  PresetInlinePx2ViewportDefaultOptions
} from './types'
import createFileFilter from './lib/create-file-filter'
import createPropListMatcher from './lib/create-prop-list.matcher'
import { getOriginUnitRegexp } from './lib/unit-transformer'
import templateInlineStyleTransformer from './lib/template-inline-style-transformer'

const defaultOptions: PresetInlinePx2ViewportDefaultOptions = {
  /** 要转化的单位 */
  unitToConvert: 'px',

  /** UI设计稿的宽度 */
  viewportWidth: 750,

  /** 转换后的精度，即小数点位数 */
  unitPrecision: 6,

  /** 指定需要转换成的视窗单位，默认vw */
  viewportUnit: 'vw',

  /** 指定字体需要转换成的视窗单位，默认vw */
  fontViewportUnit: 'vw',

  /** 默认值1，小于或等于1px则不进行转换 */
  minPixelValue: 1,

  /** 指定转换的css属性的单位，*代表全部css属性的单位都进行转换 */
  propList: ['*'],

  include: ['**/*.vue'],
  exclude: ['node_modules', 'dist']
}

/**
 * @description 应用于行内样式 px 转化为 viewport 单位
 */
const vitePresetInlinePx2Viewport = (
  opts: PresetInlinePx2ViewportOptions
): Plugin => {
  opts.include = opts?.include
    ? Array.isArray(opts.include)
      ? opts.include
      : [opts.include]
    : []
  opts.exclude = opts?.exclude
    ? Array.isArray(opts.exclude)
      ? opts.exclude
      : [opts.exclude]
    : []

  const filter = createFileFilter(opts, defaultOptions)

  const options = Object.assign(opts, defaultOptions)

  const originUnitRegexp = getOriginUnitRegexp(options.unitToConvert)

  const propListMatcher = createPropListMatcher(options.propList)

  return {
    name: 'vite-plugin-preset-inline-px-to-viewport',
    apply: options.apply || 'build',
    enforce: 'pre',
    async transform(src: string, id: string) {
      if (!filter(id))
        return {
          code: src,
          map: null
        }

      const { descriptor } = parse(src)

      let transformedCode = src

      const template = descriptor.template

      if (template?.content) {
        const { content, loc } = template
        const { start, end } = loc

        if (id.includes('App.vue')) {
          const templateContent = templateInlineStyleTransformer(
            content,
            options,
            originUnitRegexp,
            propListMatcher
          )

          transformedCode =
            src.slice(0, start.offset) + templateContent + src.slice(end.offset)
        }
      }
      return {
        code: transformedCode,
        map: null
      }
    }
  }
}

export default vitePresetInlinePx2Viewport
