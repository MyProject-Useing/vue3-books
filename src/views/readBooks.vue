<template>
  <div class="reader-content" :class="isMobileClass ? 'mobile' : ''">
    <div class="main-read-container">
      <booksContent
        class="book-content"
        :loading="bookLoading"
        :bookInfo="readingBook"
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
            :bookInfo="readingBook"
            :catalogList="catalogList"
            @changeChapter="toChapter"
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

// 书架
import catalog from "@/components/books/catalogList.vue";

// 书架
import booksShelf from "@/components/books/booksShelf.vue";

import { isMobile } from "@/plugins/utils";
import { cacheFirstRequest } from "@/plugins/helper";
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

      // 总页数
      totalPages: 1,
      // 当前页数
      currentPage: 1,

      // 展示最后的页数
      showLastPage: false,

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
      if (
        !this.bookLoading &&
        this.readingBook &&
        this.catalogList.length > 0
      ) {
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
      return isMobile();
    },
    // 读取当前书籍
    readingBook() {
      return this.bookInfo || {};
    },
    // 窗口高度
    windowSize() {
      return this.$store.state.windowSize;
    },
    // 目录是否禁用
    catalogClass() {
      return this.catalogList.length == 0 || this.bookLoading ? "disabled" : "";
    },
    firstClass() {
      if (
        this.catalogList.length == 0 ||
        this.bookLoading ||
        this.readingBook.readIndex == 0
      ) {
        return "disabled";
      }
      return "";
    },
    nextClass() {
      if (
        this.catalogList.length == 0 ||
        this.bookLoading ||
        this.readingBook.readIndex == this.catalogList.length - 1
      ) {
        return "disabled";
      }
      return "";
    },
    bookUrl() {
      return unescape(this.$route.query.bookUrl || "");
    },
  },
  activated() {
    // 隐藏目录
    this.catalogPopover = false;
    // 隐藏 书架
    this.bookShelfPopover = false;

    this.init();
  },
  deactivated() {},
  watch: {
    // 监听当前阅读的书籍
    readingBook(val, oldVal) {
      if (val.bookUrl !== oldVal.bookUrl) {
        this.startSavePosition = false;
        this.autoShowPosition();
      }
    },
  },
  methods: {
    init() {
      if (this.bookUrl) {
        this.bookTitle = "";
        this.getCatalog();
      } else {
        message.error("请重新选择书籍。");
      }
    },
    goHome() {
      this.$router.push({ path: "/" });
    },
    // 展示目录
    showCatalog() {
      this.catalogPopover = true;
      // 隐藏 书架
      this.bookShelfPopover = false;
    },
    showBookShelf() {
      // 隐藏目录
      this.catalogPopover = false;
      // 隐藏 书架
      this.bookShelfPopover = true;
    },
    // 自动记住位置
    autoShowPosition(immediate) {
      const handler = () => {
        setTimeout(() => {
          this.startSavePosition = true;
        }, 2000);
        if (this.error) {
          return;
        }
        const lastPosition =
          window.localStorage &&
          window.localStorage.getItem(
            "bookChapterProgress@" +
              this.readingBook.name +
              "_" +
              this.readingBook.author
          );
        if (+lastPosition) {
          this.$nextTick(() => {
            this.showPosition(+lastPosition, () => {
              this.startSavePosition = true;
            });
          });
        }
      };
      if (immediate) {
        handler();
      }
    },
    // 查询指定章节内容
    toChapter(index) {
      this.catalogPopover = false;
      this.bookShelfPopover = false;
      let readingBook = this.readingBook;
      if (!readingBook || !readingBook.bookUrl || !this.catalogList) {
        message.error("章节错误");
        return;
      }
      if (typeof this.catalogList[index - 1] !== "undefined") {
        this.getContent(index);
      } else {
        message.error("目录错误或者已是最新章节");
      }
    },
    // 下一章
    toNextChapter(isNext) {
      let readingBook = this.readingBook;
      if (
        !readingBook ||
        !readingBook.bookUrl ||
        !this.catalogList ||
        this.catalogList.length === 0
      ) {
        message.error("章节错误，请返回首页。");
        return;
      }
      let index = readingBook.readIndex || 1;
      isNext ? index++ : index--;
      if (index >= this.catalogList.length + 1) {
        message.error("已是最后一章。");
      } else if (index < 2) {
        message.error("已是第一章。");
      } else {
        this.getContent(index);
      }
    },
    // 加载目录
    getCatalog() {
      debugger;
      const sessionKey = "catalog@" + this.bookUrl;
      const readUrl = unescape(this.$route.query.readUrl);
      let sessionData = JSON.parse(sessionStorage.getItem(sessionKey));

      if (sessionData) {
        this.catalogList = sessionData.catalogList;
        this.bookInfo = sessionData.info;
        // 加入书源 缓存
        this.$store.commit("caches/setBooksList", {
          ...this.bookInfo,
          bookUrl: this.bookUrl,
          readUrl: readUrl,
        });
      } else {
        this.bookLoading = true;
        request
          .post(this.$store.state.api + "api/common/getCatalog", {
            bookUrl: this.bookUrl,
          })
          .then((result) => {
            if (result.data.data) {
              this.catalogList = result.data.data.catalogList;
              this.bookInfo = result.data.data.info;
              sessionStorage.setItem(
                sessionKey,
                JSON.stringify(result.data.data)
              );
              // 加入书源 缓存
              this.$store.commit("caches/setBooksList", {
                ...this.bookInfo,
                bookUrl: this.bookUrl,
                readUrl: readUrl,
              });
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
      this.getContent(readUrl);
    },

    // 获取文章内容块
    getContent(index) {
      debugger;
      let readingBook = this.readingBook;
      if (index > this.catalogList.length + 1) {
        message.error(`无法找到第${index}章，请刷新页面试试。`);
        return;
      }

      if (index < 1) {
        message.error(`章节错误。`);
        return;
      }

      let selfBooks = this.catalogList[index - 1];
      // 设置章节名称
      let bookUrl = selfBooks.bookUrl + selfBooks.href;

      this.bookTitle = selfBooks.title;
      this.bookLoading = true;
      this.bookContent = "";
      //强制滚回顶层
      jump(this.$refs.top, { duration: 0 });

      // 加入书源 缓存
      this.$store.commit("caches/setBooksList", {
        ...readingBook,
        readIndex: index,
      });

      // 获取正文内容
      this.getBookContent(bookUrl).then(
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
    // 请求书籍内容
    async getBookContent(url) {
      let cacheStr = url + "@chapterContent";
      return cacheFirstRequest(
        () =>
          request.post(this.$store.state.api + "api/common/getBooksText", {
            bookUrl: url,
          }),
        cacheStr
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
@import url("@/assets/css/readBooks.css");
</style>
