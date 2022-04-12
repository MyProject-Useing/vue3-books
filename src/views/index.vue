<template>
  <div class="search-content">
    <div class="logo">
      <div id="logo" class="logo-bg"></div>
    </div>
    <div class="search-btn-group">
      <el-autocomplete
        placeholder="请输入小说名称"
        class="search-btn"
        prefix-icon="el-icon-search"
        v-model.trim="keywords"
        clearable
        @keyup.enter="searchDetails()"
        :fetch-suggestions="querySearch"
      ></el-autocomplete>
    </div>

    <div class="search-collet">
      <a
        v-for="(item, index) in cacheBookList"
        :key="index"
        @click="toDetail(item)"
        @mouseover="item.isActive = true"
        @mouseout="item.isActive = false"
      >
        <el-icon
          v-show="item.isActive"
          class="delete-books"
          @click.stop="deleteBook(item)"
          ><delete
        /></el-icon>

        <div class="tile-icon">
          <el-image
            class="cover"
            :src="getCover(item.coverUrl, true)"
            :key="item.coverUrl"
            fit="cover"
          >
            <template #error>
              <div class="image-slot">
                <el-image :src="noImg"></el-image>
              </div>
            </template>
          </el-image>
        </div>
        <div class="tile-title">
          <span class="ellipsis" :title="item.name || item.bookName">
            {{ item.name || item.bookName }}</span
          >
        </div>
      </a>
    </div>
  </div>
</template>

<script>
import noImage from "@/assets/imgs/noImage.png";
import { getCover } from "@/plugins/utils.js";
import { Delete } from "@element-plus/icons";

export default {
  name: "homeIndex",
  data() {
    return { keywords: "" };
  },
  components: { Delete },
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
        newList.push({ value: d, address: d });
      });
      return newList;
    },
  },
  mounted() {
    this.keywords = this.$route.query.keywords ?? "";
  },
  methods: {
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
    toDetail(book) {
      // 当前正在阅读的书籍
      this.$store.commit("caches/setReadingBook", book);
      this.$router.push({ path: "/readBooks", query: { search: 1 } });
    },
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
@import url("@/assets/css/base.css");
@import url("@/assets/css/homeIndex.css");

:deep(.el-input__inner) {
  border-radius: 22px;
  height: 100%;
  width: 100%;
  border: none;
  box-shadow: 0 1px 6px 0 rgb(32 33 36 / 28%);
  color: #404246;
  padding-inline-end: 44px;
  padding-inline-start: 52px;
  position: relative;
  font-size: 16px;
  caret-color: #404246;
}

:deep(.el-input__inner::placeholder) {
  color: #626770;
}

:deep(.el-input__prefix) {
  width: 40px;
  color: #404246;
  line-height: 45px;
  font-size: 16px;
}
</style>
