<template>
  <div class="video-result-wrap" :class="isMobileClass ? 'mobile' : ''">
    <video id="my-video" controls preload="auto" width="320" height="240">
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
      studyTime: {
        currentTime: 0, // 当前已学时长
        duration: 0, // 总时长
      },
      m3u8Src: "https://new.iskcd.com/20211218/u4JqnSI6/1100kb/hls/index.m3u8",
    };
  },
  mounted() {
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
    // 初始化视频
    getVideo() {
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

    // 切换视频
    checkVideo() {
      var myPlayer = videojs("my-video");
      myPlayer.src([
        {
          type: "application/x-mpegURL",
          src: this.m3u8Src, //CCTV3频道
        },
      ]);
      myPlayer.play();
    },
  },
};
</script>
<style scoped>
@import url("@/views/video/css/videoResult.css");
</style>
