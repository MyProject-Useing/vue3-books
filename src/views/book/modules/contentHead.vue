<template>
  <div class="content-head-wrap">
    <h2 class="head-title">
      {{ bookTitle }}
    </h2>
    <div class="text-info" v-if="!isMobileClass">
      <a>
        <database-outlined title="书名" />
        <span> {{ title }}</span></a
      >
      <a
        ><solution-outlined title="作者" />
        <span> {{ author }}</span>
      </a>
      <a>
        <ReadOutlined title="字数" />
        <span>0字</span>
      </a>
    </div>
  </div>
</template>

<script>
import { isMobile } from "@/plugins/utils";

import {
  DatabaseOutlined,
  ReadOutlined,
  SolutionOutlined,
} from "@ant-design/icons-vue";

export default {
  name: "contentDetails",
  components: {
    DatabaseOutlined,
    ReadOutlined,
    SolutionOutlined,
  },
  data() {
    return {};
  },
  computed: {
    // 是否为移动端
    isMobileClass() {
      let isTrue = isMobile();
      return isTrue;
    },
    bookUrl() {
      return decodeURIComponent(this.$route.query.bookUrl || "");
    },
    // 书架列表
    cacheBookList() {
      return this.$store.state.caches.readBooksList;
    },
    selfBook() {
      return this.cacheBookList[this.bookUrl] || {};
    },
    title() {
      return this.selfBook?.info?.title ?? "";
    },
    author() {
      return this.selfBook?.info?.author ?? "";
    },
  },
  methods: {},
};
</script>
<style scoped>
.content-head-wrap {
  margin-bottom: 2rem;
}
.content-head-wrap .head-title {
  font: 1.5rem PingFangSC-Regular, HelveticaNeue-Light, "Helvetica Neue Light",
    "Microsoft YaHei", sans-serif;
}

.content-head-wrap .text-info {
  font: 12px/16px PingFangSC-Regular, "-apple-system", Simsun;
  display: flex;
  align-items: center;
  margin-top: 10px;
}

.content-head-wrap .text-info span {
  margin-right: 5px;
  color: rgba(0, 0, 0, 0.4);
  cursor: default;
}

.content-head-wrap .text-info span.anticon {
  font-size: 15px;
  color: rgb(0 0 0 / 45%);
}

.content-head-wrap .text-info a {
  font-family: PingFangSC-Regular, HelveticaNeue-Light, "Helvetica Neue Light",
    "Microsoft YaHei", sans-serif;
  margin-right: 16px;
  color: rgba(0, 0, 0, 0.4);
}
.content-head-wrap .text-info i {
  color: rgba(0, 0, 0, 0.4);
  font-size: 16px;
}
</style>
