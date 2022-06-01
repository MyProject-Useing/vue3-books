<template>
  <div class="playing-wrap" :class="isMobileClass ? 'mobile' : ''">
    <div class="playing-main">
      <iframe
        id="iframe"
        :src="palyUrl"
        class="my-iframe"
        style="min-height: 600px; width: 100%"
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
      return unescape(this.$route.query.url || "");
    },
  },
  data() {
    return {
      iframeSrc: "",
    };
  },
  mounted() {
    // this.iframeSrc = this.palyUrl;
  },
  methods: {
    setIframe() {
      // var _iframe = document.getElementById("iframe");
      // var _obj = _iframe.contentWindow || _iframe.contentDocument;
      debugger;
      let aa = window.document.getElementById("flashbox");
      aa;
    },
  },
};
</script>
<style scoped>
.my-iframe html {
  height: 300px;
}
</style>
