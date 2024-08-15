const { defineConfig } = require('@vue/cli-service')
const CompressionWebpackPlugin = require('compression-webpack-plugin') // 引入插件
module.exports = defineConfig({
  transpileDependencies: true,
  productionSourceMap: false,
  configureWebpack: (config) => {
    if (process.env.NODE_ENV === 'production') {
      // gzip 压缩
      config.plugins.push(new CompressionWebpackPlugin({
        algorithm: 'gzip',
        test: /\.js$|\.html$|\.json$|\.css/,
        threshold: 10240, // 10k 以上文件压缩
        minRatio: 0.8,
        deleteOriginalAssets: true // 不删除原文件
      }))
      config.externals = {
        vue: 'Vue'
      }
    }
  }
})
