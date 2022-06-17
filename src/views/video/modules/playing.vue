<template>
  <div class="playing-wrap" :class="isMobileClass ? 'mobile' : ''">
    <div class="playing-main">
      <div class="video-title">{{ souresName }} {{ palyName }}</div>
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
            <div class="item-head-wrap">
              <a
                class="tip-left"
                :class="index === selectSoureIndex ? 'active' : ''"
              >
                {{ item.name }}
              </a>
              <span class="tip-right">{{ item.year }}</span>
            </div>
            <div class="item-body-wrap">
              <ul class="album-list">
                <li
                  class="album-item"
                  v-for="(info, inx) in item.source"
                  :key="inx"
                  :class="
                    index === selectSoureIndex && inx === selectIndex
                      ? 'active'
                      : ''
                  "
                >
                  <a
                    @click="jumpIndex(info, inx, index)"
                    href="javascript:void(0);"
                    :title="info.name"
                    class="album-link"
                    ><span class="ellipsis"
                      >{{ info.name }}<i class="playing-icon"></i></span
                  ></a>
                </li>
              </ul>
            </div>
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
import { getUrlSourse } from "@/api/movieApi";
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
      return decodeURI(this.$route.query.url || "");
    },

    // 播放的视频名称
    playSourse() {
      return this.sourceList[this.selectSoureIndex] || {};
    },

    // 播放的视频集数
    playSourseIndex() {
      let source = this.playSourse?.source ?? [];
      return source[this.selectIndex] || {};
    },

    // 当前播放的 视频名称
    souresName() {
      let name = this.playSourse?.name ?? "";
      if (name) {
        return `《${name}》`;
      }
      return name;
    },
    // 当前播放的集数
    palyName() {
      return this.playSourseIndex?.name ?? "";
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
      selectSoureIndex: -1,
      selectIndex: -1,
    };
  },
  mounted() {
    this.getM3u8Url();
  },
  methods: {
    jumpIndex(item, index, pIndex) {
      this.src = item.url;
      this.setIndex(index, pIndex);
    },
    getM3u8Url() {
      let url = encodeURI(this.palyUrl);
      let resData = sessionStorage.getItem("video_paly_session@" + url);
      if (resData) {
        this.sourceList = JSON.parse(resData);
        this.src = this.sourceList[0].source[0].url;
        this.setIndex(0, 0);
      } else {
        getUrlSourse({ url: url })
          .then((d) => {
            if (d.data.data) {
              this.sourceList = d.data.data || [];

              this.setIndex(0, 0);
              this.src = this.sourceList[0]?.source[0].url;
              sessionStorage.setItem(
                "video_paly_session@" + url,
                JSON.stringify(this.sourceList)
              );
            }
          })
          .catch((d) => {
            console.log(d);
          });
      }
    },
    setIndex(index, pIndex) {
      this.selectSoureIndex = pIndex;
      this.selectIndex = index;
    },
    error() {},
  },
};
</script>
<style scoped>
@import url("@/views/video/css/playing.css");
</style>
