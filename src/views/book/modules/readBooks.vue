<template>
  <div class="reader-content" :class="isMobileClass ? 'mobile' : ''">
    <div class="main-read-container">
      <booksContent
        class="book-content"
        :loading="bookLoading"
        :bookInfo="bookInfo"
        :title="bookTitle"
        :content="bookContent"
        ref="bookContentRef"
      >
      </booksContent>
      <leftBar
        v-if="!isMobileClass"
        :catalogList="catalogList"
        :selfCatalog="selfCatalog"
      ></leftBar>
      <div
        class="chapter-control dib-wrap"
        v-show="!bookLoading && !isMobileClass"
      >
        <a
          @click="
            catalogList.length == 0 || bookLoading
              ? false
              : toNextChapter(false)
          "
          :class="firstClass"
          >上一章</a
        >
        <span>|</span>
        <a
          id="catalog_curr"
          href="javascript:"
          :class="catalogClass"
          @click.stop="catalogList.length > 0 ? showCatalog() : false"
          >目录</a
        >
        <span>|</span>
        <a
          :class="nextClass"
          @click="
            catalogList.length == 0 || bookLoading ? false : toNextChapter(true)
          "
          >下一章</a
        >
      </div>
    </div>
  </div>
</template>
<script>
import { isMobile } from "@/plugins/utils";
import { message } from "ant-design-vue";

import jump from "@/plugins/jump";
import request from "@/plugins/request";

// 文章
import booksContent from "./booksContent.vue";
// 工具栏
import leftBar from "@/views/book/modules/leftBar.vue";

