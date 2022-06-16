const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  outputDir: 'docs',
  publicPath: '.',
  pages: {
    index: {
      entry: 'src/main.js',
      template: 'public/index.html',
      filename: 'index.html',
      title: 'QMK RGB Matrix Calculator',
      chunks: ['chunk-vendors', 'chunk-common', 'index']
    },
  },
})
