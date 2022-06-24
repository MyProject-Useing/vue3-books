import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

// ant-design-vu 插件
import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css"; // or 'ant-design-vue/dist/antd.less'

import "@/assets/css/base.css";

const app = createApp(App);
app.use(store).use(router).use(Antd).mount("#app");
