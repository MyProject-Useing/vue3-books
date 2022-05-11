<template>
  <div class="content-head-wrap">
    <h2 class="head-title">
      {{ chapterTitle }}
    </h2>
    <div v-if="!isMobileClass">
      <div class="info fl">
        <a>
          <database-outlined title="书名" />
          <span> {{ book.bookTitle }}</span></a
        >
        <a
          ><solution-outlined title="作者" />
          <span> {{ book.author }}</span>
        </a>
        <a>
          <ReadOutlined title="字数" />
          <span> {{ (book.wordCount || "0").replace("字", "") }}字</span>
        </a>
      </div>
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
  props: {
    book: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  computed: {
    // 是否为移动端
    isMobileClass() {
      let isTrue = isMobile();
      return isTrue;
    },

    chapterTitle() {
      let str = this.book.chapterTitle || "";
      if (str.includes(".")) {
        let valueList = str.split(".");
        let first = "第" + valueList[0] + "章";
        return first + " " + valueList[1];
      } else {
        return str;
      }
    },
  },
  methods: {},
};
</script>
<style scoped>
.content-head-wrap .head-title {
  font: 1.5rem PingFangSC-Regular, HelveticaNeue-Light, "Helvetica Neue Light",
    "Microsoft YaHei", sans-serif;
  margin-bottom: 2rem;
  line-height: 1.2;
}

.content-head-wrap .text-info {
  font: 12px/16px PingFangSC-Regular, "-apple-system", Simsun;
  height: 34px;
}

.content-head-wrap .text-info span {
  margin-right: 5px;
}

.content-head-wrap .text-info a {
  font-family: PingFangSC-Regular, HelveticaNeue-Light, "Helvetica Neue Light",
    "Microsoft YaHei", sans-serif;
  margin-right: 16px;
  color: rgba(0, 0, 0, 0.4);
  display: flex;
  float: left;
}
.content-head-wrap .text-info i {
  color: rgba(0, 0, 0, 0.4);
  font-size: 16px;
}
</style>
