function setBooks(list, item) {
  let newList = JSON.parse(JSON.stringify(list));
  newList[item.bookUrl] = { ...newList[item.bookUrl], ...item };
  return newList;
}

function deleteBooks(list, item) {
  delete list[item.bookUrl];
  return list;
}
const state = () => ({
  searchHistoryList:
    JSON.parse(localStorage.getItem("searchHistoryList")) || [], // 搜索记录
  readBooksList: JSON.parse(localStorage.getItem("ReadBooksList")) || {}, //阅读过的书籍
});
const getters = {
  searchHistoryList: (state) => state.searchHistoryList,
  readBooksList: (state) => state.readBooksList,
};
const mutations = {
  setSearchHistory(state, val) {
    if (state.searchHistoryList.includes(val)) {
      return false;
    }
    if (state.searchHistoryList.length >= 10) {
      state.searchHistoryList.splice(9, 1);
    }
    state.searchHistoryList.unshift(val);
    localStorage.setItem(
      "searchHistoryList",
      JSON.stringify(state.searchHistoryList)
    );
  },
  setBooksList(state, val) {
    state.readBooksList = setBooks(state.readBooksList, val);
    localStorage.setItem("ReadBooksList", JSON.stringify(state.readBooksList));
  },
  deleteReadBooks(state, val) {
    state.readBooksList = deleteBooks(state.readBooksList, val);
    localStorage.setItem("ReadBooksList", JSON.stringify(state.readBooksList));
  },
};
const actions = {
  setSearchHistory({ commit }, val) {
    commit("setSearchHistory", val);
  },
  setBooksList({ commit }, val) {
    commit("setBooksList", val);
  },
  deleteReadBooks({ commit }, val) {
    commit("deleteReadBooks", val);
  },
};
export default { state, getters, mutations, actions };
