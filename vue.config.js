let path = require("path");
function resolve(dir) {
  return path.join(__dirname, dir);
}
module.exports = {
  lintOnSave: false,
  //基本路径
  publicPath: "./",
  //输出文件目录
  outputDir: "dist",
  //放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录。
  assetsDir: "static",
  chainWebpack: config => {
    //这里是对环境的配置，不同的环境对应不同的BASE_URL
    config.plugin("define").tap(args => {
      args[0]["process.env"].BASE_URL = JSON.stringify(process.env.BASE_URL);
      return args;
    });
    //设置别名
    config.resolve.alias
      // .set("vue$", resolve("vue/dist/vue.esm.js"))
      .set("@", resolve("src"))
      .set("@img", resolve("src/assets/img"));
  },
  devServer: {
    open: true,
    proxy: {
      "/apis": {
        port: 8081,
        target: process.env.BASE_URL, // target host
        ws: true, // proxy websockets
        changeOrigin: true, // needed for virtual hosted sites
        pathRewrite: {
          "^/apis": "" // rewrite path
        }
      }
    }
  }
};
