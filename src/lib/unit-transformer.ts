import type { PresetInlinePx2ViewportOptions } from '../types'

/**
 * @description 获取转化单位的正则表达式
 */
export const getOriginUnitRegexp = (unit: string) => {
  return new RegExp(
    // "[^"]+" 匹配双引号内的内容
    // \'[^\']+\' 匹配单引号内的内容
    // url\\([^\\)]+\\) 匹配url(...)这样的模式
    // (\\d*\\.?\\d+) 匹配整数或小数
    `"[^"]+"|'[^']+'|url\\([^\\)]+\\)|(\\d*\\.?\\d+)${unit}`,
    'gi'
  )
}

/**
 * @description 获取属性单位
 */
export const getTransformedUnit = (
  prop: string,
  options: PresetInlinePx2ViewportOptions
) => {
  return !prop.includes('font')
    ? options.viewportUnit
    : options.fontViewportUnit
}
