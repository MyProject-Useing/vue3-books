<template>
  <div>
    <video></video>
  </div>
</template>

<script>
// import { message } from "ant-design-vue";
import { isMobile } from "@/plugins/utils";
// 目录

export default {
  name: "bookIndex",
  // components: { catalog },
  data() {
    return {
      bookLoading: false,
    };
  },
  computed: {
    // 是否为移动端
    isMobileClass() {
      let isTrue = isMobile();
      return isTrue;
    },
    bookUrl() {
      return decodeURI(this.$route.query.bookUrl || "");
    },
  },
  activated() {
    this.init();
  },
  deactivated() {},
  mounted() {
    this.init();
  },
  methods: {
    init() {
      // if (this.bookUrl) {
      // }
    },
  },
};
</script>

<style scoped>
@import url("./css/index.css");
</style>
