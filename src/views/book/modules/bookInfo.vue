<template>
  <div
    class="book-index-panle book-detail-wrap"
    :class="isMobileClass ? 'mobile' : ''"
  >
    <div class="book-index-bj"></div>
    <div class="book-index-mian">
      <a-page-header :breadcrumb="{ routes }" />
      <div class="book-index-content">
        <div class="book-information">
          <div class="book-img">
            <a-image
              class="book-img-src"
              :src="bookInfo.imgUrl"
              fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u7du3SXX7Xt7Z2enevHmzfQe+oSN2apSAPj09TSrb+XKI/f379+08+A0cNRE2ANkupk+ACNPvkSPcAAEibACyXUyfABGm3yNHuAECRNgAZLuYPgEirKlHu7u7XdyytGwHAd8jjNyng4OD7vnz51dbPT8/7z58+NB9+/bt6jU/TI+AGWHEnrx48eJ/EsSmHzx40L18+fLyzxF3ZVMjEyDCiEDjMYZZS5wiPXnyZFbJaxMhQIQRGzHvWR7XCyOCXsOmiDAi1HmPMMQjDpbpEiDCiL358eNHurW/5SnWdIBbXiDCiA38/Pnzrce2YyZ4//59F3ePLNMl4PbpiL2J0L979+7yDtHDhw8vtzzvdGnEXdvUigSIsCLAWavHp/+qM0BcXMd/q25n1vF57TYBp0a3mUzilePj4+7k5KSLb6gt6ydAhPUzXnoPR0dHl79WGTNCfBnn1uvSCJdegQhLI1vvCk+fPu2ePXt2tZOYEV6/fn31dz+shwAR1sP1cqvLntbEN9MxA9xcYjsxS1jWR4AIa2Ibzx0tc44fYX/16lV6NDFLXH+YL32jwiACRBiEbf5KcXoTIsQSpzXx4N28Ja4BQoK7rgXiydbHjx/P25TaQAJEGAguWy0+2Q8PD6/Ki4R8EVl+bzBOnZY95fq9rj9zAkTI2SxdidBHqG9+skdw43borCXO/ZcJdraPWdv22uIEiLA4q7nvvCug8WTqzQveOH26fodo7g6uFe/a17W3+nFBAkRYENRdb1vkkz1CH9cPsVy/jrhr27PqMYvENYNlHAIesRiBYwRy0V+8iXP8+/fvX11Mr7L7ECueb/r48eMqm7FuI2BGWDEG8cm+7G3NEOfmdcTQw4h9/55lhm7DekRYKQPZF2ArbXTAyu4kDYB2YxUzwg0gi/41ztHnfQG26HbGel/crVrm7tNY+/1btkOEAZ2M05r4FB7r9GbAIdxaZYrHdOsgJ/wCEQY0J74TmOKnbxxT9n3FgGGWWsVdowHtjt9Nnvf7yQM2aZU/TIAIAxrw6dOnAWtZZcoEnBpNuTuObWMEiLAx1HY0ZQJEmHJ3HNvGCBBhY6jtaMoEiJB0Z29vL6ls58vxPcO8/zfrdo5qvKO+d3Fx8Wu8zf1dW4p/cPzLly/dtv9Ts/EbcvGAHhHyfBIhZ6NSiIBTo0LNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiEC/wGgKKC4YMA4TAAAAABJRU5ErkJggg=="
            >
            </a-image>
          </div>
          <div class="book-info">
            <div class="book-info-details">
              <h1 class="ellipsis">
                <em class="book-info-title" :title="bookInfo.bookTitle">{{
                  bookInfo.bookTitle
                }}</em>
                <span class="book-info-author"
                  ><span>{{ bookInfo.author }}</span> 著</span
                >
              </h1>
              <template v-if="!isMobileClass">
                <p class="tag">
                  <span class="blue">连载</span>
                  <span class="blue">免费</span>
                </p>
                <p class="intro">小说简介</p>
                <p>
                  <em><span class="szWntGoi">0</span></em
                  ><cite>万字</cite><i>|</i>
                  <em><span class="szWntGoi">0</span></em
                  ><cite>总推荐</cite><i>|</i
                  ><em><span class="szWntGoi">0</span></em
                  ><cite>周推荐</cite>
                </p>
              </template>
            </div>
            <p class="book-info-btn">
              <a class="blue-btn" href="javascript:" @click="stillRead()">{{
                btnTitle
              }}</a>
              <!-- <a class="blue-btn add-book" href="javascript:">加入书架</a> -->
            </p>
          </div>
        </div>
        <div class="content-nav-wrap">
          <a-spin :spinning="bookLoading">
            <a-tabs v-model:activeKey="activeKey">
              <a-tab-pane key="1" tab="作品信息"
                ><div class="left-wrap">
                  <div class="book-info-detail">
                    <div class="book-intro">
                      <p>{{ bookInfo.intro }}</p>
                    </div>
                    <div class="book-state">
                      <ul>
                        <li>
                          <b v-if="!isMobileClass">最新章节</b>
                          <div class="detail">
                            <p
                              class="cf charpter-container"
                              v-for="item in catalogList
                                .concat([])
                                .reverse()
                                .splice(0, 10)"
                              :key="item.href"
                              @click="toBookIndex(item.href)"
                            >
                              <a
                                class="blue charpter-link"
                                href="javascript:"
                                :title="item.title"
                                >{{ item.title }}</a
                              ><i>·</i><em class="time">0小时前</em>
                            </p>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div></a-tab-pane
              >
              <a-tab-pane key="2" force-render class="catalog-tab">
                <template #tab>
                  <span class="catalog-tab-title">
                    目录<span>({{ catalogList.length }}章)</span>
                  </span>
                </template>
                <catalog
                  :bookUrl="bookUrl"
                  :catalogList="catalogList"
                  :useHead="false"
                  class="content"
                />
              </a-tab-pane>
            </a-tabs>
          </a-spin>
        </div>
      </div>
    </div>
    <a-back-top />
  </div>
