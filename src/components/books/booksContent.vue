<template>
  <div class="read-main-wrap" :class="isMobileClass ? 'mobile' : ''">
    <a-page-header @back="() => $router.go(-1)" :breadcrumb="{ routes }" />
    <div class="text-wrap">
      <div class="main-text-wrap">
        <div class="text-head">
          <h3>
            <span class="content-wrap">{{ getTitle }}</span>
          </h3>
          <div class="text-info">
            <div class="info fl">
              <a>
                <database-outlined title="书名" />
                <span> {{ selfBook.bookTitle }}</span></a
              >
              <a
                ><solution-outlined title="作者" />
                <span> {{ selfBook.author }}</span>
              </a>
              <a>
                <ReadOutlined title="字数" />
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

        <a-spin :spinning="loading">
          <div class="read-content" element-loading-text="内容加载中...">
            <p v-for="(item, index) in contentList" :key="index">
              <span class="content-wrap" v-html="item"></span>
            </p>
          </div>
        </a-spin>
        <slot></slot>
        <a-back-top />
      </div>
    </div>
  </div>
</template>

<script>
import { isMobile } from "@/plugins/utils";
import {
  DatabaseOutlined,
  ReadOutlined,
  SolutionOutlined,
} from "@ant-design/icons-vue";

export default {
  name: "booksContent",
  components: { DatabaseOutlined, ReadOutlined, SolutionOutlined },
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
    routes() {
      let bookUrl = this.selfBook.bookUrl;
      let bookTitle = this.selfBook.bookTitle;
      return [
        {
          path: "/",
          breadcrumbName: "首页",
        },
        {
          path: "/book?bookUrl=" + bookUrl,
          breadcrumbName: bookTitle,
        },
        {
          path: "second",
          breadcrumbName: this.getTitle,
        },
      ];
    },
    // 是否为移动端
    isMobileClass() {
      let isTrue = isMobile();
      return isTrue;
    },

    contentList() {
      return this.content.replace(/&nbsp;/g, "").split("\n");
    },
    getTitle() {
      let str = this.title || "";
      if (str.includes(".")) {
        let valueList = str.split(".");
        let first = "第" + valueList[0] + "章";
        return first + " " + valueList[1];
      } else {
        return str;
      }
    },
  },
  methods: {
    getSvg() {
      return `
      <path class="path" d="
          M 30 15
          L 28 17
          M 25.61 25.61
          A 15 15, 0, 0, 1, 15 30
          A 15 15, 0, 1, 1, 27.99 7.5
          L 15 15
        " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/>`;
    },
  },
};
</script>
<style scoped>
@import url("@/assets/css/booksContent.css");
</style>
