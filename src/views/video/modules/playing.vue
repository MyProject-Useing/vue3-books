<template>
  <div class="playing-wrap" :class="isMobileClass ? 'mobile' : ''">
    <div class="playing-main">
      <a-page-header :breadcrumb="{ routes }" />
      <div class="plp-l">
        <videoPlay
          class="video-use"
          v-bind="options"
          :src="src"
          :poster="baseImg"
          crossOrigin="anonymous"
          @error="error"
        />
      </div>

      <div class="plp-r">
        <div class="list-title">
          <h4 title="资源列表" class="ellipsis">资源列表</h4>
          <span class="mode-change" style="position: relative"
            ><menu-unfold-outlined />
          </span>
          <!-- <span class="ep-list-progress">53/53</span> -->
        </div>
        <div class="list-wrapper">
          <div class="list-wrapper-item recommend-tip">
            <span class="tip-left">电影</span>
            <span class="tip-right">放映时间</span>
          </div>
          <div
            class="list-wrapper-item"
            v-for="(item, index) in sourceList"
            :key="index"
          >
            <a
              class="tip-left"
              :class="isActive(item)"
              @click="changeSrc(item)"
            >
              {{ item.name }} <i class="playing-icon"></i>
            </a>
            <span class="tip-right">{{ item.year }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "vue3-video-play/dist/style.css";
import { videoPlay } from "vue3-video-play";
import { isMobile } from "@/plugins/utils";
// import { getVideoAnalysis, getVideo } from "@/api/movieApi";
import { getVideo } from "@/api/movieApi";
import { MenuUnfoldOutlined } from "@ant-design/icons-vue";

export default {
  name: "bookResult",
  components: {
    videoPlay,
    MenuUnfoldOutlined,
  },
  computed: {
    // 是否为移动端
    isMobileClass() {
      let isTrue = isMobile();
      return isTrue;
    },
    palyUrl() {
      return unescape(this.$route.query.url || "");
    },
    routes() {
      // let bookTitle = this.bookInfo.bookTitle;
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
          breadcrumbName: "当前播放",
        },
      ];
    },
  },
  data() {
    return {
      baseImg: require("@/assets/imgs/video/play_base.jpg"),
      sourceList: [],
      src: "",
      options: {
        width: "800px", //播放器高度
        height: "450px", //播放器高度
        color: "#409eff", //主题色
        title: "", //视频名称
        type: "m3u8", //视频类型
        muted: false, //静音
        webFullScreen: false,
        speedRate: ["0.75", "1.0", "1.25", "1.5", "2.0"], //播放倍速
        notSupportedMessage: "此视频暂无法播放，请稍后再试",
        autoPlay: false, //自动播放
        loop: false, //循环播放
        mirror: false, //镜像画面
        ligthOff: false, //关灯模式
        volume: 0.3, //默认音量大小
        control: true, //是否显示控制
        controlBtns: [
          "audioTrack",
          "quality",
          "speedRate",
          "volume",
          "setting",
          "pip",
          "pageFullScreen",
          "fullScreen",
        ], //显示所有按钮,
      },
    };
  },
  mounted() {
    this.getM3u8Url();
  },
  methods: {
    isActive(item) {
      return decodeURI(item.source.eps[0].url) === decodeURI(this.src)
        ? "active"
        : "";
    },
    getM3u8Url() {
      let url = encodeURI(this.palyUrl);
      let resData = sessionStorage.getItem("video_paly_session@" + url);
      if (resData) {
        this.sourceList = JSON.parse(resData);
        this.src = this.sourceList[0].source.eps[0].url;
      } else {
        // getVideoAnalysis({ url: url })
        //   .then((d) => {
        //     if (d.data.data) {
        //       this.sourceList = d.data.data || [];
        //       this.src = d.data.data[0].source.eps[0].url;
        //       sessionStorage.setItem(
        //         "video_paly_session@" + url,
        //         JSON.stringify(d.data.data)
        //       );
        //     }
        //   })
        //   .catch((d) => {
        //     console.log(d);
        //   });
        getVideo({ url: url })
          .then((d) => {
            if (d.data.data) {
              // this.sourceList = d.data.data || [];
              this.src = d.data.data;
              // sessionStorage.setItem(
              //   "video_paly_session@" + url,
              //   JSON.stringify(d.data.data)
              // );
            }
          })
          .catch((d) => {
            console.log(d);
          });
      }
    },
    changeSrc(item) {
      this.src = decodeURI(item.source.eps[0].url);
    },
    error() {},
  },
};
</script>
<style scoped>
@import url("@/views/video/css/playing.css");
</style>
