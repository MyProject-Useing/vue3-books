<template>
  <div class="book-content-wrap" :class="isMobileClass ? 'mobile' : ''">
    <div class="read-content">
      <p v-for="(item, index) in contentList" :key="index">
        <span class="content-wrap" v-html="filterText(item)"></span>
      </p>
    </div>
  </div>
</template>

<script>
import { isMobile } from "@/plugins/utils";

export default {
  name: "contentDetails",
  data() {
    return {};
  },
  props: {
    content: {
      type: String,
      default: "",
    },
  },
  // watch: {
  //   content(val, oldVal) {
  //     if (val !== oldVal) {
  //       return val;
  //     }
  //   },
  // },
  computed: {
    // 是否为移动端
    isMobileClass() {
      let isTrue = isMobile();
      return isTrue;
    },
    contentList() {
      return this.content.replace(/&nbsp;/g, "").split("\n");
    },
  },
  methods: {
    filterText(item) {
      let text = item.split("亲,点击进去")[0];
      return text;
    },
  },
};
</script>
<style scoped>
@import url("@/views/book/css/content.css");
</style>
