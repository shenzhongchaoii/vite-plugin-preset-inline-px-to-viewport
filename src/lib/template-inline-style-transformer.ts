import * as cheerio from 'cheerio'
import * as postcss from 'postcss'
import { getTransformedUnit } from './unit-transformer'
import type { PresetInlinePx2ViewportOptions } from '../types'

/** String.prototype.replace 的 replacement 匹配处理 */
export type ReplacementHandler = (substring: string, ...args: any[]) => string

const toFixed = (number: number, precision: number) => {
  // 10 的 precision + 1 次方
  const multiplier = 10 ** (precision + 1)

  // 放大并向下取整
  const wholeNumber = Math.floor(number * multiplier)

  // 四舍五入到最接近的精度值
  return (Math.round(wholeNumber / 10) * 10) / multiplier
}

/**
 * @description 单位值转化（replace 处理下的 replacement 匹配处理）
 */
const unit2ViewportReplacementHandler = (
  unit: string,
  options: PresetInlinePx2ViewportOptions
): ReplacementHandler => {
  return (match: string, $1, $2) => {
    if (!$1) return match

    const pixelVal = Number.parseFloat($1)
    if (pixelVal <= options.minPixelValue!) return match

    const parsedVal = toFixed(
      // 计算出占视窗宽度的百分比
      (pixelVal / options.viewportWidth!) * 100,
      // 将结果四舍五入到 opts.unitPrecision 指定的小数位数
      options.unitPrecision!
    )

    return parsedVal === 0 ? '0' : parsedVal + unit
  }
}

/**
 * @description 将样式值转化
 */
const cssTextUnit2ViewportTransformer = (
  cssText: string,
  options: PresetInlinePx2ViewportOptions,
  originUnitRegexp: RegExp,
  propListMatcher: (prop: string) => boolean
) => {
  // 解析CSS字符串
  const root = postcss.parse(cssText)

  // 遍历CSS规则
  const landscapeRule = root.clone().removeAll()

  root.walkDecls(decl => {
    if (!decl.value.includes(options.unitToConvert!)) return
    if (!propListMatcher(decl.prop)) return

    landscapeRule.append(
      decl.clone({
        value: decl.value.replace(
          originUnitRegexp,
          unit2ViewportReplacementHandler(
            getTransformedUnit(decl.prop, options)!,
            options
          )
        )
      })
    )
  })

  return landscapeRule.toString()
}

/**
 * @description 将动态样式值转化
 */
const cssSetupTextUnit2ViewportTransformer = (
  cssText: string,
  options: PresetInlinePx2ViewportOptions,
  originUnitRegexp: RegExp,
  propListMatcher: (prop: string) => boolean
) => {
  // 解析CSS字符串
  const root = postcss.parse(cssText)

  // 遍历CSS规则
  const landscapeRule = root.clone().removeAll()

  root.walkDecls(decl => {
    console.log(
      123,
      decl.value.replace(
        originUnitRegexp,
        unit2ViewportReplacementHandler(
          getTransformedUnit(decl.prop, options)!,
          options
        )
      ),
      decl.value
    )
    if (decl.value.includes(options.unitToConvert!)) return
    if (!propListMatcher(decl.prop)) return
    landscapeRule.append(
      decl.clone({
        value: decl.value.replace(
          originUnitRegexp,
          unit2ViewportReplacementHandler(
            getTransformedUnit(decl.prop, options)!,
            options
          )
        )
      })
    )
  })

  return landscapeRule.toString()
}
export const templateInlineStyleTransformer = (
  content: string,
  options: PresetInlinePx2ViewportOptions,
  originUnitRegexp: RegExp,
  propListMatcher: (prop: string) => boolean
) => {
  const $ = cheerio.load(content, {
    xmlMode: true, // 保持标签原样，即便是自闭合的
    decodeEntities: false // 防止HTML实体编码转化
  })

  const styleNodeList = $('[style]')

  if (styleNodeList.length > 0) {
    // 寻找并包装点击事件
    styleNodeList.each((i, elem) => {
      const node = $(elem)
      // 静态读取
      const cssText = node.attr('style')
      if (cssText) {
        const transformered = cssTextUnit2ViewportTransformer(
          cssText,
          options,
          originUnitRegexp,
          propListMatcher
        )
        node.attr('style', transformered)
      }
    })
  }

  // 通过 cheerio 输出处理后的 HTML 字符串
  return $.html()
}

export default templateInlineStyleTransformer
