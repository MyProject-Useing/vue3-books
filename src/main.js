import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/index.js";
import store from "./store/index.js";

// ant-design-vu 插件
import "ant-design-vue/dist/antd.css"; // or 'ant-design-vue/dist/antd.less'
import "@/assets/css/base.css";
const app = createApp(App);

// 压缩空格 --'condense' | 'preserve'
// app.config.compilerOptions.whitespace = "preserve";

/* eslint-disable no-unused-vars */
app.config.errorHandler = (err, vm, info) => {
  // 处理错误
  // `info` 是 Vue 特定的错误信息，比如错误所在的生命周期钩子
};

app.use(store).use(router).mount("#app");
