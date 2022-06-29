<template>
  <div class="book-index-wrap">
    <a-spin :spinning="refreshLoading">
      <div class="new-rec-wrap">
        <h3 class="wrap-title lang">{{ newBook.title }}</h3>
        <div class="center-book-list fl">
          <ul>
            <li v-for="item in newBook.list" :key="item.title">
              <div class="book-img">
                <a-image
                  class="cover"
                  :src="item.imgSrc"
                  :preview="false"
                  @click.stop="jumpInfo(item)"
                  fallback="data:image/png;base64,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"
                >
                </a-image>
              </div>
              <div class="book-info">
                <h3>
                  <a :title="item.title" @click.stop="jumpInfo(item)">{{
                    item.title
                  }}</a>
                </h3>
                <p>{{ item.desc }}</p>
                <div class="state-box cf">
                  <user-outlined />
                  <span class="author">{{ item.author }}</span>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div class="hot-classify-wrap">
        <div>
          <ul>
            <li v-for="item in hot" :key="item.title">
              <h3 class="wrap-title lang">
                {{ item.title }}
              </h3>
              <dl class="hot-book-list">
                <dd v-for="d in item.list" :key="d.title">
                  <span class="classify">{{ d.tag }}</span
                  ><a class="name" @click.stop="jumpInfo(d)" :title="d.title">{{
                    d.title
                  }}</a>
                </dd>
              </dl>
            </li>
          </ul>
          <div style="clear: both"></div>
        </div>
      </div>

      <div class="rank-list-row">
        <div class="rank-list" v-for="item in top" :key="item.title">
          <h3 class="wrap-title lang">
            <a @click.stop="jumpInfo(item)" target="_blank">{{ item.title }}</a>
          </h3>
          <div class="book-list">
            <ul>
              <li v-for="(d, inx) in item.list" :key="d.title">
                <div class="num-box">
                  <span>{{ inx + 1 }}</span>
                </div>
                <div class="name-box">
                  <a class="name" @click.stop="jumpInfo(d)">{{ d.title }}</a
                  ><i class="total">-</i>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </a-spin>
  </div>
</template>

<script>
import { isMobile } from "@/plugins/utils";
import { getBookIndex } from "@/api/bookApi";
// 目录
import { UserOutlined } from "@ant-design/icons-vue";

export default {
  name: "bookIndex",
  components: { UserOutlined },
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
      return (this.bookList.newBook ?? [])[0] || {};
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
    jumpInfo(item) {
      this.$router.push({
        path: "/bookInfo",
        query: {
          url: encodeURI(item.href),
        },
      });
    },
  },
};
</script>

<style scoped>
@import url("./css/index.css");
</style>
