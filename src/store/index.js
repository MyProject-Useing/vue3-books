import { createStore } from "vuex";
const setting = require("../../public/setting");

const files = require.context("./modules", false, /\.js$/);
const modules = {};

files.keys().forEach((key) => {
  modules[key.replace(/(\.\/|\.js)/g, "")] = files(key).default;
});
Object.keys(modules).forEach((key) => {
  modules[key]["namespaced"] = true;
});

export default createStore({
  state: {
    api: setting.apiAddress + ":" + setting.apiPort + "/",
    windowSize: {
      width: window.document.body.clientWidth,
      height: window.document.body.clientHeight,
    },
  },
  // getters: {},
  // mutations: {},
  // actions: {},
  // modules,
  modules,
});
