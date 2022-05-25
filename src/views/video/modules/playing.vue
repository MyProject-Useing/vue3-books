<template>
  <div class="video-result-wrap" :class="isMobileClass ? 'mobile' : ''">
    <videoPlay
      v-bind="options"
      :src="src"
      :poster="baseImg"
      crossOrigin="anonymous"
      @error="error"
    />
  </div>
</template>

<script>
import "vue3-video-play/dist/style.css";
import { videoPlay } from "vue3-video-play";
import { isMobile } from "@/plugins/utils";
// import { getVideo } from "@/api/movieApi";
import { getVideoList } from "@/api/movieApi";

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
      debugger;
      getVideoList(encodeURI(this.palyUrl)).then((d) => {
        debugger;
        this.src = d.data.data;
      });

      // getVideo({ url: encodeURI(this.palyUrl) }).then((d) => {
      //   this.src = d.data.data;
      // });
    },
    error(res) {
      debugger;
      console.log(res);
    },
  },
};
</script>
<style scoped>
@import url("@/views/video/css/videoResult.css");
</style>
