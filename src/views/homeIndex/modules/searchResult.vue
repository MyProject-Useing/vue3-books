<template>
  <div class="result-content" :class="isMobileClass ? 'mobile' : ''">
    <div class="search-title">
      <div class="logo-bg" @click="goHome" title="首页"></div>
      <div class="search-btn-group">
        <a-auto-complete
          class="search-btn"
          enter-button="Search"
          placeholder="请输入小说或作者名称"
          v-model:value.trim="keywords"
          @keyup.enter.stop="search"
        >
        </a-auto-complete>
        <a-button type="primary" @click="search">全网搜</a-button>
      </div>
      <div class="search-right">
        <span class="setting-txt" @click="goHome">系统首页</span>
        <span class="setting-txt">设置</span>
      </div>
    </div>
    <div class="content-panle">
      <a-spin :spinning="refreshLoading">
        <a-tabs v-model:activeKey="activeKey" class="search-filter">
          <a-tab-pane key="book">
            <template #tab>
              <span class="filter-txt filter-active">
                <search-outlined />
                小说</span
              >
            </template>
            <bookResult :dataList="bookList" />
          </a-tab-pane>
          <a-tab-pane key="video">
            <template #tab>
              <span class="filter-txt filter-active">
                <search-outlined />
                视频</span
              >
            </template>
            <videoResult :dataList="videoList" />
          </a-tab-pane>
        </a-tabs>
      </a-spin>
    </div>
  </div>
</template>

<script>
import { SearchOutlined } from "@ant-design/icons-vue";
import { isMobile } from "@/plugins/utils";

// 小说查询内容块
import bookResult from "@/views/book/modules/result.vue";
// 视频内容
import videoResult from "@/views/video/modules/result.vue";

import request from "@/plugins/request";
// 书籍详情
export default {
  name: "searchResult",
  components: { SearchOutlined, bookResult, videoResult },
  data() {
    return {
      // 查询关键字
      keywords: "",

      // 内容类别
      activeKey: "book",

      // 查询遮罩框
      refreshLoading: false,

      // 书籍结果
      bookList: [],

      // 视频结果
      videoList: [],

      // 查询结果
      searchResult: [],
    };
  },
  activated() {
    this.init();
  },
  computed: {
    // 是否为移动端
    isMobileClass() {
      let isTrue = isMobile();
      return isTrue;
    },
    // 用于过滤 重复的数据
    searchResultMap() {
      return this.searchResult.reduce((c, v) => {
        c[v.bookUrl] = v;
        return c;
      }, {});
    },
  },
  watch: {
    $route(to) {
      if (to.name === "searchResult") {
        this.init();
      }
    },
  },
  methods: {
    init() {
      if (this.keywords === this.$route.query.keywords) {
        return false;
      }
      this.keywords = this.$route.query.keywords;

      this.search();
    },

    // 通用查询 --分配查询 书籍还是视频
    search() {
      if (this.keywords) {
        this.activeKey === "book" ? this.searchBook() : this.searchVideo();
      }
    },

    // 过滤重复项
    filterOption(input, option) {
      return option.value.toUpperCase().indexOf(input.toUpperCase()) >= 0;
    },

    // 返回首页
    goHome() {
      this.$router.push({
        path: "/",
        query: { keywords: this.keywords },
      });
    },

    // 查询视频内容
    searchVideo() {},

    // 查询书籍信息
    searchBook() {
      // 重新搜索
      this.bookList = [];
      // 缓存查询记录
      this.$store.commit("caches/setSearchHistory", this.keywords);
      // 打开遮罩
      this.refreshLoading = true;

      const params = {
        keywords: this.keywords,
      };
      request
        .post(this.$store.state.api + "api/common/searchBooksList", params)
        .then((result) => {
          this.refreshLoading = false;
          if (result.data.data) {
            var data = [];
            result.data.data.forEach((v) => {
              if (!this.searchResultMap[v.bookUrl]) {
                data.push(v);
              }
            });
            this.bookList = data;
          }
        })
        .catch(() => {
          this.refreshLoading = false;
        });
    },
  },
};
</script>

<style scoped>
@import url("@/views/homeIndex/css/searchResult.css");

.result-content .search-btn-group :deep(.ant-select-selector) {
  height: 100%;
  border: 2px solid #4569ff;
  border-radius: 10px 0 0 10px;
  border-right: 0;
  color: #404246;
}

.result-content .search-btn-group :deep(.ant-select-selection-placeholder) {
  line-height: 2.6em;
  padding-left: 13px;
  color: rgb(117, 117, 117);
  font-size: 1em;
}

.result-content .search-btn-group button.ant-btn {
  border-radius: 0 10px 10px 0;
  height: 100%;
  background: #4e6ef2;
  color: #fff;
  width: 98px;
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
