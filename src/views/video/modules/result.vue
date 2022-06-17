<template>
  <div class="video-wrap" :class="isMobileClass ? 'mobile' : ''">
    <div class="video-panle">
      <a-empty v-if="dataList.length === 0" description="暂无数据" />
      <div v-else class="video-item-wrap">
        <div class="video-item" v-for="(item, bi) in dataList" :key="bi">
          <div class="result-figure">
            <a-image
              class="movie-img"
              :src="getImgUrl(item)"
              fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u7du3SXX7Xt7Z2enevHmzfQe+oSN2apSAPj09TSrb+XKI/f379+08+A0cNRE2ANkupk+ACNPvkSPcAAEibACyXUyfABGm3yNHuAECRNgAZLuYPgEirKlHu7u7XdyytGwHAd8jjNyng4OD7vnz51dbPT8/7z58+NB9+/bt6jU/TI+AGWHEnrx48eJ/EsSmHzx40L18+fLyzxF3ZVMjEyDCiEDjMYZZS5wiPXnyZFbJaxMhQIQRGzHvWR7XCyOCXsOmiDAi1HmPMMQjDpbpEiDCiL358eNHurW/5SnWdIBbXiDCiA38/Pnzrce2YyZ4//59F3ePLNMl4PbpiL2J0L979+7yDtHDhw8vtzzvdGnEXdvUigSIsCLAWavHp/+qM0BcXMd/q25n1vF57TYBp0a3mUzilePj4+7k5KSLb6gt6ydAhPUzXnoPR0dHl79WGTNCfBnn1uvSCJdegQhLI1vvCk+fPu2ePXt2tZOYEV6/fn31dz+shwAR1sP1cqvLntbEN9MxA9xcYjsxS1jWR4AIa2Ibzx0tc44fYX/16lV6NDFLXH+YL32jwiACRBiEbf5KcXoTIsQSpzXx4N28Ja4BQoK7rgXiydbHjx/P25TaQAJEGAguWy0+2Q8PD6/Ki4R8EVl+bzBOnZY95fq9rj9zAkTI2SxdidBHqG9+skdw43borCXO/ZcJdraPWdv22uIEiLA4q7nvvCug8WTqzQveOH26fodo7g6uFe/a17W3+nFBAkRYENRdb1vkkz1CH9cPsVy/jrhr27PqMYvENYNlHAIesRiBYwRy0V+8iXP8+/fvX11Mr7L7ECueb/r48eMqm7FuI2BGWDEG8cm+7G3NEOfmdcTQw4h9/55lhm7DekRYKQPZF2ArbXTAyu4kDYB2YxUzwg0gi/41ztHnfQG26HbGel/crVrm7tNY+/1btkOEAZ2M05r4FB7r9GbAIdxaZYrHdOsgJ/wCEQY0J74TmOKnbxxT9n3FgGGWWsVdowHtjt9Nnvf7yQM2aZU/TIAIAxrw6dOnAWtZZcoEnBpNuTuObWMEiLAx1HY0ZQJEmHJ3HNvGCBBhY6jtaMoEiJB0Z29vL6ls58vxPcO8/zfrdo5qvKO+d3Fx8Wu8zf1dW4p/cPzLly/dtv9Ts/EbcvGAHhHyfBIhZ6NSiIBTo0LNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiEC/wGgKKC4YMA4TAAAAABJRU5ErkJggg=="
            >
            </a-image>
            <div v-if="item.palyTime" class="icon-br">
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
                @click.stop="toPaly(item)"
              >
                {{ item.title }}
              </a>
              <em class="year">{{ item.year }}</em>
              <span class="title-right">
                <a :href="item.palySrc" target="_blank">
                  <em class="player-name">{{ item.siteName }}</em></a
                >
                <em class="score"> {{ item.score }}</em>
              </span>
            </h3>
            <div class="result-info half ellipsis" v-if="item.alias">
              <label class="info-lbl">别名:</label>
              <span :title="item.alias" class="info-des">{{ item.alias }}</span>
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
            <!-- <div class="result-info half ellipsis" v-if="item.releaseTime">
              <label class="info-lbl">上映时间:</label>
              <span :title="item.releaseTime" class="info-des">{{
                item.releaseTime
              }}</span>
            </div> -->
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
              <div style="display: none">
                <a href="javascript:void(0);" class="link-packup">收起</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <a-back-top />
    </div>
  </div>
</template>

<script>
import { isMobile } from "@/plugins/utils";
import { message } from "ant-design-vue";

export default {
  name: "videoResult",
  components: {},
  data() {
    return {
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
    getImgUrl(item) {
      return this.getImages(item.imgSrc) || this.noCover;
    },

    getImages(_url) {
      if (_url !== undefined) {
        let _u = _url.substring(7);
        return "https://images.weserv.nl/?url=" + _u;
      }
    },
    // 书籍详情
    toPaly(item) {
      if (!item.palySrc) {
        return message.warning("未找到资源路径，无法正常播放。");
      }

      this.$router.push({
        path: item.hasVip ? "/playing" : "/videoiframe",
        query: { url: encodeURI(item.palySrc) },
      });
    },

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
      });
    },
  },
};
</script>
<style scoped>
@import url("@/views/video/css/videoResult.css");
</style>
