<template>
  <div class="catalog-list" :class="useHead ? 'useHead' : ''">
    <div class="catalog-tab" v-if="useHead">
      <span class="lang act">目录</span>
    </div>
    <div class="catalog-list-wrap">
      <div class="volume-list">
        <h3>
          <a class="subscri" href="javascript:"></a>
          正文卷<i>·</i>共{{ catalogList.length + 1 }}章<span class="free">
            免费</span
          >
        </h3>
        <ul>
          <li
            class="ellipsis"
            v-for="item in catalogList"
            :key="item.index"
            :class="currHref === item.href ? 'on' : ''"
          >
            <a :title="getTitle(item.title)" @click="toChapter(item)">
              {{ getTitle(item.title) }}</a
            >
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "catalogList",
  data() {
    return {};
  },
  props: {
    catalogList: {
      type: Array,
      default() {
        return [];
      },
    },
    currHref: {
      type: String,
      default: "",
    },
    useHead: {
      type: Boolean,
      default: true,
    },
    bookUrl: {
      type: String,
      default: "",
    },
  },
  methods: {
    getTitle(title) {
      let str = title || "";
      return str;
      // if (str.includes(" ")) {
      //   let valueList = str.split(" ");
      //   let first = "第" + valueList[0] + "章";
      //   return first + " " + valueList[1];
      // } else if (str.includes(".")) {
      //   let valueList = str.split(".");
      //   let first = "第" + valueList[0] + "章";
      //   return first + " " + valueList[1];
      // } else {
      //   return str;
      // }
    },
    // 查询指定章节内容
    toChapter(item) {
      // 查询指定章节内容
      this.$router.push({
        path: "/readBooks",
        query: {
          bookUrl: escape(this.bookUrl || ""),
          readUrl: escape(item.href || ""),
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.catalog-list.useHead {
  padding: 40px 0 40px 0px;
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
  color: #ed4259;
  font-weight: 500;
}
.lang {
  font-weight: 500;
}

.catalog-list-wrap {
  position: relative;
  z-index: 1;
  min-height: 235px;
}

.useHead .catalog-list-wrap {
  overflow-y: auto;
  height: calc(100vh - 250px);
  overflow-x: hidden;
}

.useHead .catalog-list-wrap .volume-list li {
  width: 50%;
}

.useHead .catalog-list-wrap .volume-list li a {
  font-size: 16px;
}

.catalog-list-wrap .volume-list {
  display: block;
  clear: both;
}
.catalog-list-wrap .volume-list ul {
  padding-left: 24px;
}
.catalog-list-wrap .volume-list li {
  font: 16px/40px PingFangSC-Regular, HelveticaNeue-Light,
    "Helvetica Neue Light", "Microsoft YaHei", sans-serif;
  float: left;
  width: 33%;
  min-width: 120px;
  border-top: 1px solid #f2f2f2;
}

.catalog-list-wrap .volume-list li a {
  cursor: pointer;
  float: left;
  overflow: hidden;
  max-width: calc(100% - 15px);
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 14px;
  color: #262626;
}
.catalog-list-wrap .volume-list li.on a {
  color: #ed4259;
}

.catalog-list-wrap .volume-list li a:hover {
  color: #ed4259;
}

.catalog-list-wrap .volume-list h3 {
  font: 700 18px/40px PingFangSC-Regular, HelveticaNeue-Light,
    "Helvetica Neue Light", "Microsoft YaHei", sans-serif;
  display: block;
  width: calc(100% - 24px);
  height: 41px;
  margin-left: 24px;
  padding-bottom: 6px;
  border-bottom: 1px solid #e5e5e5;
}
</style>
