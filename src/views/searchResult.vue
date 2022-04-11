<template>
  <div class="result-content">
    <div class="search-title">
      <div class="logo-bg" @click="goHome"></div>
      <div class="search-btn-group">
        <el-autocomplete
          placeholder="请输入小说名称"
          class="search-btn"
          v-model.trim="keywords"
          clearable
          @keyup.enter="searchBook(1)"
          :fetch-suggestions="querySearch"
        ></el-autocomplete>

        <el-button class="search-text-btn" @click="searchBook(1)"
          >全网搜小说</el-button
        >
      </div>
      <div class="search-right">
        <span class="setting-txt" @click="goHome">系统首页</span>
        <span class="setting-txt">设置</span>
      </div>
    </div>

    <div class="search-filter">
      <span class="filter-txt filter-active">
        <i class="el-icon-search"></i>
        小说</span
      >
    </div>
    <div class="search-content-panle" v-loading="refreshLoading">
      <div class="books-wrapper" ref="bookList">
        <ul class="wrapper">
          <li
            class="book-item"
            :style="{ minWidth: '360px' }"
            v-for="(book, bi) in searchResult"
            :key="bi"
            @click="toDetail(book)"
          >
            <div class="cover-img" @click.stop="toDetail(book)">
              <el-image
                class="cover"
                :src="getCover(book.coverUrl, true)"
                :key="book.coverUrl"
                fit="cover"
                lazy
              >
                <template #error>
                  <div class="image-slot">
                    <el-image :src="noImg"></el-image>
                  </div>
                </template>
              </el-image>
            </div>
            <div class="book-info">
              <div class="book-name ellipsis">
                {{ book.name }}
              </div>
              <div class="book-author ellipsis">
                {{ book.author || "" }}
              </div>
              <div class="book-content-details">
                <div class="sub">
                  <div class="dot" v-if="book.totalChapterNum">•</div>
                  <div class="size" v-if="book.totalChapterNum">
                    共{{ book.totalChapterNum }}章
                  </div>
                </div>
                <div class="dur-chapter" v-if="book.durChapterTitle">
                  已读：{{ book.durChapterTitle }}
                </div>

                <div
                  class="last-chapter ellipsis"
                  v-if="book.latestChapterTitle"
                >
                  {{
                    book.lastCheckTime
                      ? dateFormat(book.lastCheckTime)
                      : "最新"
                  }}：{{ book.latestChapterTitle }}
                </div>
              </div>
              <div class="book-bottom-btn">
                <el-tag
                  type="success"
                  :effect="isNight ? 'dark' : 'light'"
                  class="setting-connect"
                  @click.stop="saveBook(book)"
                >
                  <i class="el-icon-circle-plus-outline"></i> 加入收藏
                </el-tag>
              </div>
            </div>
          </li>
          <!-- <div
            class="title-btn"
            v-if="isSearchResult && loadingMore"
            @click="loadMore"
          >
            {{ "加载更多" }}
          </div> -->
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import noImage from "@/assets/imgs/noImage.png";

