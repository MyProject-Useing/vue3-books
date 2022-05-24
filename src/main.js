import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import "@/assets/css/base.css";

// ant-design-vu 插件
import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css"; // or 'ant-design-vue/dist/antd.less'

// import vue3videoPlay from "vue3-video-play"; // 引入组件
// import "vue3-video-play/dist/style.css"; // 引入css

const app = createApp(App);
// 引入视频插件
// app.use(vue3videoPlay);

app.use(store).use(router).use(Antd).mount("#app");
