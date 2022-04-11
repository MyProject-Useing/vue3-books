import settings from "./config";

const defaultNS = [{ username: "默认", userNS: "default" }];
const builtInBookGroup = [
  { groupId: -1, groupName: "全部", order: -10, show: true },
  { groupId: -2, groupName: "本地", order: -9, show: true },
  { groupId: -3, groupName: "音频", order: -8, show: true },
  { groupId: -4, groupName: "未分组", order: -7, show: true },
];

export default {
  state: {
    connected: false,
    api: "https://reader.htmake.com/reader3",
    shelfBooks: [],
    readingBook: {},
    cacheBokks: {},
    config: { ...settings.config },
    miniInterface: false,
    windowSize: {
      width: window.innerWidth,
      height: window.innerHeight,
    },
    touchable: "ontouchstart" in document,
    token: "danhua:1f9429a21f824828694e5f138f0aad5e",
    bookSourceList: [],
    isSecureMode: false,
    isManagerMode: false,
    secureKey: "",
    userInfo: {},
    userNS: "default",
    showManagerMode: false,
    version: process.env.VUE_APP_BUILD_VERSION,
    filterRules: [],
    speechVoiceConfig: { ...settings.speechVoiceConfig },
    safeArea: {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    },
    autoPlay: false,
    failureIncludeTimeout: false,
    failureBookSource: [],
    bookGroupList: [],
    rssSourceList: [],
    shelfConfig: { ...settings.shelfConfig },
    showImageViewer: false,
    previewImageIndex: 0,
    previewImgList: [],
    searchConfig: { ...settings.searchConfig },
  },
  mutations: {
    setShelfBooks(state, books) {
      // 过滤一下不用的字段，省点内存
      state.shelfBooks = books.map((v) => {
        return {
          author: v.author,
          bookUrl: v.bookUrl,
          coverUrl: v.coverUrl,
          durChapterIndex: v.durChapterIndex,
          durChapterPos: v.durChapterPos,
          durChapterTime: v.durChapterTime,
          durChapterTitle: v.durChapterTitle,
          kind: v.kind,
          intro: v.intro,
          lastCheckTime: v.lastCheckTime,
          latestChapterTitle: v.latestChapterTitle,
          name: v.name,
          origin: v.origin,
          originName: v.originName,
          totalChapterNum: v.totalChapterNum,
          type: v.type,
          group: v.group,
        };
      });
    },
    updateShelfBook(state, book) {
      const index = state.shelfBooks.findIndex(
        (v) => v.bookUrl === book.bookUrl
      );
      if (index >= 0) {
        state.shelfBooks[index] = {
          ...state.shelfBooks[index],
          ...{
            author: book.author || state.shelfBooks[index].author,
            bookUrl: book.bookUrl || state.shelfBooks[index].bookUrl,
            coverUrl: book.coverUrl || state.shelfBooks[index].coverUrl,
            durChapterIndex:
              book.durChapterIndex || state.shelfBooks[index].durChapterIndex,
            durChapterPos:
              book.durChapterPos || state.shelfBooks[index].durChapterPos,
            durChapterTime:
              book.durChapterTime || state.shelfBooks[index].durChapterTime,
            durChapterTitle:
              book.durChapterTitle || state.shelfBooks[index].durChapterTitle,
            kind: book.kind || state.shelfBooks[index].kind,
            intro: book.intro || state.shelfBooks[index].intro,
            lastCheckTime:
              book.lastCheckTime || state.shelfBooks[index].lastCheckTime,
            latestChapterTitle:
              book.latestChapterTitle ||
              state.shelfBooks[index].latestChapterTitle,
            name: book.name || state.shelfBooks[index].name,
            origin: book.origin || state.shelfBooks[index].origin,
            originName: book.originName || state.shelfBooks[index].originName,
            totalChapterNum:
              book.totalChapterNum || state.shelfBooks[index].totalChapterNum,
            type: book.type || state.shelfBooks[index].type,
            group: book.group || state.shelfBooks[index].group,
          },
        };
        state.shelfBooks = [].concat(state.shelfBooks);
      }
    },
    setReadingBook(state, readingBook) {
      state.readingBook = readingBook;
      // 更新书架信息
      setTimeout(() => {
        for (let i = 0; i < state.shelfBooks.length; i++) {
          if (state.shelfBooks[i].bookUrl === readingBook.bookUrl) {
            const title = ((readingBook.catalog || [])[readingBook.index] || {})
              .title;
            state.shelfBooks[i] = {
              ...state.shelfBooks[i],
              durChapterTime: new Date().getTime(),
              durChapterIndex: readingBook.index,
              ...(title ? { durChapterTitle: title } : {}),
            };
            break;
          }
        }
        state.shelfBooks = [].concat(state.shelfBooks);
      }, 100);
      // eslint-disable-next-line no-unused-vars
      const { catalog, ...info } = readingBook;
      window.localStorage &&
        window.localStorage.setItem("readingRecent", JSON.stringify(info));
    },
    setConfig(state, config) {
      if (
        config.theme !== settings.defaultNightTheme &&
        config.theme !== "custom"
      ) {
        config.themeType = "day";
      } else if (config.theme === settings.defaultNightTheme) {
        config.themeType = "night";
      }
      state.config = config;
      window.localStorage &&
        window.localStorage.setItem("config", JSON.stringify(config));
    },
    setMiniInterface(state, mini) {
      if (state.config.pageMode === "自适应") {
        state.miniInterface = mini;
      } else {
        state.miniInterface = true;
      }
    },
    setWindowSize(state, size) {
      state.windowSize = size;
    },
    setTouchable(state, touchable) {
      state.touchable = touchable;
    },
    setApi(state, api) {
      state.api = api;
    },
    setConnected(state, connected) {
      state.connected = connected;
    },
    setBookSourceList(state, list) {
      // 过滤一下不用的字段，省点内存
      state.bookSourceList = list.map((v) => {
        return {
          bookSourceGroup: v.bookSourceGroup,
          bookSourceName: v.bookSourceName,
          bookSourceType: v.bookSourceType,
          bookSourceUrl: v.bookSourceUrl,
          exploreUrl: v.exploreUrl,
        };
      });
    },
    setUserNS(state, userNS) {
      state.userNS = userNS;
    },
    setIsSecureMode(state, isSecureMode) {
      state.isSecureMode = isSecureMode;
    },
    setSecureKey(state, secureKey) {
      state.secureKey = secureKey;
    },
    setIsManagerMode(state, isManagerMode) {
      state.isManagerMode = isManagerMode;
    },
    setShowManagerMode(state, showManagerMode) {
      state.showManagerMode = showManagerMode;
    },
    setUserInfo(state, userInfo) {
      state.userInfo = userInfo;
    },
    setUserList(state, userList) {
      if (userList.length) {
        state.userList = []
          .concat([{ username: "系统默认", userNS: "default" }])
          .concat(userList);
      } else {
        state.userList = [].concat(defaultNS);
      }
    },
    setFilterRules(state, filterRules) {
      state.filterRules = filterRules;
      window.localStorage &&
        window.localStorage.setItem("filterRules", JSON.stringify(filterRules));
    },
    addFilterRule(state, rule) {
      const filterRules = [].concat(state.filterRules).concat([rule]);
      state.filterRules = filterRules;
      window.localStorage &&
        window.localStorage.setItem("filterRules", JSON.stringify(filterRules));
    },
    setNightTheme(state, isNight) {
      let config = { ...state.config };
      if (isNight) {
        if (
          config.theme !== settings.defaultNightTheme &&
          config.themeType !== "night"
        ) {
          window.localStorage &&
            window.localStorage.setItem("lastDayTheme", config.theme);
        }
        const lastNightTheme =
          (window.localStorage &&
            window.localStorage.getItem("lastNightTheme")) ||
          6;
        config.themeType = "night";
        config.theme = lastNightTheme;
      } else if (
        config.theme === settings.defaultNightTheme ||
        config.themeType === "night"
      ) {
        window.localStorage &&
          window.localStorage.setItem("lastNightTheme", config.theme);
        const lastDayTheme =
          (window.localStorage &&
            window.localStorage.getItem("lastDayTheme")) ||
          0;
        config.themeType = "day";
        config.theme = lastDayTheme;
      }
      state.config = config;
      window.localStorage &&
        window.localStorage.setItem("config", JSON.stringify(config));
    },
    setSpeechVoiceConfig(state, voiceConfig) {
      state.speechVoiceConfig = voiceConfig;
      window.localStorage &&
        window.localStorage.setItem(
          "speechVoiceConfig",
          JSON.stringify(voiceConfig)
        );
    },
    setSafeArea(state, safeArea) {
      state.safeArea = { ...state.safeArea, ...safeArea };
    },
    setAutoPlay(state, autoPlay) {
      state.autoPlay = autoPlay;
    },
    addFailureBookSource(state, { bookSourceUrl, errorMsg }) {
      const index = state.failureBookSource.findIndex(
        (v) => v.bookSourceUrl === bookSourceUrl
      );
      if (index >= 0) {
        return;
      }
      const bookSource = state.bookSourceList.find(
        (v) => v.bookSourceUrl === bookSourceUrl
      );
      if (bookSource) {
        state.failureBookSource = state.failureBookSource.concat([
          { ...bookSource, errorMsg },
        ]);
      }
    },
    removeFailureBookSource(state, bookSourceList) {
      for (let i = 0; i < bookSourceList.length; i++) {
        const index = state.failureBookSource.findIndex(
          (v) => v.bookSourceUrl === bookSourceList[i].bookSourceUrl
        );
        if (index >= 0) {
          state.failureBookSource.splice(index, 1);
        }
      }
    },
    setFailureIncludeTimeout(state, failureIncludeTimeout) {
      state.failureIncludeTimeout = failureIncludeTimeout;
    },
    setBookGroupList(state, bookGroupList) {
      const _bookGroupList = [];

      builtInBookGroup.forEach((group) => {
        if (!bookGroupList.some((v) => v.groupId === group.groupId)) {
          _bookGroupList.push(group);
        }
      });
      state.bookGroupList = _bookGroupList.concat(bookGroupList);
    },
    setRssSourceList(state, rssSources) {
      state.rssSourceList = [].concat(rssSources);
    },
    setShelfConfig(state, shelfConfig) {
      state.shelfConfig = shelfConfig;
      window.localStorage &&
        window.localStorage.setItem("shelfConfig", JSON.stringify(shelfConfig));
    },
    setPreviewImageIndex(state, previewImageIndex) {
      state.previewImageIndex = previewImageIndex;
    },
    setPreviewImgList(state, previewImgList) {
      if (previewImgList === false) {
        state.showImageViewer = false;
        state.previewImgList = [];
        state.previewImageIndex = 0;
      } else {
        state.previewImgList = previewImgList;
        state.showImageViewer = true;
      }
    },
    setSearchConfig(state, searchConfig) {
      state.searchConfig = searchConfig;
      window.localStorage &&
        window.localStorage.setItem(
          "searchConfig",
          JSON.stringify(searchConfig)
        );
    },
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
    apiRoot: (state, getters) => {
      return getters.api.replace(/\/reader3\/?/, "");
    },
    isSlideRead: (state) => {
      return state.miniInterface && state.config.readMethod === "左右滑动";
    },
    isSystemNight: (state) => {
      return state.config.theme === settings.defaultNightTheme;
    },
    isNight: (state) => {
      return state.config.themeType === "night";
    },
    currentContentBGImg: (state, getters) => {
      if (state.config.contentBGImg) {
        return state.config.contentBGImg.startsWith("bg/") ||
          state.config.contentBGImg.startsWith("http://") ||
          state.config.contentBGImg.startsWith("https://") ||
          state.config.contentBGImg.startsWith("//")
          ? state.config.contentBGImg
          : getters.apiRoot + state.config.contentBGImg;
      }
      return undefined;
    },
    customCSSUrl: (_, getters) => {
      if (getters.api) {
        return getters.apiRoot + "/assets/reader.css";
      }
      return false;
    },
    currentFontFamily: (state) => {
      return settings.fonts[state.config.font];
    },
    currentThemeConfig: (state, getters) => {
      if (state.config.theme === "custom") {
        return {
          body:
            (state.miniInterface
              ? "linear-gradient(to bottom,rgba(0,0,0,.2) 0,transparent 56px), "
              : "") + (state.config.bodyColor || "#eadfca"),
          content: {
            backgroundImage: getters.currentContentBGImg
              ? `${
                  state.miniInterface
                    ? "linear-gradient(to bottom,rgba(0,0,0,.2) 0,transparent 56px), "
                    : ""
                }url(${getters.currentContentBGImg})`
              : null,
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundAttachment: "fixed",
            backgroundColor: state.config.contentColor || "#ede7da",
            backgroundSize: "cover",
          },
          popupPure: state.config.popupColor || "#ede7da",
          popup:
            (state.miniInterface
              ? "linear-gradient(to bottom,rgba(0,0,0,.2) 0,transparent 36px), "
              : "") + (state.config.popupColor || "#ede7da"),
        };
      } else {
        const config = {
          ...settings.themes[state.config.theme],
        };
        config.popupPure = config.popup;
        if (state.miniInterface) {
          config.body =
            "linear-gradient(to bottom,rgba(0,0,0,.2) 0,transparent 36px), " +
            config.body;
          config.content =
            "linear-gradient(to bottom,rgba(0,0,0,.2) 0,transparent 36px), " +
            config.content;
          config.popup =
            "linear-gradient(to bottom,rgba(0,0,0,.2) 0,transparent 36px), " +
            config.popup;
        }
        return config;
      }
    },
    shelfBooks: (state) => {
      return state.shelfBooks.sort(function (a, b) {
        var x = a["durChapterTime"] || 0;
        var y = b["durChapterTime"] || 0;
        return y - x;
      });
    },
    builtInBookGroupMap: () => {
      return builtInBookGroup.reduce((c, v) => {
        c[v.groupId] = v.groupName;
        return c;
      }, {});
    },
  },
  actions: {
    syncFromLocalStorage({ commit }) {
      if (!window.localStorage) {
        return;
      }
      try {
        // 获取配置
        const config = JSON.parse(window.localStorage.getItem("config"));
        if (config && typeof config === "object") {
          commit("setConfig", { ...settings.config, ...config });
        }
      } catch (error) {
        //
      }
      try {
        // 获取最近阅读书籍
        const readingRecent = JSON.parse(
          window.localStorage.getItem("readingRecent")
        );
        if (readingRecent && typeof readingRecent === "object") {
          if (typeof readingRecent.index == "undefined") {
            readingRecent.index = 0;
          }
          commit("setReadingBook", readingRecent);
        }
      } catch (error) {
        //
      }
      try {
        // 获取过滤规则
        const filterRules = JSON.parse(
          window.localStorage.getItem("filterRules")
        );
        if (filterRules && Array.isArray(filterRules)) {
          commit("setFilterRules", filterRules);
        }
      } catch (error) {
        //
      }
      try {
        // 获取听书配置
        const speechVoiceConfig = JSON.parse(
          window.localStorage.getItem("speechVoiceConfig")
        );
        if (speechVoiceConfig && typeof speechVoiceConfig === "object") {
          commit("setSpeechVoiceConfig", {
            ...settings.speechVoiceConfig,
            ...speechVoiceConfig,
          });
        }
      } catch (error) {
        //
      }
      try {
        // 获取书架设置
        const shelfConfig = JSON.parse(
          window.localStorage.getItem("shelfConfig")
        );
        if (shelfConfig && typeof shelfConfig === "object") {
          commit("setShelfConfig", {
            ...settings.shelfConfig,
            ...shelfConfig,
          });
        }
      } catch (error) {
        //
      }
      try {
        // 获取搜索设置
        const searchConfig = JSON.parse(
          window.localStorage.getItem("searchConfig")
        );
        if (searchConfig && typeof searchConfig === "object") {
          commit("setSearchConfig", {
            ...settings.searchConfig,
            ...searchConfig,
          });
        }
      } catch (error) {
        //
      }
    },
  },
};
