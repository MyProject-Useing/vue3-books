<template>
  <div class="reader-content">
    <div class="content-inner">
      <booksContent
        v-loading="bookLoading"
        class="book-content"
        :bookInfo="readingBook"
        :title="bookTitle"
        :content="bookContent"
        ref="bookContentRef"
      />

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
                  <el-icon><Grid /></el-icon>
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
                      <li
                        v-for="(item, index) in catalogList"
                        :key="item.index"
                        @click="changeCatalog(item)"
                      >
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
              <el-icon><Tools /></el-icon>
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
  </div>
</template>
<script>
import booksContent from "@/components/booksContent.vue";
import { cacheFirstRequest, networkFirstRequest } from "@/plugins/helper";
import jump from "@/plugins/jump";
import Animate from "@/plugins/animate";

import request from "@/plugins/axios";
import { CollectionTag, Grid, Tools } from "@element-plus/icons";
// 书籍详情
export default {
  name: "readBooks",
  components: {
    booksContent,
    CollectionTag,
    Grid,
    Tools,
  },
  data() {
    return {
      // 章节目录
      bookTitle: "",
      // 正文内容
      bookContent: "",
      // 内容遮罩框
      bookLoading: true,

      // 内容块是否错误
      isContentError: false,

      // 是否刷新
      tryRefresh: true,

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

      // 文本过滤弹出框
      showTextFilterPrompting: false,

      // 是否展示菜单栏
      showReadBar: false,
      // 展示工具栏
      showToolBar: true,

      // 最后阅读的书籍
      lastReadingBook: {},
    };
  },
  computed: {
    // 读取当前书籍
    readingBook() {
      return this.$store.state.caches.readingBook || {};
    },
    // 路径信息
    catalog() {
      return (this.readingBook || {}).catalog || [];
    },
    // 章节
    chapterIndex() {
      return ((this.readingBook || {}).index || 0) | 0;
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
  },
  activated() {
    this.init();
  },
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
    init(refresh) {
      if (this.readingBook) {
        if (
          refresh ||
          !this.lastReadingBook ||
          this.lastReadingBook.bookUrl !== this.readingBook.bookUrl
        ) {
          this.bookTitle = "";
          this.lastReadingBook = this.$store.state.readingBook;
          // 跳转记住的位置
          this.autoShowPosition();
          this.loadCatalog(false);
        } else {
          if (this.isEpub) {
            // 跳转记住的位置
            this.autoShowPosition(true);
          } else {
            this.startSavePosition = true;
          }
          setTimeout(() => {
            this.$store.commit("caches/setReadingBook", this.lastReadingBook);
          }, 100);
        }
      } else {
        this.$message.error("请在书架选择书籍");
      }
    },
    goHome() {
      this.$router.push({
        path: "/",
        query: { keywords: this.keywords },
      });
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
              this.readingBook.bookName +
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
    // 上一章
    toLastChapter(onError) {
      let readingBook = this.readingBook;

      if (!readingBook || !readingBook.bookUrl || !readingBook.catalog) {
        onError && onError();
        return;
      }
      let index = readingBook.index;
      index--;
      if (typeof readingBook.catalog[index] !== "undefined") {
        this.getContent(index);
      } else {
        this.$message.error("本章是第一章");
        onError && onError();
      }
    },
    // 下一章
    toNextChapter(onError) {
      let readingBook = this.readingBook;

      if (!readingBook || !readingBook.bookUrl || !readingBook.catalog) {
        onError && onError();
        return;
      }

      let index = readingBook.index;
      index++;
      if (typeof readingBook.catalog[index] !== "undefined") {
        this.getContent(index);
      } else {
        onError && onError();
        this.$message.error("本章是最后一章");
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
          this.toNextChapter(() => {
            if (typeof moveX !== "undefined") {
              // 没有下一章，但是已经做了动画，恢复
              this.showPage(this.currentPage, 0);
            }
          });
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
          this.toNextChapter();
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
          this.toLastChapter(() => {
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
          this.toLastChapter();
        }
      }
    },
    // 全部目录
    loadCatalog(refresh) {
      this.bookLoading = true;
      this.getCatalog(refresh).then(
        (res) => {
          if (res.data.isSuccess) {
            // 加入书源 缓存
            this.$store.commit("caches/setReadBooks", {
              ...this.readingBook,
              catalog: res.data.data,
            });

            // 更新书籍目录
            this.$store.commit("caches/setReadingBook", {
              ...this.readingBook,
              catalog: res.data.data,
            });
            this.getContent(this.readingBook.index || 0);
          } else {
            this.bookTitle = "获取章节失败，请刷新界面";
            this.bookContent = "获取章节目录失败！\n" + res.data.errorMsg;
            this.isContentError = true;
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
        this.readingBook.bookName +
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
      let catalogList = readingBook.catalog;

      //强制滚回顶层
      jump(this.$refs.top, { duration: 0 });

      // 加入书源 缓存
      this.$store.commit("caches/setReadBooks", {
        ...readingBook,
        index: index,
      });
      // 保存阅读进度
      this.$store.commit("caches/setReadingBook", {
        ...readingBook,
        index: index,
      });

      // 如果超出目录范围，尝试刷新目录
      if (!catalogList[index]) {
        if (this.tryRefresh) {
          this.tryRefresh = false;
          this.bookContent = "获取章节内容失败，请更新目录！";
          this.isContentError = true;
        } else {
          this.tryRefresh = true;
          this.refreshCatalog();
        }
        this.bookLoading = false;
        return;
      }
      // 设置章节名称
      this.bookTitle = catalogList[index].title;
      let bookUrl = readingBook.bookUrl;
      this.bookLoading = true;

      // 获取正文内容
      this.getBookContent(catalogList[index].index).then(
        (res) => {
          this.bookLoading = false;
          if (bookUrl !== readingBook.bookUrl || index !== readingBook.index) {
            // 已经换书或者换章节了
            return;
          }
          if (res.data.isSuccess) {
            let data = res.data.data;
            this.bookContent = data;
            this.isContentError = false;
          } else {
            this.bookContent = "获取章节内容失败！\n" + res.data.errorMsg;
            this.isContentError = true;
          }
        },
        (error) => {
          this.bookLoading = false;
          if (bookUrl !== readingBook.bookUrl || index !== readingBook.index) {
            // 已经换书或者换章节了
            return;
          }
          this.bookContent =
            "获取章节内容失败！\n" + (error && error.toString());
          this.isContentError = true;
          this.$message.error(
            "获取章节内容失败 " + (error && error.toString())
          );
          throw error;
        }
      );
    },
    // 请求书籍内容
    async getBookContent(chapterIndex, options) {
      let readingBook = this.readingBook;

      return cacheFirstRequest(
        () =>
          request.get(
            this.$store.state.api +
              "/getBookContent?url=" +
              encodeURIComponent(readingBook.bookUrl) +
              "&index=" +
              chapterIndex,
            {
              timeout: 30000,
              ...options,
            }
          ),
        readingBook.bookName +
          "_" +
          readingBook.author +
          "@" +
          readingBook.bookUrl +
          "@chapterContent-" +
          chapterIndex
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
            this.readingBook.bookName +
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
    // 地址改变
    epubLocationChangeHandler(url) {
      function getPathname(path) {
        const a = document.createElement("a");
        a.href = path;
        return decodeURIComponent(a.pathname);
      }
      url = getPathname(url);
      // 判断是否跳转了其他章节
      const currentChapter = this.catalog[this.chapterIndex];
      if (currentChapter) {
        const chapterPrefix = this.bookContent.replace(currentChapter.url, "");
        const iframeUrlPath = url.replace(chapterPrefix, "");
        let newChapterIndex = -1;
        for (let i = 0; i < this.catalog.length; i++) {
          if (this.catalog[i].url === iframeUrlPath) {
            newChapterIndex = i;
            break;
          }
        }
        if (newChapterIndex >= 0) {
          let book = { ...this.readingBook };
          book.index = newChapterIndex;

          // 加入书源 缓存
          this.$store.commit("caches/setReadBooks", book);
          this.$store.commit("caches/setReadingBook", book);
          this.bookTitle = this.readingBook.catalog[newChapterIndex].title;
        }
      }
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
@import url("@/assets/css/base.css");
@import url("@/assets/css/readBooks.css");
</style>
