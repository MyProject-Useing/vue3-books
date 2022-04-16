<template>
  <div class="read-main-wrap">
    <div class="text-wrap">
      <div class="main-text-wrap">
        <div class="text-head">
          <h3>
            <span class="content-wrap">{{ getTitle }}</span>
          </h3>
          <div class="text-info cf">
            <div class="info fl">
              <a>
                <ReadOutlined />
                <span> {{ selfBook.name }}</span></a
              >
              <a
                ><UserOutlined />
                <span> {{ selfBook.author }}</span>
              </a>
              <a
                ><UserOutlined />
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

        <a-back-top />
      </div>
    </div>
  </div>
</template>

<script>
import { UserOutlined, ReadOutlined } from "@ant-design/icons-vue";

export default {
  name: "booksContent",
  components: { UserOutlined, ReadOutlined },
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
@import url("@/assets/css/base.css");
@import url("@/assets/css/booksContent.css");
</style>
<style></style>