</template>

<script>
import { message } from "ant-design-vue";
import { isMobile } from "@/plugins/utils";
// 目录
import catalog from "./catalogList.vue";

import { getBookInfo } from "@/api/bookApi";

export default {
  name: "bookIndex",
  components: { catalog },
  data() {
    return {
      activeKey: "1",
      catalogList: [],
      bookLoading: false,
      bookInfo: {},
    };
  },
  computed: {
    bookUrl() {
      return decodeURI(this.$route.query.url || "");
    },

    routes() {
      let bookTitle = this.bookInfo.bookTitle;
      return [
        {
          path: "/",
          breadcrumbName: "首页",
        },
        {
          path: "/searchResult",
          breadcrumbName: "搜索结果",
        },
        {
          path: "second",
          breadcrumbName: bookTitle,
        },
      ];
    },

    // 是否为移动端
    isMobileClass() {
      let isTrue = isMobile();
      return isTrue;
    },

    // 书架列表
    cacheBookList() {
      return this.$store.state.caches.readBooksList;
    },

    // 按钮文字
    btnTitle() {
      return this.cacheBookList[this.bookUrl] &&
        this.cacheBookList[this.bookUrl].readUrl
        ? "继续阅读"
        : "免费阅读";
    },

    bookApi() {
      return this.$store.state.book.api;
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      if (this.bookUrl) {
        this.getInfo(this.bookUrl);
      }
    },
    // 加载目录
    getInfo() {
      debugger;
      const sessionKey = "catalog@" + this.bookUrl;
      let sessionData = JSON.parse(sessionStorage.getItem(sessionKey));
      if (sessionData) {
        this.catalogList = sessionData.catalogList;
        this.bookInfo = sessionData.info;
      } else {
        this.bookLoading = true;
        getBookInfo({ url: this.bookUrl })
          .then((result) => {
            if (result.data.data) {
              debugger;
              this.catalogList = result.data.data.catalogList;
              this.bookInfo = result.data.data.info;
              sessionStorage.setItem(
                sessionKey,
                JSON.stringify(result.data.data)
              );
              // 加入书架 缓存
              this.$store.commit("caches/setBooksList", {
                ...this.bookInfo,
                bookUrl: this.bookUrl,
              });
            }
            this.bookLoading = false;
          })
          .catch(() => {
            this.bookLoading = false;
            message.error("获取目录失败。");
          });
      }
    },
    // 书籍详情
    toBookIndex(href) {
      if (!this.bookUrl) {
        return;
      }
      let readUrl = href || this.catalogList[0].href;
      this.$router.push({
        path: "/readBooks",
        query: {
          bookUrl: encodeURI(this.bookUrl),
          readUrl: encodeURI(readUrl || ""),
        },
      });
    },
    // 继续阅读
    stillRead() {
      let href =
        this.cacheBookList[this.bookUrl] &&
        this.cacheBookList[this.bookUrl].readUrl
          ? this.cacheBookList[this.bookUrl].readUrl
          : "";

      this.toBookIndex(href);
    },
  },
};
</script>

