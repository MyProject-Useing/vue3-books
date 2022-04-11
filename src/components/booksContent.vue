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
              <p>
                <span class="content-wrap">{{ content }}</span>
              </p>
              <p>
                <span class="content-wrap">“雪花飘飘北风萧萧”</span>
              </p>
              <p>
                <span class="content-wrap">“天地一片苍茫”</span>
              </p>
              <p>
                <span class="content-wrap">“一剪寒梅傲立雪中”</span>
              </p>
              <p>
                <span class="content-wrap"
                  >昼夜颠倒更是家常便饭，灵感来了大半夜爬起来敲键盘。</span
                >
              </p>
              <p>
                <span class="content-wrap"
                  >由于常年码字，生活作息不规律，熬夜，久坐不运动，吃油炸食品……每个月靠着六百块全勤吃饭，有一顿没一顿的情况下，终于倒在了键盘上。</span
                >
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
        <dd data-eid="qd_R42">
          <a href="javascript:">
            <el-icon><grid /></el-icon>
            <span>目录</span>
          </a>
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
  },
  methods: {},
};
</script>
<style scoped>
@import url("@/assets/css/base.css");
@import url("@/assets/css/booksContent.css");
</style>
