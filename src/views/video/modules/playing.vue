<template>
  <div class="video-result-wrap" :class="isMobileClass ? 'mobile' : ''">
    <!-- <video
      id="my-video"
      class="video-wrap vjs-default-skin vjs-big-play-centered"
      controls
      preload="auto"
      width="320"
      height="240"
    >
      <source :src="m3u8Src" type="application/x-mpegURL" />
    </video> -->

    <!-- <video
      ref="videoPlayer"
      controls
      :src="fileUrl"
      :poster="posterUrl"
      controlslist="nodownload"
      @play="toPlays"
      @timeupdate="updateTime"
      @pause="toPause"
      :class="[porel, fullwidth, mal, fla, mat, 'movie-show-video']"
      style="width: 100%; height: 100%; object-fit: fill"
    ></video>

    <li @click="toPlay">播放/暂停</li>
    <li @click="toForward">前进</li>
    <li @click="toBack">倒退</li>
    <li @click="addVoice">增加⾳量</li>
    <li @click="decrease">减⼩⾳量</li> -->

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
