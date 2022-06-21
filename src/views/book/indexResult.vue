<template>
  <div class="book-index-wrap">
    <a-spin :spinning="refreshLoading">
      <div class="rank-list-row">
        <div class="rank-list" v-for="item in top" :key="item.title">
          <h3 class="wrap-title lang">
            <a :href="item.href" target="_blank">{{ item.title }}</a>
          </h3>
          <div class="book-list">
            <ul>
              <li v-for="(d, inx) in item.list" :key="d.title">
                <div class="num-box">
                  <span>{{ inx + 1 }}</span>
                </div>
                <div class="name-box">
                  <a class="name" :href="d.href" target="_blank">{{
                    d.title
                  }}</a
                  ><i class="total">-</i>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="hot-classify-wrap">
        <ul>
          <li v-for="item in hot" :key="item.title">
            <h3 class="wrap-title lang">
              {{ item.title }}
            </h3>
            <dl class="hot-book-list">
              <dd v-for="d in item.list" :key="d.title">
                <span class="classify">{{ d.tag }}</span
                ><a
                  class="name"
                  href="//book.qidian.com/info/1033928754/"
                  target="_blank"
                  :title="d.title"
                  >{{ d.title }}</a
                >
              </dd>
            </dl>
          </li>
        </ul>
      </div>
    </a-spin>
  </div>
</template>

<script>
import { isMobile } from "@/plugins/utils";
import { getBookIndex } from "@/api/bookApi";
// 目录

export default {
  name: "bookIndex",
  data() {
    return {
      refreshLoading: false,
      noCover: require("@/assets/imgs/noCover.jpeg"),
      bookList: {
        top: [], // 榜单
        hot: [], // 热门
        newBook: [], // 新书
      },
    };
  },
  computed: {
    // 是否为移动端
    isMobileClass() {
      let isTrue = isMobile();
      return isTrue;
    },
    top() {
      return this.bookList.top ?? [];
    },
    hot() {
      return this.bookList.hot ?? [];
    },
    newBook() {
      return this.bookList.newBook ?? [];
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      // 重新搜索
      this.bookList = [];
      const key = "bookIndex@key";
      const cacheResult = sessionStorage.getItem(key);
      if (cacheResult) {
        this.bookList = JSON.parse(cacheResult);
      } else {
        // 打开遮罩
        this.refreshLoading = true;
        getBookIndex()
          .then((result) => {
            debugger;
            this.refreshLoading = false;
            this.bookList = result.data.data || {};
            this.bookList &&
              sessionStorage.setItem(key, JSON.stringify(this.bookList));
          })
          .catch(() => {
            this.refreshLoading = false;
          });
      }
    },
    // 获取书籍封面
    getImgUrl(item) {
      return this.getImages(item.imgSrc) || this.noCover;
    },
    getImages(_url) {
      if (_url !== undefined) {
        return "https://images.weserv.nl/?url=" + _url;
      }
    },
    // 返回首页
    goDetails(item) {
      this.$router.push({
        path: "/playing",
        query: {
          url: encodeURI(item.url),
          name: encodeURI(item.name),
          tag: encodeURI(item.tag),
        },
      });
    },
  },
};
</script>

<style scoped>
@import url("./css/indexResult.css");
</style>
