import { createFilter } from 'vite'
import type {
  PresetInlinePx2ViewportOptions,
  PresetInlinePx2ViewportDefaultOptions
} from '../types'

export const createFileFilter = (
  options: PresetInlinePx2ViewportOptions,
  defaultOptions: PresetInlinePx2ViewportDefaultOptions
) => {
  const includes = options?.include as readonly (string | RegExp)[]
  const excludes = options?.exclude as readonly (string | RegExp)[]

  return createFilter(
    includes.concat(defaultOptions.include),
    excludes.concat(defaultOptions.exclude)
  )
}

export default createFileFilter