<style scoped>
@import url("../css/bookInfo.css");

.book-index-mian .ant-page-header {
  height: 263px;
}

.book-information .book-img :deep(.ant-image) {
  width: 100%;
  height: 100%;
}

/*最新章节*/
.content-nav-wrap :deep(.left-wrap) {
  width: 100%;
  border-bottom: 1px solid #e6e6e6;
}

.content-nav-wrap :deep(.left-wrap) .book-intro {
  border-bottom: 1px solid #e6e6e6;
  padding-bottom: 15px;
}

.content-nav-wrap :deep(.left-wrap) .book-intro p {
  font: 14px/28px PingFangSC-Regular, "-apple-system", Simsun;
  overflow: hidden;
  margin: 0px;
  text-indent: 22px;
}

.content-nav-wrap :deep(.left-wrap) .book-state {
  position: relative;
}

.content-nav-wrap :deep(.left-wrap) .book-state ul {
  margin: 0;
  padding: 0;
}

.content-nav-wrap :deep(.left-wrap) .book-state li b {
  font: 14px/24px PingFangSC-Regular, "-apple-system", Simsun;
  float: left;
  width: 98px;
  margin: 19px 20px 0 0;
  color: #999;
}

.content-nav-wrap :deep(.left-wrap) .book-state li .detail {
  padding: 20px 0;
}

.content-nav-wrap :deep(.left-wrap) .book-state .detail .charpter-container {
  display: inline-block;
  height: 22px;
  margin: 0px;
  width: 100%;
}

.content-nav-wrap :deep(.left-wrap) .book-state .detail .charpter-link {
  overflow: hidden;
  max-width: calc(100% - 80px);
  white-space: nowrap;
  text-overflow: ellipsis;
}

.content-nav-wrap :deep(.left-wrap) .book-state li .detail p i {
  font-family: Arial;
  margin: 2px 10px 0;
  color: #a6a6a6;
}

.content-nav-wrap :deep(.left-wrap) .book-state li .detail .time,
.content-nav-wrap :deep(.left-wrap) .book-state li .detail a.blue,
.content-nav-wrap :deep(.left-wrap) .book-state li .detail i {
  float: left;
  display: inline-block;
  vertical-align: middle;
}

.content-nav-wrap :deep(.left-wrap) .book-state li em.null,
.content-nav-wrap :deep(.left-wrap) .book-state li em.time {
  color: #999;
}
.blue {
  color: #3f5a93;
}

.book-img :deep(.ant-image) .book-img-src {
  height: 100%;
}

/*最新章节*/

/*目录*/

.content-nav-wrap :deep(.ant-tabs-tab) {
  color: #a6a6a6;
}

.content-nav-wrap :deep(.ant-tabs-nav)::before {
  border-bottom: 1px solid #e6e6e6;
}

.catalog-tab-title span {
  font-size: 14px;
}

.catalog-tab .volume li {
  font: 14px/40px PingFangSC-Regular, "-apple-system", Simsun;
  float: left;
  overflow: hidden;
  width: 350px;
  height: 40px;
  padding-right: 60px;
  border-bottom: 1px solid #ebebeb;
}

.catalog-tab .book_name {
  font-weight: 400;
  display: inline-block;
  vertical-align: middle;
  color: #262626;
}

/*目录*/

/*移动端*/
.mobile .book-index-mian .ant-page-header {
  height: 12rem;
}

/*移动端*/
</style>
