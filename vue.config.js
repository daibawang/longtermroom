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
      .set("@img", resolve("src/assets/img"))
      .set("@svg", resolve("./src/icons/svg"));
    config.module.rules.delete("svg"); // 重点:删除默认配置中处理svg,
    config.module
      .rule("svg-sprite-loader")
      .test(/\.svg$/)
      .include
      .add(resolve("src/icons/svg")) // 处理svg目录
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]"
      });
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
