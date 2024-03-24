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

export interface PresetInlinePx2ViewportDefaultOptions {
  /** 要转化的单位 */
  unitToConvert: string

  /** UI设计稿的宽度 */
  viewportWidth: number

  /** 转换后的精度，即小数点位数 */
  unitPrecision: number

  /** 指定需要转换成的视窗单位，默认vw */
  viewportUnit: string

  /** 指定字体需要转换成的视窗单位，默认vw */
  fontViewportUnit: string

  /** 默认值1，小于或等于1px则不进行转换 */
  minPixelValue: number

  /** 指定转换的css属性的单位，*代表全部css属性的单位都进行转换 */
  propList: string[]

  include: readonly (string | RegExp)[]
  exclude: readonly (string | RegExp)[]
}
