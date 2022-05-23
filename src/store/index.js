import { createStore } from "vuex";

const setting = require("@/setting.js");

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
    // 系统主入口 （小说、视频）
    entry: localStorage.getItem("sys-entry") || setting.entry,
  },
  getters: {
    entry: (state) => state.entry,
  },
  mutations: {
    setSysEntry(state, val) {
      state.entry = val;
      localStorage.setItem("sys-entry", val);
    },
  },
  actions: {
    setSysEntry({ commit }, val) {
      commit("setSysEntry", val);
    },
  },
  modules,
});
