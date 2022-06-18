<template>
  <div class="video-content" :class="isMobileClass ? 'mobile' : ''">
    <div class="search-title">
      <div class="search-btn-group">
        <a-input
          class="search-btn"
          enter-button="Search"
          placeholder="请输入小说或作者名称"
          :maxLength="50"
          v-model:value.trim="keywords"
          @keyup.enter.stop="search"
        >
        </a-input>
        <a-button type="primary" @click="search">全网搜</a-button>
      </div>
    </div>
    <div class="content-panle">
      <a-spin :spinning="refreshLoading">
        <videoList :dataList="movieList" />
      </a-spin>
    </div>
  </div>
</template>

<script>
import { isMobile } from "@/plugins/utils";
// 小说查询内容块
// 视频内容
import videoList from "@/views/video/modules/result.vue";

import { getDataList as movie_GetList } from "@/api/movieApi";

// 书籍详情
export default {
  name: "videoResult",
  components: { videoList },
  computed: {
    // 是否为移动端
    isMobileClass() {
      let isTrue = isMobile();
      return isTrue;
    },
  },
  data() {
    return {
      // 查询关键字
      keywords: "",

      // 查询遮罩框
      refreshLoading: false,

      // 视频结果
      videoList: [],

      // 电影
      movieList: [],
    };
  },
  // activated() {},
  mounted() {
    this.init();
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
      this.keywords && this.searchVideo();
    },
    // 返回首页
    goHome() {
      this.$router.push({
        path: "/",
        query: { keywords: this.keywords },
      });
    },
    // 查询视频内容
    searchVideo() {
      // 重新搜索
      this.movieList = [];
      const key = "vodeiResult@key" + this.keywords;
      const cacheResult = sessionStorage.getItem(key);
      if (cacheResult) {
        this.movieList = JSON.parse(cacheResult);
      } else {
        const params = {
          keywords: this.keywords,
        };
        // 打开遮罩
        this.refreshLoading = true;
        movie_GetList(params)
          .then((result) => {
            this.refreshLoading = false;
            this.movieList = result.data.data || [];
            this.movieList &&
              this.movieList.length > 0 &&
              sessionStorage.setItem(key, JSON.stringify(this.movieList));
          })
          .catch(() => {
            this.refreshLoading = false;
          });
      }
    },
  },
};
</script>

<style scoped>
@import url("@/views/video/css/videoList.css");

.result-content .search-btn-group .search-btn {
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
