import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: ['./src/index'],
  externals: [
    'vite',
    'vue/compiler-sfc',
    '@vue/compiler-sfc',
    'cheerio',
    'postcss'
  ],
  clean: true,
  declaration: true,
  rollup: {
    emitCJS: true
  }
})
