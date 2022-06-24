<template>
  <div class="book-content-wrap" :class="isMobileClass ? 'mobile' : ''">
    <div class="read-content">
      <p v-for="(item, index) in contentList" :key="index">
        <span class="content-wrap" v-html="item"></span>
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
  computed: {
    // 是否为移动端
    isMobileClass() {
      let isTrue = isMobile();
      return isTrue;
    },

    contentList() {
      let content = this.content || "";
      let filterKey = [
        "下载本书最新的电子书请点击",
        "！！！亲,点击进去",
        "亲,点击进去,",
      ];
      if (content.includes(filterKey[0])) {
        content = content.substring(0, content.indexOf(filterKey[0]));
      }
      if (content.includes(filterKey[1])) {
        content = content.substring(0, content.indexOf(filterKey[1]));
      }
      if (content.includes(filterKey[2])) {
        content = content.substring(0, content.indexOf(filterKey[2]));
      }
      return content.replace(/&nbsp;/g, "").split("\n");
    },
  },
  methods: {},
};
</script>
<style scoped>
@import url("@/views/book/css/content.css");
</style>
