import "./plugins/axios";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import "@/assets/css/base.css";

// 引入axios
// import installAxios from "@/plugins/axios";

// el3 插件
import installElementPlus from "./plugins/element";

const app = createApp(App);

installElementPlus(app);
// installAxios(app);

app.use(store).use(router).mount("#app");
