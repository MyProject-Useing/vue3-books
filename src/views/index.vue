<template>
  <div class="home-content">
    <div class="logo">
      <div id="logo" class="logo-bg"></div>
    </div>
    <div class="search-btn-group">
      <a-auto-complete
        placeholder="请输入小说或作者名称"
        class="search-btn"
        v-model:value.trim="keywords"
        @keyup.enter="searchDetails"
        @search="searchDetails"
        :options="historyList"
        :filter-option="filterOption"
      >
        <a-input-search size="large" enter-button></a-input-search>
      </a-auto-complete>
    </div>

    <div class="search-collet">
      <a
        v-for="(item, index) in cacheBookList"
        :key="index"
        @click="toDetail(item)"
        @mouseover="item.isActive = true"
        @mouseout="item.isActive = false"
      >
        <span
          v-show="item.isActive"
          class="delete-books"
          @click.stop="deleteBook(item)"
        >
          <DeleteOutlined />
        </span>
        <div class="tile-icon">
          <a-image
            class="cover"
            :src="getCover(item.coverUrl, true)"
            :key="item.coverUrl"
            fit="cover"
          >
            <template #error>
              <a-image :src="noImg"></a-image>
            </template>
          </a-image>
        </div>
        <div class="tile-title">
          <span class="ellipsis" :title="item.name"> {{ item.name }}</span>
        </div>
      </a>
    </div>
  </div>
</template>

<script>
import noImage from "@/assets/imgs/noImage.png";
import { getCover } from "@/plugins/utils.js";
import { DeleteOutlined } from "@ant-design/icons-vue";

export default {
  name: "homeIndex",
  data() {
    return { keywords: "" };
  },
  components: { DeleteOutlined },
  computed: {
    noImg() {
      return noImage;
    },
    cacheBookList() {
      return this.$store.state.caches.readBooksList;
    },
    historyList() {
      let list = this.$store.state.caches.searchHistoryList;
      let newList = [];

      list.forEach((d) => {
        newList.push({ value: d });
      });
      return newList;
    },
  },
  mounted() {
    this.keywords = this.$route.query.keywords ?? "";
  },
  methods: {
    filterOption(input, option) {
      return option.value.toUpperCase().indexOf(input.toUpperCase()) >= 0;
    },
    // 直接阅读缓存的书籍
    toDetail(book) {
      // 当前正在阅读的书籍
      this.$store.commit("caches/setReadingBook", book);
      this.$router.push({
        path: "/readBooks",
        query: { search: book.readIndex || 0 },
      });
    },
    // 跳转查询详情页面
    searchDetails() {
      this.$router.push({
        path: "/searchResult",
        query: { keywords: this.keywords },
      });
    },
    getCover(coverUrl, normal) {
      return getCover(coverUrl, normal);
    },
    deleteBook(book) {
      // 删除当前书籍
      this.$store.commit("caches/deleteReadBooks", book);
    },
  },
};
</script>

<style scoped>
@import url("@/assets/css/homeIndex.css");

.search-btn-group :deep(.ant-select-selector) {
  height: 100%;
  width: 100%;
}

:deep(.ant-select-selection-search-input::placeholder) {
  color: #626770;
}

:deep(.el-input__prefix) {
  width: 40px;
  color: #404246;
  line-height: 45px;
  font-size: 16px;
}
</style>
