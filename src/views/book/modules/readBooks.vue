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
      <div class="chapter-control dib-wrap" v-show="!bookLoading">
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
      <div class="left-bar-list">
        <dl>
          <dd>
            <a href="javascript:" @click="goHome">
              <bank-outlined />
              <span>首页</span>
            </a>
          </dd>
          <dd>
            <a
              id="catalog_bottom"
              href="javascript:"
              :class="catalogList.length > 0 ? '' : 'disabled'"
              @click.stop="catalogList.length > 0 ? showCatalog() : false"
            >
              <UnorderedListOutlined />
              <span>目录</span>
            </a>
          </dd>
          <dd class="">
            <a href="javascript:">
              <SettingOutlined />
              <span>设置</span></a
            >
          </dd>
          <dd>
            <a
              id="bookshelf_btn"
              href="javascript:"
              @click.stop="showBookShelf"
            >
              <BookOutlined /><span>书架</span></a
            >
          </dd>
        </dl>
        <!-- 目录 -->
        <div id="catalog_panle" class="setting-popover" v-show="catalogPopover">
          <catalog
            :bookUrl="bookUrl"
            :currHref="selfBook.href"
            :catalogList="catalogList"
          />
        </div>
        <!-- 书架 -->
        <div
          id="bookShelf_panle"
          class="setting-popover"
          v-show="bookShelfPopover"
        >
          <booksShelf @changeChapter="toChapter" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// 文章
import booksContent from "@/components/books/booksContent.vue";

// 目录
import catalog from "@/components/books/catalogList.vue";

// 书架
import booksShelf from "@/components/books/booksShelf.vue";

import { isMobile } from "@/plugins/utils";
import { message } from "ant-design-vue";

import jump from "@/plugins/jump";

import request from "@/plugins/axios";
import {
  BookOutlined,
  UnorderedListOutlined,
  SettingOutlined,
  BankOutlined,
} from "@ant-design/icons-vue";

// 书籍详情
export default {
  name: "readBooks",
  components: {
    booksContent,
    booksShelf,
    BookOutlined,
    catalog,
    UnorderedListOutlined,
    SettingOutlined,
    BankOutlined,
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

      selfBook: {},
    };
  },
  mounted() {
    this.init();

    window.onclick = (e) => {
      let $catalog_bottom = document.getElementById("catalog_bottom");
      let $catalog_curr = document.getElementById("catalog_curr");

      let $catalog_panle = document.getElementById("catalog_panle");
      let $bookShelf_panle = document.getElementById("bookShelf_panle");
      let $bookshelf_btn = document.getElementById("bookshelf_btn");

      // 点击空白 关闭 目录和书签
      if (this.catalogPopover === true) {
        if (
          e.path.includes($catalog_bottom) ||
          e.path.includes($catalog_curr) ||
          e.path.includes($catalog_panle)
        ) {
          return false;
        } else {
          this.catalogPopover = false;
        }
      } else if (this.bookShelfPopover === true) {
        if (
          e.path.includes($bookshelf_btn) ||
          e.path.includes($bookShelf_panle)
        ) {
          return false;
        } else {
          this.bookShelfPopover = false;
        }
      }
    };

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
      return this.catalogList.length == 0 || this.bookLoading ? "disabled" : "";
    },

    // 上一章
    firstClass() {
      if (
        this.catalogList.length == 0 ||
        this.bookLoading ||
        this.selfBook.index === 1
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
        this.selfBook.index === this.catalogList.length
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

    // 返回首页
    goHome() {
      this.$router.push({ path: "/" });
    },

    // 展示目录
    showCatalog() {
      this.catalogPopover = true;
      // 隐藏 书架
      this.bookShelfPopover = false;
    },

    // 展示书架
    showBookShelf() {
      // 隐藏目录
      this.catalogPopover = false;
      // 隐藏 书架
      this.bookShelfPopover = true;
    },

    // 上/下一章
    toNextChapter(isNext) {
      let index = this.selfBook.index || 1;
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
      let readUrl = unescape(this.$route.query.readUrl);
      let sessionData = JSON.parse(sessionStorage.getItem(sessionKey));
      if (sessionData) {
        this.setBookCache(sessionData);
        this.getBookContent(readUrl);
      } else {
        this.bookLoading = true;
        request
          .post(this.$store.state.api + "api/common/getCatalog", {
            bookUrl: this.bookUrl,
          })
          .then((result) => {
            if (result.data.data) {
              this.setBookCache(result.data);
              this.getBookContent(readUrl);
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

    setBookCache(data) {
      const readUrl = this.$route.query.readUrl
        ? unescape(this.$route.query.readUrl)
        : this.catalogList[0].href;

      this.catalogList = data.catalogList;
      let readIndex = 1;
      this.catalogList.some((item, index) => {
        if (item.href === readUrl) {
          readIndex = index;
          return true;
        }
      });
      this.bookInfo = { ...data.info, readUrl: readUrl, readIndex: readIndex };
      // 加入书架 缓存
      this.$store.commit("caches/setBooksList", {
        bookUrl: this.bookUrl,
        ...this.bookInfo,
      });
      sessionStorage.setItem("catalog@" + this.bookUrl, JSON.stringify(data));
    },

    // 获取 正文
    getBookContent(readUrl) {
      // 设置当前章节的基础信息
      this.selfBook =
        this.catalogList.filter((d) => d.href === readUrl)[0] || {};
      // 修改章节名称
      this.bookTitle = this.selfBook.title || "";

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
