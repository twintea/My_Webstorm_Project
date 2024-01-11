// const { defineConfig } = require('@vue/cli-service')
// module.exports = defineConfig({
//   transpileDependencies: true
// })

let proxyObj = {}
// proxyObj['/']= {
//   ws: false,
//   target: 'ws://localhost:8081/ws'
// };
// proxyObj['/']= {
//   ws: false,
//   target: 'http://localhost:8081',
//   changeOrigin: true,
//   pathRewrite: {
//     '^/': ''
//   }
// }
// module.exports={
//   devServer: {
//     host: 'localhost',
//     port:8080,
//     proxy: proxyObj
//   }
// }

proxyObj['/']= {
  ws: false,
  target: 'ws://localhost:7888/ws'
};
proxyObj['/']= {
  ws: false,
  target: 'http://localhost:7888',
  changeOrigin: true,
  pathRewrite: {
    '^/': ''
  }
}
module.exports={
  devServer: {
    host: 'localhost',
    port:7998,
    proxy: proxyObj
  }
}