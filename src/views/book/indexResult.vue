<template>
  <div class="book-index-wrap">
    <a-spin :spinning="refreshLoading">
      <div id="rank-list-row" class="rank-list-row cf mb20">
        <div class="rank-list">
          <h3 class="wrap-title lang">
            <a href="https://www.qidian.com/rank/yuepiao/" target="_blank"
              >月票榜<i>·</i>VIP新作</a
            >
          </h3>
          <div class="book-list">
            <ul>
              <li>
                <div class="num-box"><span class="num2">2</span></div>
                <div class="name-box">
                  <a
                    class="name"
                    href="//book.qidian.com/info/1033523308/"
                    target="_blank"
                    >捕星之执宰星河</a
                  ><i class="total">20974</i>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div class="rank-list sort-list">
          <h3 class="wrap-title lang">
            <a href="https://www.qidian.com/rank/hotsales/" target="_blank"
              >畅销榜</a
            ><a
              class="more"
              href="//www.qidian.com/rank/hotsales/"
              data-eid="qd_A118"
              rel="nofollow"
              target="_blank"
              >更多<em class="iconfont"></em></a
            >
          </h3>
          <div class="book-list">
            <ul>
              <li data-rid="2">
                <div class="num-box"><span class="num2">2</span></div>
                <div class="name-box">
                  <a
                    class="name"
                    href="//book.qidian.com/info/1021617576/"
                    target="_blank"
                    data-eid="qd_A117"
                    data-bid="1021617576"
                    >夜的命名术</a
                  ><span class="iconfont"></span>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div class="rank-list sort-list">
          <h3 class="wrap-title lang">
            <a href="https://www.qidian.com/rank/newfans/" target="_blank"
              >粉丝榜</a
            ><a
              class="more"
              href="//www.qidian.com/rank/newfans/"
              rel="nofollow"
              target="_blank"
              data-eid="qd_A118"
              >更多<em class="iconfont"></em></a
            >
          </h3>
          <div class="book-list">
            <ul>
              <li data-rid="2">
                <div class="num-box"><span class="num2">2</span></div>
                <div class="name-box">
                  <a
                    class="name"
                    href="//book.qidian.com/info/1021617576/"
                    target="_blank"
                    data-eid="qd_A117"
                    data-bid="1021617576"
                    >夜的命名术</a
                  ><span class="iconfont"></span>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div class="rank-list sort-list">
          <h3 class="wrap-title lang">
            <a href="https://www.qidian.com/rank/readindex/" target="_blank"
              >阅读指数榜</a
            >
          </h3>
          <div class="book-list">
            <ul>
              <li data-rid="2">
                <div class="num-box"><span class="num2">2</span></div>
                <div class="name-box">
                  <a
                    class="name"
                    href="//book.qidian.com/info/1021617576/"
                    target="_blank"
                    data-eid="qd_A117"
                    data-bid="1021617576"
                    >夜的命名术</a
                  ><span class="iconfont"></span>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div class="rank-list sort-list mr0">
          <h3 class="wrap-title lang">
            <a href="https://www.qidian.com/rank/signnewbook/" target="_blank"
              >签约作者新书榜</a
            ><a
              class="more"
              href="//www.qidian.com/rank/signnewbook/"
              rel="nofollow"
              target="_blank"
              data-eid="qd_A118"
              >更多<em class="iconfont"></em></a
            >
          </h3>
          <div class="book-list">
            <ul>
              <li>
                <div class="num-box"><span class="num2">2</span></div>
                <div class="name-box">
                  <a
                    class="name"
                    href="//book.qidian.com/info/1033914374/"
                    target="_blank"
                    >唐人的餐桌</a
                  ><span class="iconfont"></span>
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
