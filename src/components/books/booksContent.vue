<template>
  <div class="read-main-wrap">
    <div class="text-wrap">
      <div class="main-text-wrap">
        <div class="text-head">
          <h3>
            <span class="content-wrap">{{ title }}</span>
          </h3>
          <div class="text-info cf">
            <div class="info fl">
              <a>
                <el-icon><management /></el-icon>
                <span> {{ selfBook.name }}</span></a
              >
              <a
                ><el-icon><avatar /></el-icon>
                <span> {{ selfBook.author }}</span>
              </a>
              <a
                ><el-icon :size="17"><trend-charts /></el-icon>
                <span>
                  {{ (selfBook.wordCount || "0").replace("字", "") }}字</span
                >
              </a>

              <!-- <i
                    ><em class="iconfont"></em><span>2022.01.13 12:58</span></i
                  > -->
            </div>
          </div>
        </div>
        <div class="read-content" v-loading="loading">
          <p v-for="(item, index) in contentList" :key="index">
            <span class="content-wrap" v-html="item"></span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Avatar, Management, TrendCharts } from "@element-plus/icons";
export default {
  name: "booksContent",
  components: { Avatar, Management, TrendCharts },
  data() {
    return {};
  },
  props: {
    bookInfo: {
      type: Object,
      default() {
        return {};
      },
    },
    content: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "",
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    content(val, oldVal) {
      if (val !== oldVal) {
        return val;
      }
    },
  },
  computed: {
    selfBook() {
      return this.bookInfo;
    },
    contentList() {
      return this.content.replace(/&nbsp;/g, "").split("\n");
    },
  },
  methods: {
    changeCatalog() {},
  },
};
</script>
<style scoped>
@import url("@/assets/css/base.css");
@import url("@/assets/css/booksContent.css");
</style>
<style></style>
