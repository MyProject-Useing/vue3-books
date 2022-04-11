<template>
  <div class="read-panle">
    <div class="main-read-container">
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
                      {{
                        (selfBook.wordCount || "0").replace("字", "")
                      }}字</span
                    >
                  </a>

                  <!-- <i
                    ><em class="iconfont"></em><span>2022.01.13 12:58</span></i
                  > -->
                </div>
              </div>
            </div>
            <div class="read-content">
              <p v-for="(item, index) in contentList" :key="index">
                <span class="content-wrap" v-html="item"></span>
              </p>
            </div>
          </div>
        </div>
        <div class="chapter-control dib-wrap">
          <a id="j_chapterPrev">上一章</a><span>|</span>
          <a target="_blank">目录</a><span>|</span>
          <a id="j_chapterNext">下一章</a>
        </div>
      </div>
    </div>
    <div class="left-bar-list">
      <dl>
        <dd>
          <el-popover
            placement="right"
            :width="800"
            trigger="click"
            class="setting-popover"
          >
            <template #reference>
              <a href="javascript:">
                <el-icon><grid /></el-icon>
                <span>目录</span>
              </a>
            </template>
            <div class="catalog-list">
              <div class="catalog-list-title"></div>
              <div class="catalog-tab dib-wrap">
                <span class="lang act">目录</span>
              </div>
              <div class="catalog-list-wrap">
                <div class="volume-list">
                  <ul>
                    <li v-for="(item, index) in catalogList" :key="item.index">
                      <a :class="selfBook.index === index + 1 ? 'on' : ''">{{
                        item.title
                      }}</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </el-popover>
        </dd>
        <dd class="">
          <a href="javascript:">
            <el-icon><tools /></el-icon>
            <span>设置</span></a
          >
        </dd>
        <dd>
          <a class="add-book" href="javascript:">
            <el-icon><collection-tag /></el-icon><span>书架</span></a
          >
        </dd>
      </dl>
    </div>
  </div>
</template>

<script>
import {
  CollectionTag,
  Grid,
  Tools,
  Avatar,
  Management,
  TrendCharts,
} from "@element-plus/icons";
export default {
  name: "booksContent",
  components: { CollectionTag, Grid, Tools, Avatar, Management, TrendCharts },
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
  },
  beforeMount() {
    this;
  },
  computed: {
    selfBook() {
      return this.bookInfo;
    },
    // 目录
    catalogList() {
      return this.selfBook.catalog;
    },
    contentList() {
      return this.content.replace(/&nbsp;/g, "").split("\n");
    },
  },
  methods: {},
};
</script>
<style scoped>
@import url("@/assets/css/base.css");
@import url("@/assets/css/booksContent.css");
</style>
<style>
.setting-popover {
  left: -11px;
}
</style>
