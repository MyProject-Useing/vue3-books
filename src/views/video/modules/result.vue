<template>
  <div class="book-result-wrap" :class="isMobileClass ? 'mobile' : ''">
    <video
      id="s-video"
      autoplay=""
      preload="auto"
      x-webkit-airplay="true"
      poster="data:image/ico;base64,aWNv"
      src="blob:https://z1.m1907.cn/b65c4842-60b2-45ed-852f-e53fc74d3b75"
      style="object-fit: contain"
    >
      您的浏览器版本不支持，无法播放视频！<br />请使用chrome 火狐 opera
      等浏览器访问本页面即可播放当前视频!!
    </video>

    <!-- <div class="search-content-panle">
      <div class="books-wrapper">
        <a-empty v-if="dataList.length === 0" description="暂无数据" />
        <ul v-else class="wrapper">
          <li class="book-item" v-for="(book, bi) in dataList" :key="bi">
            <div class="cover-img" @click.stop="toBookIndex(book)">
              <a-image
                class="cover"
                :src="getImgUrl(book)"
                fallback="data:image/png;base64,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"
              >
              </a-image>
            </div>
            <div class="book-info">
              <h2
                class="book-name ellipsis"
                :title="book.bookTitle"
                @click.stop="toBookIndex(book)"
              >
                {{ book.bookTitle }}
              </h2>
              <div class="book-content-details">
                <div class="last-chapter ellipsis" v-if="book.newestTitle">
                  <span>最新章节：</span>
                  <a @click="jumpNewest(book)" class="ellipsis">
                    {{ book.newestTitle }}</a
                  >
                </div>
                <div class="last-chapter ellipsis" v-if="book.lastTime">
                  更新时间：{{ book.lastTime }}
                </div>
              </div>
              <div class="book-author">
                <span :title="book.author" class="ellipsis book-author-title">
                  <UserOutlined /> {{ book.author || "" }}
                </span>
                <a v-if="isCollect(book)" @click.stop="jumpRead(book)"
                  >继续阅读</a
                >
              </div>
            </div>
          </li>
        </ul>
        <a-back-top />
      </div>
    </div> -->
  </div>
</template>

<script>
import { isMobile } from "@/plugins/utils";
// import { UserOutlined } from "@ant-design/icons-vue";
export default {
  name: "bookResult",
  // components: { UserOutlined },
  data() {
    return {
      // 数据列表
      noCover: require("@/assets/imgs/noCover.jpeg"),
    };
  },
  props: {
    dataList: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  computed: {
    // 是否为移动端
    isMobileClass() {
      let isTrue = isMobile();
      return isTrue;
    },
    cacheBookList() {
      return this.$store.state.caches.readBooksList;
    },
  },
  methods: {
    // 获取书籍封面
    getImgUrl(book) {
      return (
        book.imgUrl ?? this.cacheBookList[book.bookUrl]?.imgUrl ?? this.noCover
      );
    },
    // 是否已加入收藏
    isCollect(book) {
      return this.cacheBookList[book.bookUrl] ? true : false;
    },
    // 书籍详情
    toBookIndex(book) {
      if (!book.bookUrl) {
        return;
      }
      // 加入书架 缓存
      // this.$store.commit("caches/setBooksList", book);
      this.$router.push({
        path: "/book",
        query: { bookUrl: escape(book.bookUrl) },
      });
    },
    // 查看最新章节
    jumpNewest(book) {
      if (!book.bookUrl) {
        return;
      }
      let newestUrl = unescape(book.bookUrl + book.newestUrl);
      this.$router.push({
        path: "/readBooks",
        query: {
          bookUrl: escape(book.bookUrl || ""),
          readUrl: escape(newestUrl || ""),
        },
      });
    },

    // 继续阅读
    jumpRead(book) {
      let bookUrl = unescape(book.bookUrl || "");
      if (!bookUrl) {
        return;
      }
      let readUrl = this.cacheBookList[bookUrl]
        ? this.cacheBookList[bookUrl].readUrl
        : "";
      // let newestUrl = unescape(book.bookUrl + book.newestUrl);
      this.$router.push({
        path: "/readBooks",
        query: {
          bookUrl: escape(book.bookUrl || ""),
          readUrl: escape(readUrl || ""),
        },
      });
    },
  },
};
</script>
<style scoped>
@import url("@/views/book/css/bookResult.css");
</style>
