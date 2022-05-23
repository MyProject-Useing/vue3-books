const setting = require("@/setting.js");

const state = () => ({
  api: setting.book.api,
});

const getters = {
  api: (state) => state.api,
};

const mutations = {};
const actions = {
  // setSearchHistory({ commit }, val) {
  //   commit("setSearchHistory", val);
  // },
};
export default { state, getters, mutations, actions };
