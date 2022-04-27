<template>
  <div class="result-content" :class="isMobileClass ? 'mobile' : ''">
    <div class="search-title">
      <div class="logo-bg" @click="goHome"></div>
      <div class="search-btn-group">
        <a-auto-complete
          class="search-btn"
          enter-button="Search"
          placeholder="请输入小说或作者名称"
          v-model:value.trim="keywords"
          :options="historyList"
          :filter-option="filterOption"
          @keyup.enter.stop="searchBook()"
        >
        </a-auto-complete>
        <a-button type="primary" @click="searchBook()">全网搜</a-button>
      </div>
      <div class="search-right">
        <span class="setting-txt" @click="goHome">系统首页</span>
        <span class="setting-txt">设置</span>
      </div>
    </div>

    <div class="search-filter">
      <span class="filter-txt filter-active">
        <i class="a-icon-search"></i>
        小说</span
      >
    </div>
    <div class="search-content-panle">
      <div class="books-wrapper">
        <a-spin :spinning="refreshLoading">
          <ul class="wrapper">
            <li class="book-item" v-for="(book, bi) in searchResult" :key="bi">
              <div class="cover-img">
                <a-image
                  class="cover"
                  :src="getCover(book.coverUrl, true)"
                  fallback="data:image/png;base64,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"
                >
                </a-image>
              </div>
              <div class="book-info">
                <div
                  class="book-name ellipsis"
                  :title="book.title"
                  @click.stop="toDetail(book)"
                >
                  {{ book.title }}
                </div>
                <div class="book-content-details">
                  <!-- <div class="sub">
                    <div class="dot" v-if="book.totalChapterNum">•</div>
                    <div class="size" v-if="book.totalChapterNum">
                      共{{ book.totalChapterNum }}章
                    </div>
                  </div> -->
                  <!-- <div class="dur-chapter" v-if="book.durChapterTitle">
                    已读：{{ book.durChapterTitle }}
                  </div> -->

                  <div class="last-chapter ellipsis" v-if="book.newest">
                    最新章节：{{ book.newest }}
                  </div>
                  <div class="last-chapter ellipsis" v-if="book.newest">
                    更新时间：{{ dateFormat(book.lastTime) }}
                  </div>
                </div>
                <div class="book-author ellipsis" :title="book.author">
                  <UserOutlined /> {{ book.author || "" }}
                </div>
                <!-- <div class="book-bottom-btn" @click.stop="() => {}">
                <a-tag
                  v-if="isCollect(book)"
                  type="success"
                  effect="light"
                  class="setting-connect"
                >
                  <i class="el-icon-check"></i> 已收藏
                </a-tag>
                <a-tag
                  v-else
                  type="success"
                  effect="light"
                  class="setting-connect"
                  @click.stop="saveBook(book)"
                >
                  <i class="el-icon-circle-plus-outline"></i> 加入收藏
                </a-tag>
              </div> -->
              </div>
            </li>
          </ul>
        </a-spin>
      </div>
    </div>
  </div>
</template>

<script>
import { UserOutlined } from "@ant-design/icons-vue";
import { buildURL, getCover, dateFormat } from "@/plugins/utils.js";

import { isMobile } from "@/plugins/utils";
import request from "@/plugins/axios";
// 书籍详情
export default {
  name: "searchResult",
  components: { UserOutlined },
  data() {
    return {
      // 查询关键字
      keywords: "",

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
      this.searchBook();
    }
  },
  computed: {
    // 是否为移动端
    isMobileClass() {
      return isMobile();
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
  },
  watch: {
    // 查询模式监听
    searchConfig: {
      handler(val) {
        this.$store.commit("setSearchConfig", val);
        this.searchBook();
      },
      deep: true,
    },
  },
  methods: {
    filterOption(input, option) {
      return option.value.toUpperCase().indexOf(input.toUpperCase()) >= 0;
    },
    isCollect(book) {
      let filData = this.cacheBookList.filter(
        (d) =>
          d.author === book.author &&
          d.name === book.name &&
          d.origin === book.origin
      )[0];
      return filData ? true : false;
    },
    getCover(coverUrl, normal) {
      return getCover(coverUrl, normal);
    },
    dateFormat(t) {
      return dateFormat(t);
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
      this.$store.commit("caches/setBooksList", book);
      // 当前正在阅读的书籍
      this.$store.commit("caches/setReadingBook", book);

      this.$router.push({ path: "/readBooks", query: { search: 1 } });
    },
    // 查询
    searchBook() {
      if (!this.keywords) {
        this.$message.error("请输入关键词进行搜索");
        return;
      }

      // 重新搜索
      this.searchResult = [];

      // 防止重复查询
      if (this.loadingMore) {
        return;
      }
      // 缓存查询记录
      this.$store.commit("caches/setSearchHistory", this.keywords);

      this.searchList();
    },

    // 查询数据
    searchList() {
      this.loadingMore = true;
      this.refreshLoading = true;
      const params = {
        keywords: this.keywords,
      };
      request
        .post(this.$store.state.api + "api/common/postSearch", params)
        .then((result) => {
          this.loadingMore = false;
          this.refreshLoading = false;
          if (result.data.data) {
            var data = [];
            result.data.data.forEach((v) => {
              if (!this.searchResultMap[v.bookUrl]) {
                data.push(v);
              }
            });
            this.searchResult = data;
          }
        })
        .catch(() => {
          this.loadingMore = false;
          this.refreshLoading = false;
        });
    },

    // 加入收藏
    saveBook(book) {
      // 加入书源 缓存
      this.$store.commit("caches/setBooksList", book);
      this.$message.success("收藏成功。");
    },
  },
};
</script>

<style scoped>
@import url("@/assets/css/searchResult.css");

.result-content .search-btn-group :deep(.ant-select-selector) {
  height: 100%;
  width: 100%;
  border: 2px solid #4569ff;
  border-radius: 10px 0 0 10px;
  border-right: 0;
  color: #404246;
}

.result-content .search-btn-group :deep(.ant-select-selection-placeholder) {
  line-height: 36px;
  padding-left: 13px;
  color: rgb(117, 117, 117);
  font-size: 15px;
}

.result-content .search-btn-group button.ant-btn {
  border-radius: 0 10px 10px 0;
  height: 100%;
  background: #4e6ef2;
  color: #fff;
}
</style>
<style>
.result-content
  .ant-select.ant-select-auto-complete
  .ant-select-selector
  .ant-select-selection-search
  .ant-select-selection-search-input {
  padding-left: 8px;
}
</style>
