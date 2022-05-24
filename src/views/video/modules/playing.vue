<template>
  <div class="video-result-wrap" :class="isMobileClass ? 'mobile' : ''">
    <videoPlay v-bind="options" :poster="baseImg" />
  </div>
</template>

<script>
import "vue3-video-play/dist/style.css";
import { videoPlay } from "vue3-video-play";
import { isMobile } from "@/plugins/utils";
import { getVideo } from "@/api/movieApi";
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
      options: {
        width: "800px", //播放器高度
        height: "450px", //播放器高度
        color: "#409eff", //主题色
        title: "", //视频名称
        type: "m3u8", //视频类型
        // src: "https://api.nxflv.com/Cache/M3u8/f293b2503ae408813cee8db557d0cc01.m3u8",
        muted: false, //静音
        webFullScreen: false,
        speedRate: ["0.75", "1.0", "1.25", "1.5", "2.0"], //播放倍速
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
      getVideo({ url: encodeURI(this.palyUrl) }).then((d) => {
        debugger;
        this.options.src = d.data;
      });
    },
  },
};
</script>
<style scoped>
@import url("@/views/video/css/videoResult.css");
</style>
