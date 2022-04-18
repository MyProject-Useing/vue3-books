<template>
  <div class="reader-content">
    <div class="main-read-container">
      <booksContent
        class="book-content"
        :loading="bookLoading"
        :bookInfo="readingBook"
        :title="bookTitle"
        :content="bookContent"
        ref="bookContentRef"
      />
      <div class="chapter-control dib-wrap">
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

import { cacheFirstRequest, networkFirstRequest } from "@/plugins/helper";
import jump from "@/plugins/jump";
import Animate from "@/plugins/animate";

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
    // 读取当前书籍
    readingBook() {
      return this.$store.state.caches.readingBook || {};
    },
    // 窗口高度
    windowSize() {
      return this.$store.state.windowSize;
    },
    isSlideRead() {
      return this.showReadBar || this.isEpub || this.isCarToon || this.isAudio
        ? false
        : this.$store.getters.isSlideRead;
    },
    // 滚动条偏移值
    scrollOffset() {
      // 两行 + 两个段间距
      return (
        this.$store.state.config.fontSize *
          this.$store.state.config.lineHeight *
          2 +
        this.$store.state.config.fontSize *
          this.$store.state.config.paragraphSpace *
          2
      );
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
      if (this.readingBook) {
        this.bookTitle = "";
        // 跳转记住的位置
        this.loadCatalog(false);
      } else {
        this.$message.error("请在书架选择书籍");
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
        this.$message.error("章节错误");
        return;
      }
      if (typeof this.catalogList[index] !== "undefined") {
        this.getContent(index);
      } else {
        this.$message.error("目录错误或已最新");
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
        this.$message.error("章节错误，请返回首页");
        return;
      }
      let index = readingBook.readIndex || 0;
      isNext ? index++ : index--;
      if (index >= this.catalogList.length) {
        this.$message.error("本章是最后一章");
      } else if (index < 0) {
        this.$message.error("本章已是第一章");
      } else {
        this.getContent(index);
      }
    },
    // 下一页
    nextPage(moveX) {
      if (this.transforming) {
        return false;
      }

      if (this.isSlideRead) {
        if (this.currentPage < this.totalPages) {
          if (typeof moveX === "undefined") {
            this.transformX =
              -(this.windowSize.width - 16) * (this.currentPage - 1);
          }
          this.currentPage += 1;
          this.transforming = true;
          this.transform(
            typeof moveX === "undefined"
              ? -(this.windowSize.width - 16)
              : moveX,
            300
          );
        } else {
          this.toNextChapter(true);
        }
      } else {
        if (
          (document.documentElement.scrollTop || document.body.scrollTop) +
            this.windowSize.height <
          document.documentElement.scrollHeight
        ) {
          this.currentPage += 1;
          const moveY = this.windowSize.height - this.scrollOffset;
          this.transforming = true;
          this.scrollContent(moveY, 300);
        } else {
          this.currentPage = 1;
          this.toNextChapter(true);
        }
      }
    },
    // 上一页
    prevPage(moveX) {
      if (this.transforming) {
        return false;
      }

      if (this.isSlideRead) {
        if (this.currentPage > 1) {
          if (typeof moveX === "undefined") {
            this.transformX =
              -(this.windowSize.width - 16) * (this.currentPage - 1);
          }
          this.currentPage -= 1;
          this.transforming = true;
          this.transform(
            typeof moveX === "undefined" ? this.windowSize.width - 16 : moveX,
            300
          );
        } else {
          this.showLastPage = true;
          this.toNextChapter(false, () => {
            if (typeof moveX !== "undefined") {
              // 没有下一章，但是已经做了动画，恢复
              this.showPage(this.currentPage, 0);
            }
          });
        }
      } else {
        if (
          (document.documentElement.scrollTop || document.body.scrollTop) > 0
        ) {
          this.currentPage -= 1;
          const moveY = -this.windowSize.height + this.scrollOffset;
          this.transforming = true;
          this.scrollContent(moveY, 300);
        } else {
          this.currentPage = 1;
          this.toNextChapter(false);
        }
      }
    },
    // 全部目录
    loadCatalog(refresh) {
      this.bookLoading = true;
      this.getCatalog(refresh).then(
        (res) => {
          if (res.data.isSuccess) {
            this.catalogList = res.data.data;
            this.getContent(this.readingBook.readIndex || 0);
          } else {
            this.bookTitle = "获取章节失败";
            this.bookContent = "获取章节目录失败！\n" + res.data.errorMsg;
            this.bookLoading = false;
          }
        },
        (error) => {
          this.bookLoading = false;
          this.$message.error(
            "获取书籍目录列表 " + (error && error.toString())
          );
        }
      );
    },
    // 加载目录
    getCatalog(refresh) {
      const params = {
        url: this.readingBook.bookUrl,
        refresh: refresh ? 1 : 0,
      };
      if (this.$route.query.search) {
        // 来自搜索结果，请求需要带上 书源链接
        params.bookSourceUrl = this.readingBook.origin;
      }

      const catchData =
        this.readingBook.name +
        "_" +
        this.readingBook.author +
        "@" +
        this.readingBook.bookUrl +
        "@chapterList";

      return networkFirstRequest(
        () =>
          request.get(this.$store.state.api + "/getChapterList", { params }),
        catchData
      );
    },
    // 获取文章内容块
    getContent(index) {
      let readingBook = this.readingBook;
      if (index > this.catalogList.length) {
        this.$message.error(`无法找到第${index}章，请刷新页面试试。`);
        // this.refreshCatalog(); //刷新章节
        return;
      }

      if (index < 0) {
        this.$message.error(`已是第一章。`);
        return;
      }
      // 设置章节名称
      this.bookTitle = this.catalogList[index].title;
      this.bookLoading = true;
      this.bookContent = "";
      //强制滚回顶层
      jump(this.$refs.top, { duration: 0 });

      // 加入书源 缓存
      this.$store.commit("caches/setBooksList", {
        ...readingBook,
        readIndex: index,
      });
      // 保存阅读进度
      this.$store.commit("caches/setReadingBook", {
        ...readingBook,
        readIndex: index,
      });

      // 获取正文内容
      this.getBookContent(index).then(
        (res) => {
          let str = res.data.isSuccess ? res.data.data : "获取章节内容失败！";
          this.bookContent = str;
          this.bookLoading = false;
        },
        (error) => {
          let errorStr = "获取章节内容失败！\n" + (error && error.toString());
          this.bookLoading = false;
          this.bookContent = errorStr;
          this.$message.error(errorStr);
          throw error;
        }
      );
    },
    // 请求书籍内容
    async getBookContent(chapterIndex) {
      let readingBook = this.readingBook;

      let bookUrl = readingBook.bookUrl;

      let cacheStr =
        readingBook.name +
        "_" +
        readingBook.author +
        "@" +
        bookUrl +
        "@chapterContent-" +
        chapterIndex;

      return cacheFirstRequest(
        () =>
          request.get(
            this.$store.state.api +
              "/getBookContent?url=" +
              encodeURIComponent(bookUrl) +
              "&index=" +
              chapterIndex,
            {
              timeout: 30000,
            }
          ),
        cacheStr
      );
    },
    // 保存阅读进度
    saveReadingPosition() {
      if (this.error || !this.startSavePosition) {
        return;
      }
      let position = 0;
      if (this.isAudio) {
        position = this.$refs.bookContentRef
          ? this.$refs.bookContentRef.currentTime
          : 0;
      } else if (this.isEpub || this.isCarToon) {
        position =
          document.documentElement.scrollTop || document.body.scrollTop;
      } else {
        this.currentParagraph = this.getCurrentParagraph();
        if (this.currentParagraph) {
          position = this.$refs.bookContentRef.$el.innerText.indexOf(
            this.currentParagraph.innerText
          );
        }
      }
      window.localStorage &&
        window.localStorage.setItem(
          "bookChapterProgress@" +
            this.readingBook.name +
            "_" +
            this.readingBook.author,
          position
        );
    },
    // 获取当前进度
    getCurrentParagraph() {
      const readingEle =
        this.$refs.bookContentRef.$el.querySelectorAll(".reading");
      let currentParagraph = null;
      if (!readingEle.length) {
        // 没有正在读的段落，遍历找到当前页面的第一段
        const list = this.$refs.bookContentRef.$el.querySelectorAll("h3,p");
        for (let i = 0; i < list.length; i++) {
          const elePos = list[i].getBoundingClientRect();
          if (this.isSlideRead) {
            // 段尾出现在视野里
            if (elePos.right > 0) {
              currentParagraph = list[i];
              break;
            }
          } else {
            // 段尾出现在视野里
            if (
              elePos.bottom >
              30 +
                20 +
                (window.webAppDistance | 0) +
                (this.$store.state.safeArea.top | 0)
            ) {
              currentParagraph = list[i];
              break;
            }
          }
        }
      } else {
        currentParagraph = readingEle[0];
      }
      return currentParagraph;
    },
    // 展示当前阅读进度
    showParagraph(paragraph, scroll) {
      if (!paragraph) {
        return;
      }
      if (this.isSlideRead) {
        // 跳转位置
        this.$nextTick(() => {
          const pos = paragraph.getBoundingClientRect();
          if (pos.left > this.windowSize.width - 16) {
            this.showPage(
              Math.round(pos.left / (this.windowSize.width - 16)) + 1,
              0
            );
          }
        });
      } else if (scroll) {
        // 跳转位置
        this.$nextTick(() => {
          const pos = paragraph.getBoundingClientRect();
          this.scrollContent(
            pos.top -
              30 -
              (window.webAppDistance | 0) -
              (this.$store.state.safeArea.top | 0),
            0
          );
        });
      }
    },
    // 动画效果
    transform(moveX, duration) {
      const onEnd = () => {
        this.contentStyle = {
          transform: `translateX(${this.transformX + moveX}px)`,
        };
        this.transformX += moveX;
        this.transforming = false;
        // 保存进度
        setTimeout(this.saveReadingPosition, duration);
      };
      if (!duration) {
        onEnd();
        return;
      }
      const timing = Animate.Utils.makeEaseInOut(
        Animate.Timings.power.bind(null, 3)
      );

      new Animate({
        duration: duration || 500,
        timing: timing,
        draw: (progress) => {
          this.contentStyle = {
            transform: `translateX(${this.transformX + moveX * progress}px)`,
          };
        },
        onEnd,
      });
    },
    // 展示当前页数
    showPage(page, duration) {
      this.currentPage = Math.min(page, this.totalPages);
      if (this.isSlideRead) {
        const moveX =
          -(this.windowSize.width - 16) * (this.currentPage - 1) -
          this.transformX;

        this.transform(moveX, typeof duration === "undefined" ? 300 : duration);
      } else {
        const moveY =
          (this.windowSize.height - 10) * (this.currentPage - 1) -
          (document.documentElement.scrollTop || document.body.scrollTop);
        this.scrollContent(
          moveY,
          typeof duration === "undefined" ? 300 : duration
        );
      }
    },
    // 内容块滚动高度
    scrollContent(moveY, duration, isAccurate) {
      const lastScrollTop = isAccurate
        ? 0
        : document.documentElement.scrollTop || document.body.scrollTop;
      const onEnd = () => {
        document.documentElement.scrollTop = lastScrollTop + moveY;
        document.body.scrollTop = lastScrollTop + moveY;
        this.transforming = false;
        // 保存进度
        setTimeout(this.saveReadingPosition, duration);
      };
      if (!duration) {
        onEnd();
        return;
      }
      const timing = Animate.Utils.makeEaseInOut(
        Animate.Timings.power.bind(null, 3)
      );

      new Animate({
        duration: duration || 500,
        timing: timing,
        draw: (progress) => {
          document.documentElement.scrollTop = lastScrollTop + moveY * progress;
          document.body.scrollTop = lastScrollTop + moveY * progress;
        },
        onEnd,
      });
    },
    // 内容点击事件
    eventHandler(point) {
      // if (
      //   this.popBookSourceVisible ||
      //   this.popBookShelfVisible ||
      //   this.popCataVisible ||
      //   this.readSettingsVisible
      // ) {
      //   if (this.isEpub) {
      //     this.popBookSourceVisible = false;
      //     this.popBookShelfVisible = false;
      //     this.popCataVisible = false;
      //     this.readSettingsVisible = false;
      //   }
      //   return;
      // }
      // if (this.isAudio) {
      //   // 音频
      //   // 点击中部区域显示菜单
      //   if (!this.showReadBar) {
      //     this.showToolBar = !this.showToolBar;
      //   }
      //   return;
      // }
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