// 书籍详情
export default {
  name: "readBooks",
  components: {
    booksContent,
    leftBar,
  },
  data() {
    return {
      // 章节目录
      bookTitle: "",
      // 正文内容
      bookContent: "",
      // 内容遮罩框
      bookLoading: true,

      // 正文样式
      contentStyle: {},

      // 保存阅读点
      startSavePosition: false,

      // 动画效果
      transformX: 0,
      transforming: false,

      // 是否展示菜单栏
      showReadBar: false,
      // 展示工具栏
      showToolBar: true,

      // 目录弹出框
      catalogPopover: false,

      // 目录
      catalogList: [],

      // 书架弹出框
      bookShelfPopover: false,

      bookInfo: {},

      selfCatalog: {},
    };
  },
  mounted() {
    this.init();

    window.onkeydown = (e) => {
      if (!this.bookLoading && this.catalogList.length > 0) {
        // 右键翻页
        if (e.keyCode === 39) {
          this.toNextChapter(true);
        }
        // 左键翻页
        else if (e.keyCode === 37) {
          this.toNextChapter(false);
        }
      }
    };
  },
  computed: {
    // 是否为移动端
    isMobileClass() {
      let isTrue = isMobile();
      return isTrue;
    },
    // 窗口高度
    windowSize() {
      return this.$store.state.windowSize;
    },

    // 目录是否禁用
    catalogClass() {
      return this.bookLoading ||
        (this.catalogList && this.catalogList.length == 0)
        ? "disabled"
        : "";
    },

    // 上一章
    firstClass() {
      if (
        this.bookLoading ||
        this.selfCatalog.index === 1 ||
        (this.catalogList && this.catalogList.length == 0)
      ) {
        return "disabled";
      }
      return "";
    },
    // 下一章
    nextClass() {
      if (
        this.catalogList.length == 0 ||
        this.bookLoading ||
        this.selfCatalog.index === this.catalogList.length
      ) {
        return "disabled";
      }
      return "";
    },
    // 书籍地址
    bookUrl() {
      return unescape(this.$route.query.bookUrl || "");
    },
  },
  watch: {
    $route(to) {
      if (to.name === "readBooks") {
        this.init();
      }
    },
  },
  methods: {
    init() {
      if (this.bookUrl) {
        this.getCatalog();
      } else {
        message.error("请重新选择书籍。");
      }
    },
    // 展示目录
    showCatalog() {
      this.catalogPopover = true;
      // 隐藏 书架
      this.bookShelfPopover = false;
    },

    // 上/下一章
    toNextChapter(isNext) {
      let index = this.selfCatalog.index || 1;
      isNext ? index++ : index--;
      this.toChapter(index);
    },

    // 查询指定章节内容
    toChapter(index) {
      if (!this.catalogList || this.catalogList.length === 0) {
        message.error("章节错误，请返回首页。");
        return;
      }
      if (index >= this.catalogList.length + 1) {
        message.error("已是最后一章。");
        return;
      } else if (index < 1) {
        message.error("已是第一章。");
        return;
      }

      let selfBooks =
        this.catalogList.filter((d) => d.index === index)[0] || {};

      // 查询指定章节内容
      this.$router.push({
        path: "/readBooks",
        query: {
          bookUrl: escape(this.bookUrl || ""),
          readUrl: escape(selfBooks.href || ""),
        },
      });
    },

    // 加载目录
    getCatalog() {
      const sessionKey = "catalog@" + this.bookUrl;
      let sessionData = JSON.parse(sessionStorage.getItem(sessionKey));
      if (sessionData) {
        this.setBookCache(sessionData);
      } else {
        this.bookLoading = true;
        request
          .post(this.$store.state.api + "api/common/getCatalog", {
            bookUrl: this.bookUrl,
          })
          .then((result) => {
            if (result.data.data) {
              this.setBookCache(result.data.data);
            } else {
              this.bookTitle = "获取章节失败";
              this.bookContent = "获取章节目录失败！\n" + result.data.msg;
              this.bookLoading = false;
            }
          })
          .catch(() => {
            this.bookLoading = false;
            message.error("获取目录失败。");
          });
      }
    },

    // 设置缓存
    setBookCache(data) {
      this.catalogList = data.catalogList || [];
      let readIndex = 1;

      const readUrl = this.$route.query.readUrl
        ? unescape(this.$route.query.readUrl)
        : unescape(this.catalogList[0].href);

      this.catalogList.some((item, index) => {
        if (item.href === readUrl) {
          readIndex = index;
          return true;
        }
      });
      this.bookInfo = {
        readUrl: readUrl,
        readIndex: readIndex,
        bookUrl: this.bookUrl,
        ...data.info,
      };
      // 加入书架 缓存
      this.$store.commit("caches/setBooksList", this.bookInfo);
      sessionStorage.setItem("catalog@" + this.bookUrl, JSON.stringify(data));

      this.getBookContent(readUrl);
    },

    // 获取 正文
    getBookContent(readUrl) {
      // 设置当前章节的基础信息
      this.selfCatalog =
        this.catalogList.filter((d) => d.href === readUrl)[0] || {};
      // 修改章节名称
      this.bookTitle = this.selfCatalog.title || "";

      this.bookLoading = true;
      // 重置内容
      // this.bookContent = "";
      // 隐藏目录
      this.catalogPopover = false;
      // 隐藏 书架
      this.bookShelfPopover = false;

      // 重置滚动条
      jump(this.$refs.top, { duration: 0 });

      // 获取正文内容
      request
        .post(this.$store.state.api + "api/common/getBooksText", {
          bookUrl: readUrl,
        })
        .then(
          (res) => {
            let str =
              res.data.code === 200 ? res.data.data : "获取章节内容失败！";
            this.bookContent = str;
            this.bookLoading = false;
          },
          (error) => {
            let errorStr = "获取章节内容失败！\n" + (error && error.toString());
            this.bookLoading = false;
            this.bookContent = errorStr;
            message.error(errorStr);
            throw error;
          }
        );
    },

    // 内容点击事件
    eventHandler(point) {
      // 根据点击位置判断操作
      const midX = this.windowSize.width / 3;
      const midY = this.windowSize.height / 3;
      if (this.isEpub) {
        point.clientY =
          point.clientY +
          45 -
          (document.documentElement.scrollTop || document.body.scrollTop);
      }
      if (
        Math.abs(point.clientY - midY) <= this.windowSize.height * 0.2 &&
        Math.abs(point.clientX - midX) <= this.windowSize.width * 0.2
      ) {
        // 点击中部区域显示菜单
        if (!this.showReadBar) {
          this.showToolBar = !this.showToolBar;
        }
      } else if (this.$store.state.config.clickMethod === "下一页") {
        // 全屏点击下一页
        this.showToolBar = false;
        this.nextPage();
        return;
      } else if (this.$store.state.config.clickMethod === "不翻页") {
        // 全屏点击不翻页
        this.showToolBar = !this.showToolBar;
        return;
      } else if (this.isSlideRead) {
        if (point.clientX > midX) {
          // 点击右侧，下一页
          this.showToolBar = false;
          this.nextPage();
        } else if (point.clientX < midX) {
          // 点击左侧，上一页
          this.showToolBar = false;
          this.prevPage();
        }
      } else {
        if (point.clientY > midY) {
          // 点击下部，下一页
          this.showToolBar = false;
          this.nextPage();
        } else if (point.clientY < midY) {
          // 点击上部，上一页
          this.showToolBar = false;
          this.prevPage();
        }
      }
    },
  },
};
</script>

<style scoped>
@import url("@/views/book/css/readBooks.css");
</style>
