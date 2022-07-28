<template>
  <div class="video-result-wrap" :class="isMobileClass ? 'mobile' : ''">
    <div class="filter-header">
      <a href="javascript:;" class="header-item current">全部频道</a>
      <a href="javascript:;" class="header-item">电视剧</a>
      <a href="javascript:;" class="header-item">电影</a>
      <a href="javascript:;" class="header-item">综艺</a>
      <a href="javascript:;" class="header-item">动漫</a>
      <a href="javascript:;" class="header-item">纪录片</a>
    </div>

    <Spin :spinning="refreshLoading">
      <div class="result-wrap">
        <Empty v-if="videoList.length === 0" description="暂无数据" />
        <div v-else class="result-content">
          <div class="video-item" v-for="(item, bi) in videoList" :key="bi">
            <div class="result-left">
              <Image
                class="img-info"
                :src="getImgUrl(item)"
                :preview="false"
                fallback="data:image/png;base64,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"
              >
              </Image>
              <div v-if="item.palyTime" class="play-time">
                <span class="qy-mod-label"> {{ item.palyTime }}</span>
              </div>
            </div>
            <div class="result-right">
              <h3 class="info-title">
                <span class="item-type">{{ item.tag }}</span>
                <a
                  class="item-title orange ellipsis"
                  target="_blank"
                  :title="item.title"
                  @click="toPaly(item)"
                >
                  {{ item.title }}
                </a>
                <em class="year">{{ item.year }}</em>
                <div class="title-right">
                  <a :href="item.palySrc" target="_blank" title="视频源地址">
                    <em class="player-name">{{ item.siteName }}</em></a
                  >
                  <em class="score" title="评分"> {{ item.score }}</em>
                </div>
              </h3>
              <div class="result-info half ellipsis" v-if="item.alias">
                <label class="info-lbl">别名:</label>
                <span :title="item.alias" class="info-des">{{
                  item.alias
                }}</span>
              </div>
              <div
                class="result-info half ellipsis"
                v-if="item.director && item.director.length != 0"
              >
                <label class="info-lbl">导演:</label>
                <span
                  :title="item.director ? item.director.join('/') : ''"
                  class="info-des"
                  >{{ item.director ? item.director.join("/") : "" }}</span
                >
              </div>
              <div class="result-info half ellipsis" v-if="item.actor">
                <label class="info-lbl">主演:</label>
                <span
                  :title="item.actor ? item.actor.join('/') : ''"
                  class="info-des"
                  >{{ item.actor ? item.actor.join("/") : "" }}</span
                >
              </div>
              <div class="result-info half ellipsis" v-if="item.region">
                <label class="info-lbl">地区:</label>
                <span :title="item.region" class="info-des">{{
                  item.region
                }}</span>
              </div>
              <div class="result-info ellipsis">
                <label class="info-lbl">简介:</label>
                <span :title="item.desc" class="info-des">{{ item.desc }}</span>
              </div>
              <div
                class="result-bottom-pos"
                v-if="!item.videoinfos || item.videoinfos.length === 0"
              >
                <a
                  href="javascript:void(0);"
                  class="search-result-btn"
                  @click.stop="toPaly(item)"
                  ><i class="btn-icon icon-arrow"></i>立即播放
                </a>
              </div>
              <div v-else class="search-result-album">
                <ul
                  class="album-list"
                  :class="item.tag === '综艺' ? 'variety-list' : ''"
                >
                  <li
                    class="album-item"
                    v-for="info in item.videoinfos"
                    :key="info.url"
                  >
                    <a
                      @click="jumpIndex(item, info)"
                      href="javascript:void(0);"
                      :title="info.name"
                      class="album-link"
                      ><span>{{
                        item.tag === "综艺" ? info.name : info.order
                      }}</span></a
                    >
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <BackTop />
      </div>
    </Spin>
  </div>
</template>

<script>
import { isMobile, getCacheImages } from "@/plugins/utils.js";
// 视频内容
import { getDataList as movie_GetList } from "@/api/movieApi";

import { message, Image, Spin, Empty, BackTop } from "ant-design-vue";

// 书籍详情
export default {
  name: "videoResult",
  components: {
    Image,
    Spin,
    Empty,
    BackTop,
  },

  computed: {
    // 是否为移动端
    isMobileClass() {
      return isMobile();
    },
  },
  data() {
    return {
      currPath: "/videoResult",

      // 查询关键字
      keywords: "",

      // 查询遮罩框
      refreshLoading: false,

      // 视频结果
      videoList: [],
    };
  },
  created() {
    this.init();
  },
  watch: {
    $route(to) {
      if (this.currPath === to.path) {
        this.init();
      }
    },
  },
  methods: {
    init() {
      if (this.keywords === this.$route.query.keywords) {
        return false;
      }
      this.keywords = this.$route.query.keywords;
      this.search();
    },
    // 通用查询 --分配查询 书籍还是视频
    search() {
      this.keywords && this.searchVideo();
    },
    // 查询视频内容
    searchVideo() {
      // 重新搜索
      this.videoList = [];
      const key = "vodeiResult@key" + this.keywords;
      const cacheResult = sessionStorage.getItem(key);
      if (cacheResult) {
        this.videoList = JSON.parse(cacheResult);
      } else {
        const params = { keywords: this.keywords };
        // 打开遮罩
        this.refreshLoading = true;
        movie_GetList(params)
          .then((result) => {
            this.refreshLoading = false;
            this.videoList = result.data.data || [];
            this.videoList &&
              this.videoList.length > 0 &&
              sessionStorage.setItem(key, JSON.stringify(this.videoList));
          })
          .catch(() => {
            this.refreshLoading = false;
          });
      }
    },
    // 获取书籍封面
    getImgUrl(item) {
      return getCacheImages(item.imgSrc);
    },
    // 播放视频
    toPaly(item) {
      if (!item.palySrc) {
        return message.warning("未找到资源路径，无法正常播放。");
      }
      this.$router.push({
        path: item.hasVip ? "/videoPlaying" : "/videoiframe",
        query: {
          url: encodeURI(item.palySrc),
          // tag: encodeURI(item.tag),
          name: encodeURI(item.title),
          order: item.order ?? null,
        },
      });
    },
    // 查看具体某一集
    jumpIndex(item, info) {
      if (!item.palySrc) {
        return message.warning("未找到资源路径，无法正常播放。");
      }
      if (!info.url) {
        return message.warning("未找到资源路径，无法正常播放。");
      }
      this.toPaly({
        palySrc: info.url,
        hasVip: item.hasVip,
        tag: item.tag,
        title: item.title,
        order: info.order,
      });
    },
  },
};
</script>

<style lang="less" scoped>
@import url("@/views/video/css/videoResult.less");
</style>
