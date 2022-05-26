<template>
  <div class="playing-result-wrap" :class="isMobileClass ? 'mobile' : ''">
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
      <div class="ep-list-wrapper report-wrap-module">
        <div class="list-title clearfix">
          <h4 title="资源列表">资源列表</h4>
          <span class="mode-change" style="position: relative"
            ><i
              report-id="click_ep_switch"
              class="iconfont icon-ep-list-simple"
            ></i>
          </span>
          <span class="ep-list-order"></span>
          <span class="ep-list-progress">53/53</span>
        </div>
        <div class="list-wrapper simple longlist">
          <ul>
            <li></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "vue3-video-play/dist/style.css";
import { videoPlay } from "vue3-video-play";
import { isMobile } from "@/plugins/utils";
import { getVideoAnalysis } from "@/api/movieApi";
export default {
  name: "bookResult",
  components: {
    videoPlay,
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
    getM3u8Url() {
      getVideoAnalysis({ url: encodeURI(this.palyUrl) })
        .then((d) => {
          this.sourceList = d.data.data;
          this.src = d.data.data[0].source.eps[0].url;
        })
        .catch((d) => {
          console.log(d);
        });
    },
    error() {},
  },
};
</script>
<style scoped>
@import url("@/views/video/css/playing.css");
</style>
