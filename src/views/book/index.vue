<template>
  <div class="book-index-panle book-detail-wrap">
    <div class="book-information">
      <div class="book-img">
        <a-image
          class="book-img-src"
          :src="bookInfo.imgUrl"
          fallback="data:image/png;base64,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"
        >
        </a-image>
      </div>
      <div class="book-info">
        <h1>
          <em>我在异界肝经验</em>
          <span><span>卒印</span> 著</span>
        </h1>
        <p class="tag">
          <span class="blue">连载</span>
          <span class="blue">免费</span>
        </p>
        <p class="intro">小说简介</p>
        <p>
          <em><span class="szWntGoi">0</span></em
          ><cite>万字</cite><i>|</i> <em><span class="szWntGoi">0</span></em
          ><cite>总推荐</cite><i>|</i><em><span class="szWntGoi">0</span></em
          ><cite>周推荐</cite>
        </p>
        <p>
          <a
            class="blue-btn"
            href="//read.qidian.com/chapter/mT-d-k_P9qSIRkU8pnqrJw2/nqyNH8zOVm5OBDFlr9quQA2/"
            >免费试读</a
          ><a class="blue-btn add-book" href="javascript:">加入书架</a>
        </p>
      </div>
    </div>
    <div class="content-nav-wrap">
      <a-tabs v-model:activeKey="activeKey">
        <a-tab-pane key="1" tab="作品信息"
          ><div class="left-wrap fl">
            <div class="book-info-detail">
              <div class="book-intro">
                <p>{{ bookInfo.intro }}</p>
              </div>
              <div class="book-state">
                <ul>
                  <li class="update">
                    <b>最新章节</b>
                    <div class="detail">
                      <p class="cf charpter-container">
                        <a
                          class="blue charpter-link"
                          href="//read.qidian.com/chapter/mT-d-k_P9qSIRkU8pnqrJw2/JbcFH8tD4fFMs5iq0oQwLQ2/"
                          title="我在异界肝经验 第六十章 魄力在线阅读"
                          >第六十章 魄力</a
                        ><i>·</i><em class="time">18小时前</em>
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div></a-tab-pane
        >
        <a-tab-pane key="2" tab="目录" force-render
          >Content of Tab Pane 2</a-tab-pane
        >
      </a-tabs>
    </div>
  </div>
</template>

<script>
import request from "@/plugins/axios";
import { message } from "ant-design-vue";
export default {
  name: "bookIndex",
  data() {
    return {
      activeKey: "1",
      catalogList: [],
      bookLoading: false,
      bookInfo: {},
    };
  },
  // components: { DeleteOutlined },
  computed: {
    cacheBookList() {
      return this.$store.state.caches.readBooksList;
    },
  },
  activated() {
    this.init();
  },
  deactivated() {},
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.getCatalog(this.$route.query.bookUrl);
    },
    // 加载目录
    getCatalog(bookUrl) {
      let newUrl = unescape(bookUrl);
      let sessionData = JSON.parse(sessionStorage.getItem("catalog@" + newUrl));
      if (sessionData) {
        this.catalogList = sessionData.catalogList;
        this.bookInfo = sessionData.info;
      } else {
        this.bookLoading = true;
        request
          .post(this.$store.state.api + "api/common/getCatalog", {
            bookUrl: newUrl,
          })
          .then((result) => {
            if (result.data.data) {
              this.catalogList = result.data.data.catalogList;
              this.bookInfo = result.data.data.info;
              sessionStorage.setItem(
                "catalog@" + newUrl,
                JSON.stringify(result.data.data)
              );
            }
            this.bookLoading = false;
          })
          .catch(() => {
            this.bookLoading = false;
            message.error("获取目录失败。");
          });
      }
    },
  },
};
</script>

<style scoped>
@import url("./css/index.css");

.book-information .book-img img {
  width: 100%;
  height: 100%;
  -webkit-transition: -webkit-transform 0.3s ease-out;
  -moz-transition: -moz-transform 0.3s ease-out;
  -ms-transition: -ms-transform 0.3s ease-out;
  transition: transform 0.3s ease-out;
  color: #fcfcfa;
}

/*最新章节*/
.content-nav-wrap :deep(.left-wrap) {
  width: 700px;
  padding-bottom: 40px;
}

.content-nav-wrap :deep(.left-wrap) .book-info-detail {
  margin-bottom: 20px;
}

.content-nav-wrap :deep(.left-wrap) .book-intro {
  padding-bottom: 20px;
  border-bottom: 1px solid #e6e6e6;
}

.content-nav-wrap :deep(.left-wrap) .book-intro p {
  font: 14px/28px PingFangSC-Regular, "-apple-system", Simsun;
  overflow: hidden;
  margin: 0px;
  padding-left: 23px;
}

.content-nav-wrap :deep(.left-wrap) .book-state {
  position: relative;
  z-index: 2;
}

.content-nav-wrap :deep(.left-wrap) .book-state li b {
  font: 14px/24px PingFangSC-Regular, "-apple-system", Simsun;
  float: left;
  width: 98px;
  margin: 19px 20px 0 0;
  color: #999;
}

.content-nav-wrap :deep(.left-wrap) .book-state li.update .detail {
  border-bottom: none;
}
.content-nav-wrap :deep(.left-wrap) .book-state li .detail {
  float: left;
  width: 542px;
  padding: 20px 0;
  border-bottom: 1px solid #e6e6e6;
}

.content-nav-wrap
  :deep(.left-wrap)
  .book-state
  li.update
  .detail
  .charpter-container {
  display: inline-block;
  width: 260px;
  height: 22px;
  margin: 0px;
}

.content-nav-wrap
  :deep(.left-wrap)
  .book-state
  li.update
  .detail
  .charpter-link {
  overflow: hidden;
  max-width: 160px;
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
/*最新章节*/
</style>
