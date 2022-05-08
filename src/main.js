// import "./plugins/axios";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import "@/assets/css/base.css";

// ant-design-vu 插件
import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css"; // or 'ant-design-vue/dist/antd.less'

// import "lib-flexible";
// import { isMobile } from "@/plugins/utils";
// const isTrue = isMobile();
// if (isTrue === true) {
//   require("lib-flexible/flexible.js");
// }
const app = createApp(App);

app.use(store).use(router).use(Antd).mount("#app");
