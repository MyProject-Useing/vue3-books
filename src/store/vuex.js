export default {
  state: {
    // api: "/reader3",
    api: "http://localhost:3000/",
    windowSize: {
      width: window.innerWidth,
      height: window.innerHeight,
    },
    token: "danhua:1f9429a21f824828694e5f138f0aad5e",
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
