<template>
  <div class="read-main-wrap" :class="isMobileClass ? 'mobile' : ''">
    <a-page-header @back="() => $router.go(-1)" :breadcrumb="{ routes }" />
    <div class="main-text-wrap">
      <ContentHead :book="selfBook" />
      <a-spin :spinning="loading">
        <Content :content="content" />
      </a-spin>
      <slot></slot>
      <a-back-top />
    </div>
  </div>
</template>

<script>
import { isMobile } from "@/plugins/utils";
import Content from "./content.vue";
import ContentHead from "./contentHead.vue";
export default {
  name: "booksContent",
  components: {
    Content,
    ContentHead,
  },
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
      return { ...this.bookInfo, chapterTitle: this.title };
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

    getTitle() {
      let str = this.selfBook.chapterTitle || "";
      if (str.includes(".")) {
        let valueList = str.split(".");
        let first = "第" + valueList[0] + "章";
        return first + " " + valueList[1];
      } else {
        return str;
      }
    },
  },
  methods: {},
};
</script>
<style scoped>
@import url("@/views/book/css/booksContent.css");
</style>
