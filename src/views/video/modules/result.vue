<template>
  <div class="video-result-wrap" :class="isMobileClass ? 'mobile' : ''">
    <video
      class="tvhou"
      width="320"
      height="240"
      controls="controls"
      autoplay="autoplay"
      x-webkit-airplay="true"
      x5-video-player-fullscreen="true"
      preload="auto"
      playsinline="true"
      webkit-playsinline
      x5-video-player-typ="h5"
    >
      <source
        type="application/x-mpegURL"
        src="https://new.iskcd.com/20211218/u4JqnSI6/1100kb/hls/index.m3u8"
      />
    </video>
    <video id="my-video" controls preload="auto" width="500px">
      <source
        src="https://new.iskcd.com/20211218/u4JqnSI6/1100kb/hls/index.m3u8"
        type="application/x-mpegURL"
      />
    </video>
  </div>
</template>

<script>
import "video.js/dist/video-js.css";
import "videojs-contrib-hls";
import videojs from "video.js";

import { isMobile } from "@/plugins/utils";

export default {
  name: "bookResult",
  data() {
    return {
      // 数据列表
      noCover: require("@/assets/imgs/noCover.jpeg"),
      iSrc: "https://m3u8.okjx.cc:3389/m13.php?url=https://www.iqiyi.com/v_26cxipz70mw.html?vfrm=pcw_playpage",
      src: "https://hey05.789zy.cc/20211218/u4JqnSI6/1100kb/hls/LmQrComs.ts",
      studyTime: {
        currentTime: 0, // 当前已学时长
        duration: 0, // 总时长
      },
      m3u8Src: "https://new.iskcd.com/20211218/u4JqnSI6/1100kb/hls/index.m3u8",
    };
  },
  mounted() {
    // this.initVideo(this.m3u8Src);

    this.getVideo();
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
    getVideo() {
      debugger;
      videojs(
        "my-video",
        {
          bigPlayButton: false,
          textTrackDisplay: false,
          posterImage: true,
          errorDisplay: false,
          controlBar: true,
        },
        function () {
          this.play();
        }
      );
    },

    initVideo(nowPlayVideoUrl) {
      debugger;
      // 这些options属性也可直接设置在video标签上，见 muted
      let options = {
        autoplay: true, // 设置自动播放
        controls: true, // 显示播放的控件
        sources: [
          // 注意，如果是以option方式设置的src,是不能实现 换台的 (即使监听了nowPlayVideoUrl也没实现)
          {
            src: nowPlayVideoUrl,
            type: "application/x-mpegURL", // 告诉videojs,这是一个hls流
          },
        ],
      }; // videojs的第一个参数表示的是，文档中video的id
      const myPlyer = videojs("videoPlayer", options, function onPlayerReady() {
        console.log("onPlayerReady 中的this指的是：", this); // 这里的this是指Player,是由Videojs创建出来的实例
        console.log(myPlyer === this); // 这里返回的是true
      });
    },
  },
};
</script>
<style scoped>
@import url("@/views/video/css/videoResult.css");
</style>
