<template>
  <div class="playing-wrap" :class="isMobileClass ? 'mobile' : ''">
    <div class="playing-main">
      <iframe
        id="iframe"
        :src="iframeSrc"
        class="my-iframe"
        style="height: 100%; width: 100%"
        width="100%"
        frameborder="0"
        @load="setIframe"
      ></iframe>
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
      return decodeURI(this.$route.query.url || "");
    },
  },
  data() {
    return {
      iframeSrc: "",
    };
  },
  mounted() {
    this.iframeSrc = this.palyUrl;
    getVideoHtmlbyAQY({ url: encodeURI(this.palyUrl) }).then((d) => {
      debugger;
      d;
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
.my-iframe html {
  height: 300px;
}
</style>
