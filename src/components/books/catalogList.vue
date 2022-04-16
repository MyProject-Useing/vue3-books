<template>
  <div class="catalog-list">
    <div class="catalog-list-title"></div>
    <div class="catalog-tab dib-wrap">
      <span class="lang act">目录</span>
    </div>
    <div class="catalog-list-wrap">
      <div class="volume-list">
        <ul>
          <li
            v-for="(item, index) in catalogList"
            :key="item.index"
            :class="currPageIndex === index ? 'on' : ''"
            @click="toChapter(index)"
          >
            <a>{{ item.title }}</a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "catalogList",
  components: {},
  data() {
    return {};
  },
  activated() {},
  props: {
    catalogList: {
      type: Array,
      default() {
        return [];
      },
    },
    bookInfo: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  computed: {
    selfBook() {
      return this.bookInfo;
    },
    currPageIndex() {
      return this.bookInfo.index;
    },
  },
  methods: {
    // 查询指定章节内容
    toChapter(index) {
      this.$emit("changeChapter", index);
    },
  },
};
</script>

<style lang="scss" scoped>
.catalog-list {
  padding: 40px 0 40px 0px;
  background: url("@/assets/imgs/booksContent/basic_bg.png") repeat;
  box-shadow: 0 5px 20px rgb(0 0 0 / 20%);
}

.catalog-list .catalog-tab {
  margin: 0 0 20px 24px;
}
.catalog-tab span.act {
  border-bottom: 1px solid #ed4259;
}
.catalog-list .catalog-tab span {
  font-size: 18px;
  line-height: 22px;
  margin-right: 20px;
  padding: 0 2px 4px;
  cursor: pointer;
  transition: color 0.3s;
  color: #ed4259;
}
.lang {
  font-weight: 500;
}

.catalog-list-wrap .volume-list {
  display: block;
  clear: both;
  margin-right: -4px;
  margin-bottom: 20px;
}
.catalog-list-wrap .volume-list ul {
  overflow: hidden;
  padding-left: 24px;
}
.catalog-list-wrap .volume-list li {
  font: 16px/40px PingFangSC-Regular, HelveticaNeue-Light,
    "Helvetica Neue Light", "Microsoft YaHei", sans-serif;
  float: left;
  width: 368px;
  border-top: 1px solid #f2f2f2;
}
li,
ol,
ul {
  list-style: none outside none;
}
.catalog-list-wrap {
  overflow: auto;
  overflow-x: hidden;
  position: relative;
  z-index: 1;
  min-height: 235px;
  max-height: 450px;
}
.catalog-list-wrap .volume-list li a {
  cursor: pointer;
}
.catalog-list-wrap .volume-list li.on a {
  color: #ed4259;
}
</style>