import { buildURL, getCover, dateFormat } from "@/plugins/utils.js";
// 书籍详情
export default {
  name: "searchResult",
  data() {
    return {
      // 查询关键字
      keywords: "",

      // 页数
      searchPage: 1,
      //最后一次查询的页数
      searchLastIndex: -1,

      // 是否展示加载更多
      loadingMore: false,

      // 查询遮罩框
      refreshLoading: false,

      // 查询结果
      searchResult: [],

      // 书籍详情
      BookDetailsInfo: {},
      showBookDetailsDialog: false,
    };
  },
  activated() {
    if (this.keywords === this.$route.query.keywords) {
      return false;
    }
    this.keywords = this.$route.query.keywords ?? "";
    if (this.keywords) {
      this.searchBook(1);
    }
  },
  deactivated() {},
  computed: {
    isNight() {
      return this.$store.getters.isNight;
    },
    cacheBookList() {
      return this.$store.state.caches.readBooksList;
    },
    searchConfig() {
      return this.$store.state.searchConfig;
    },
    // 用于过滤 重复的数据
    searchResultMap() {
      return this.searchResult.reduce((c, v) => {
        c[v.bookUrl] = v;
        return c;
      }, {});
    },
    historyList() {
      let list = this.$store.state.caches.searchHistoryList;
      let newList = [];

      list.forEach((d) => {
        newList.push({ value: d, address: d });
      });
      return newList;
    },
    noImg() {
      return noImage;
    },
  },
  // mounted() {
  //   this.keywords = this.$route.query.keywords ?? "";
  //   if (this.keywords) {
  //     this.searchBook(1);
  //   }
  // },
  watch: {
    // 查询模式监听
    searchConfig: {
      handler(val) {
        this.$store.commit("setSearchConfig", val);
        this.searchBook(1);
      },
      deep: true,
    },
  },
  methods: {
    getCover(coverUrl, normal) {
      return getCover(coverUrl, normal);
    },
    dateFormat(t) {
      return dateFormat(t);
    },
    // 输入框 历史记录
    querySearch(queryString, cb) {
      var historyList = this.historyList;
      var lowerQuery = queryString.toLowerCase();

      var results = queryString
        ? historyList.filter((d) => {
            let value = d.value.toLowerCase();
            return value === lowerQuery || value.indexOf(lowerQuery) != -1;
          })
        : historyList;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    goHome() {
      this.$router.push({
        path: "/",
        query: { keywords: this.keywords },
      });
    },
    // 书籍详情
    toDetail(book) {
      if (!book.bookUrl) {
        return;
      }
      // 加入书源 缓存
      this.$store.commit("caches/setReadBooks", book);
      // 当前正在阅读的书籍
      this.$store.commit("caches/setReadingBook", book);

      this.$router.push({ path: "/readBooks", query: { search: 1 } });
    },
    // 查询
    searchBook(page) {
      if (!this.keywords) {
        this.$message.error("请输入关键词进行搜索");
        return;
      }

      this.searchPage = page;
      if (page === 1) {
        // 重新搜索
        this.searchLastIndex = -1;
        this.searchResult = [];
      }

      if (
        this.searchConfig.searchType === "single" &&
        !this.searchConfig.bookSourceUrl
      ) {
        return;
      }

      // 防止重复查询
      if (this.loadingMore) {
        return;
      }
      // 缓存当前的查询记录
      this.$store.commit("caches/setSearchHistory", this.keywords);
      // 多源查询
      if (this.searchConfig.searchType === "multi" && window.EventSource) {
        this.searchMore(page);
      } else {
        // 单源查询
        this.searchSingleData(page);
      }
    },
    // 查询单源
    searchSingleData(page) {
      this.loadingMore = true;
      this.refreshLoading = true;

      const params = {
        key: this.keywords,
        bookSourceUrl: this.searchConfig.bookSourceUrl,
        bookSourceGroup: this.searchConfig.bookSourceGroup,
        concurrentCount: this.searchConfig.concurrentCount,
        lastIndex: this.searchLastIndex, // 多源搜索时的索引
        page: page, // 单源搜索时的page
      };
      this.axios
        .get(
          this.$store.state.api +
            (this.searchConfig.searchType === "single"
              ? "/searchBook"
              : "/searchBookMulti"),
          {
            timeout: this.searchConfig.searchType === "single" ? 30000 : 180000,
            params,
          }
        )
        .then(
          (res) => {
            this.loadingMore = false;
            this.refreshLoading = false;
            if (res.data.isSuccess) {
              let resultList = [];
              if (this.searchConfig.searchType === "single") {
                resultList = res.data.data;
              } else {
                this.searchLastIndex = res.data.data.lastIndex;
                resultList = res.data.data.list;
              }
              var data = [].concat(this.searchResult);
              var length = data.length;
              resultList.forEach((v) => {
                if (!this.searchResultMap[v.bookUrl]) {
                  data.push(v);
                }
              });
              this.searchResult = data;
              if (data.length === length) {
                this.$message.error("没有更多啦");
              }
            }
          },
          (error) => {
            this.$message.error("搜索书籍失败 " + (error && error.toString()));
          }
        );
    },
    // 查询多源
    searchMore(page) {
      const params = {
        accessToken: this.$store.state.token,
        key: this.keywords,
        bookSourceUrl: this.searchConfig.bookSourceUrl,
        bookSourceGroup: this.searchConfig.bookSourceGroup,
        concurrentCount: this.searchConfig.concurrentCount,
        lastIndex: this.searchLastIndex, // 多源搜索时的索引
        page: page, // 单源搜索时的page
      };

      this.loadingMore = true;
      this.refreshLoading = true;
      const url = buildURL(
        this.$store.state.api + "/searchBookMultiSSE",
        params
      );

      this.searchEventSource = new EventSource(url, {
        withCredentials: true,
      });

      // websocket 请求
      this.searchEventSource.addEventListener("error", (e) => {
        this.loadingMore = false;
        this.refreshLoading = false;
        this.searchEventSource.close();
        if (e.data) {
          const result = JSON.parse(e.data);
          if (result && result.errorMsg) {
            this.$message.error(result.errorMsg);
          }
        }
      });
      this.searchEventSource.addEventListener("end", (e) => {
        this.loadingMore = false;
        this.refreshLoading = false;
        this.searchEventSource.close();
        if (e.data) {
          const result = JSON.parse(e.data);
          if (result && result.lastIndex) {
            this.searchLastIndex = result.lastIndex;
          }
        }
      });
      this.searchEventSource.addEventListener("message", (e) => {
        if (e.data) {
          this.loadingMore = false;
          this.refreshLoading = false;
          const result = JSON.parse(e.data);
          if (result && result.lastIndex) {
            this.searchLastIndex = result.lastIndex;
          }
          if (result.data) {
            var data = [].concat(this.searchResult);
            result.data.forEach((v) => {
              if (!this.searchResultMap[v.bookUrl]) {
                data.push(v);
              }
            });
            this.searchResult = data;
          }
        }
      });
    },
    // 查看书籍详情
    showDetails(book) {
      this.BookDetailsInfo = book;
      this.showBookDetailsDialog = true;
    },
    closeDetails() {
      // this.showBookDetailsDialog = false;
    },
  },
};
</script>

<style scoped>
@import url("@/assets/css/base.css");
@import url("@/assets/css/searchResult.css");

:deep(.el-input__inner) {
  border: 2px solid #c4c7ce;
  border-radius: 10px 0 0 10px;
  border-right: 0;
  height: 100%;
  width: 100%;
  color: #404246;
  padding-inline-end: 44px;
  padding-inline-start: 16px;
  position: relative;
  font-size: 16px;
  caret-color: #404246;
}

:deep(.el-input__inner::placeholder) {
  color: #626770;
}

:deep(.el-input__icon),
:deep(.el-input__clear:hover) {
  font-size: 19px;
}
</style>
