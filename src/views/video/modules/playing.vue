<template>
  <div class="video-result-wrap" :class="isMobileClass ? 'mobile' : ''">
    <video
      id="my-video"
      class="video-wrap vjs-default-skin vjs-big-play-centered"
      controls
      preload="auto"
      width="320"
      height="240"
    >
      <source
        src="https://json.nbjx.vip:4399/Cache/d458809227be860cda8a4ca4a7be65eb/00eah6mspqaDab8XZAviZAIddJeorZZ8d6y7dgYvKFca3GtfHPYGe37ajpfsvzoMwa2X4Md42vq_0gAHrDqnqNuWsEp7Fu04w8IjfQqC.m3u8"
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
  methods: {
    // 初始化视频
    getVideo() {
      // 播放 this.play()
      // 停止 – video没有stop方法，可以用pause 暂停获得同样的效果
      // 暂停 this.pause()
      // 销毁 this.dispose()
      // 监听 this.on(‘click‘,fn)
      // 触发事件this.trigger(‘dispose‘)
      debugger;
      videojs(
        "my-video",
        {
          bigPlayButton: false,
          textTrackDisplay: false,
          posterImage: true,
          errorDisplay: false,
          controlBar: true,
          // loop: true, // 视频播放结束后，是否循环播放
          // muted: false, //是否静音
          // poster: "", // 播放前显示的视频画面，播放开始之后自动移除。通常传入一个URL
          // preload: "auto", //预加载‘ 自动

          //  controls  //确定播放器是否具有用户可以与之交互的控件。没有控件，启动视频播放的唯一方法是使用autoplay属性或通过Player API。
          //  autoplay: "muted", // //自动播放属性,muted:静音播放
          //  preload="auto"  //建议浏览器是否应在<video>加载元素后立即开始下载视频数据。
          //  poster="../assets/img/E0531.jpg">   //设置视频封面
        },
        function () {
          this.play();

          // How about an event listener?<br>  // 如何使用事件监听？
          this.on("ended", function () {
            videojs.log("‘播放结束了");
          });
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
