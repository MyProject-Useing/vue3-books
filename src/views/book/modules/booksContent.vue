<template>
  <div class="read-main-wrap" :class="isMobileClass ? 'mobile' : ''">
    <div class="main-text-wrap">
      <ContentHead />
      <a-spin :spinning="loading">
        <Content :content="content" />
      </a-spin>
      <slot></slot>
    </div>
  </div>
</template>

<script>
import { isMobile } from "@/plugins/utils";
import Content from "./content.vue";
import ContentHead from "./contentHead.vue";
export default {
  name: "booksContent",
  components: {
    Content,
    ContentHead,
  },
  data() {
    return {};
  },
  props: {
    content: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "",
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    content(val, oldVal) {
      if (val !== oldVal) {
        return val;
      }
    },
  },
  computed: {
    // 是否为移动端
    isMobileClass() {
      let isTrue = isMobile();
      return isTrue;
    },
  },
  methods: {},
};
</script>
<style scoped>
@import url("@/views/book/css/booksContent.css");
</style>
