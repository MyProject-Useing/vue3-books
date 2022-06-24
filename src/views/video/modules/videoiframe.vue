<template>
  <div class="playing-wrap" :class="isMobileClass ? 'mobile' : ''">
    <div class="playing-main">
      <iframe
        id="iframe"
        :src="iframeSrc"
        class="my-iframe"
        frameborder="0"
        @load="setIframe"
      ></iframe>

      <!-- 凡人修仙传54 -->
      <!-- https://ukzy.ukubf3.com/20220612/8UPWmDQY/2000kb/hls/index.m3u8 -->
    </div>
  </div>
</template>

<script>
import "vue3-video-play/dist/style.css";
import { isMobile } from "@/plugins/utils";
import { getVideoHtmlbyAQY } from "@/api/movieApi";
export default {
  name: "bookResult",
  components: {},
  computed: {
    // 是否为移动端
    isMobileClass() {
      let isTrue = isMobile();
      return isTrue;
    },
    palyUrl() {
      return decodeURIComponent(this.$route.query.url || "");
    },
  },
  data() {
    return {
      iframeSrc: "",
    };
  },
  mounted() {
    getVideoHtmlbyAQY({ url: encodeURI(this.palyUrl) }).then((d) => {
      this.iframeSrc = d.data.data;
    });
  },
  methods: {
    setIframe() {
      // var _iframe = document.getElementById("iframe");
      // let bb = $(".skippable-after");
      // var _obj = _iframe.contentWindow || _iframe.contentDocument;
      // bb;
      //
      // <!-- $(".skippable-after").click() -->
      // bb;
    },
  },
};
</script>
<style scoped>
.playing-wrap,
.playing-main {
  height: 100%;
  width: 100%;
}
.my-iframe {
  height: 100%;
  width: 100%;
  min-height: 800px;
}
</style>
