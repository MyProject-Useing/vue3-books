<template>
  <div class="reader-content-wrap" :class="isMobileClass ? 'mobile' : ''">
    <div class="reader-content">
      <div class="main-read-container">
        <booksContent
          class="book-content"
          :bookInfo="bookInfo"
          :title="bookTitle"
          :content="bookContent"
          @touchend="eventEnd"
          @touchmove="eventMove"
          ref="bookContentRef"
        >
        </booksContent>

        <div class="read-load-next">
          <a v-if="bookLoading" href="javascript:" class="btn-normal"
            ><a-spin class="read-load-loading" />
          </a>
          <a
            v-else
            href="javascript:"
            class="btn-normal"
            @click="toNextChapter(true)"
            >加载下一章
          </a>
        </div>

        <div
          class="chapter-control dib-wrap"
          v-if="!bookLoading && !isMobileClass"
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
              catalogList.length == 0 || bookLoading
                ? false
                : toNextChapter(true)
            "
            >下一章</a
          >
        </div>
      </div>
      <leftBar
        v-show="showToolBar"
        :catalogList="catalogList"
        :selfCatalog="selfCatalog"
      ></leftBar>
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

      // 展示工具栏
      showToolBar: false,

      // 目录弹出框
      catalogPopover: false,

      // 目录
      catalogList: [],

      // 书架弹出框
      bookShelfPopover: false,

      bookInfo: {},

      selfCatalog: {},

      // 是否移动了内容
      touchMove: false,
    };
  },
  computed: {
    // 是否为移动端
    isMobileClass() {
      let isTrue = isMobile();
      return isTrue;
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
  mounted() {
    this.init();
    if (!this.isMobileClass) {
      this.showToolBar = true;
    }
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
            // 重置滚动条
            jump(-window.document.body.clientHeight, { duration: 0 });
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

    // 移动端 内容点击事件
    eventEnd(dom) {
      // 如果是手动移动
      if (this.touchMove) {
        this.touchMove = false;
        return false;
      }
      let point = dom.changedTouches[0];
      let windowSize = {
        width: window.document.documentElement.clientWidth,
        height: window.document.documentElement.clientHeight,
      };

      // 根据点击位置判断操作
      const tY = windowSize.height / 3.6;
      // 点击屏幕顶部
      if (point.clientY <= tY) {
        jump(-(windowSize.height - point.screenY), { duration: 270 });
      }
      // 点击屏幕底部
      else if (windowSize.height - point.clientY <= tY) {
        jump(point.clientY, { duration: 270 });
      }
      // 点击屏幕中部
      else {
        // 显示菜单
        this.showToolBar = !this.showToolBar;
      }
    },

    // 移动端 内容点击事件
    eventMove() {
      this.touchMove = true;
    },
  },
};
</script>

<style scoped>
@import url("@/views/book/css/readBooks.css");

.read-load-next .read-load-loading {
  line-height: 1;
}
</style>
<style>
.read-load-next .read-load-loading .ant-spin-dot-item {
  background-color: #fff;
}
</style>
