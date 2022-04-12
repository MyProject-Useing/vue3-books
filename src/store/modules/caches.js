function setBooks(list, item) {
  let filData = list.filter(
    (element) =>
      element.author === item.author &&
      element.name === item.name &&
      element.origin === item.origin
  )[0];

  if (filData) {
    filData = item;
  } else {
    list.push(item);
  }
  return list;
}

function deleteBooks(list, item) {
  let deleteIndex = -1;
  list.forEach((d, index) => {
    if (
      d.author === item.author &&
      d.name === item.name &&
      d.origin === item.origin
    ) {
      deleteIndex = index;
      return false;
    }
  });
  if (deleteIndex !== -1) {
    list.splice(deleteIndex, 1);
  }

  return list;
}
const state = () => ({
  searchHistoryList:
    JSON.parse(localStorage.getItem("searchHistoryList")) ?? [], // 搜索记录
  readBooksList: JSON.parse(localStorage.getItem("ReadBooksList")) ?? [], //阅读过的书籍
  readingBook: JSON.parse(sessionStorage.getItem("readingBook")) ?? {}, //正在阅读的书籍
});
const getters = {
  searchHistoryList: (state) => state.searchHistoryList,
  readBooksList: (state) => state.readBooksList,
  readingBook: (state) => state.readingBook,
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
  setReadBooks(state, val) {
    state.readBooksList = setBooks(state.readBooksList, val);
    localStorage.setItem("ReadBooksList", JSON.stringify(state.readBooksList));
  },
  deleteReadBooks(state, val) {
    state.readBooksList = deleteBooks(state.readBooksList, val);
    localStorage.setItem("ReadBooksList", JSON.stringify(state.readBooksList));
  },
  setReadingBook(state, readingBook) {
    state.readingBook = readingBook;
    window.sessionStorage.setItem("readingBook", JSON.stringify(readingBook));
  },
};
const actions = {
  setSearchHistory({ commit }, val) {
    commit("setSearchHistory", val);
  },
  setReadBooks({ commit }, val) {
    commit("setReadBooks", val);
  },
  deleteReadBooks({ commit }, val) {
    commit("deleteReadBooks", val);
  },
  setReadingBook({ commit }, val) {
    commit("setReadingBook", val);
  },
};
export default { state, getters, mutations, actions };
