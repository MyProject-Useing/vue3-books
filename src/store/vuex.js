export default {
  state: {
    api: window.location.protocol + "//" + window.location.hostname + ":3000/",
    windowSize: {
      width: window.innerWidth,
      height: window.innerHeight,
    },
  },
  mutations: {
    // setSearchConfig(state, searchConfig) {
    //   state.searchConfig = searchConfig;
    // },
  },
  getters: {
    api: (state) => {
      if (
        state.api.startsWith("http://") ||
        state.api.startsWith("https://") ||
        state.api.startsWith("//")
      ) {
        return state.api;
      }
      return "//" + state.api;
    },
  },
  actions: {},
};
