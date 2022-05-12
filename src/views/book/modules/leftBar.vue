<template>
  <div class="left-bar-list" :class="isMobileClass ? 'mobile' : ''">
    <dl>
      <dd>
        <a href="javascript:" @click.stop="goHome">
          <bank-outlined />
          <span>首页</span>
        </a>
      </dd>
      <dd>
        <a
          id="catalog_bottom"
          href="javascript:"
          :class="catalogList.length > 0 ? '' : 'disabled'"
          @click.stop="catalogList.length > 0 ? showCatalog() : false"
          @touchend.stop="catalogList.length > 0 ? showCatalog() : false"
        >
          <UnorderedListOutlined />
          <span>目录</span>
        </a>
      </dd>
      <dd>
        <a href="javascript:">
          <SettingOutlined />
          <span>设置</span></a
        >
      </dd>
      <dd>
        <a id="bookshelf_btn" href="javascript:" @click.stop="showBookShelf">
          <BookOutlined /><span>书架</span></a
        >
      </dd>
    </dl>
    <!-- 目录 -->
    <div id="catalog_panle" class="setting-popover" v-show="catalogPopover">
      <catalog
        :bookUrl="bookUrl"
        :currHref="selfCatalog.href"
        :catalogList="catalogList"
      />
    </div>
    <!-- 书架 -->
    <div id="bookShelf_panle" class="setting-popover" v-show="bookShelfPopover">
      <booksShelf />
    </div>
  </div>
</template>

<script>
import { isMobile } from "@/plugins/utils";
// 目录
import catalog from "@/components/books/catalogList.vue";
// 书架
import booksShelf from "@/components/books/booksShelf.vue";

import {
  BookOutlined,
  UnorderedListOutlined,
  SettingOutlined,
  BankOutlined,
} from "@ant-design/icons-vue";

export default {
  name: "contentDetails",
  components: {
    booksShelf,
    catalog,

    BookOutlined,
    UnorderedListOutlined,
    SettingOutlined,
    BankOutlined,
  },
  data() {
    return {
      // 目录弹出框
      catalogPopover: false,

      // 书架弹出框
      bookShelfPopover: false,
    };
  },
  props: {
    catalogList: {
      type: Array,
      default: () => [],
    },
    selfCatalog: { type: Object, default: () => {} },
  },
  computed: {
    // 是否为移动端
    isMobileClass() {
      let isTrue = isMobile();
      return isTrue;
    },
    // 书籍地址
    bookUrl() {
      return unescape(this.$route.query.bookUrl || "");
    },
  },
  mounted() {
    window.onclick = (e) => {
      let $catalog_bottom = document.getElementById("catalog_bottom");
      let $catalog_curr = document.getElementById("catalog_curr");

      let $catalog_panle = document.getElementById("catalog_panle");
      let $bookShelf_panle = document.getElementById("bookShelf_panle");
      let $bookshelf_btn = document.getElementById("bookshelf_btn");

      // 点击空白 关闭 目录和书签
      if (this.catalogPopover === true) {
        // 点击目录弹出框
        if (e.path.includes($catalog_panle)) {
          if (e.target.tagName === "A") {
            this.catalogPopover = false;
            return false;
          }
        } else if (
          e.path.includes($catalog_bottom) ||
          e.path.includes($catalog_curr)
        ) {
          return false;
        } else {
          this.catalogPopover = false;
        }
      } else if (this.bookShelfPopover === true) {
        if (e.path.includes($bookShelf_panle)) {
          if (e.target.tagName === "A") {
            this.bookShelfPopover = false;
            return false;
          }
        } else if (e.path.includes($bookshelf_btn)) {
          return false;
        } else {
          this.bookShelfPopover = false;
        }
      }
    };
  },
  methods: {
    // 返回首页
    goHome() {
      this.$router.push({ path: "/" });
    },
    // 展示目录
    showCatalog() {
      this.catalogPopover = true;
      // 隐藏 书架
      this.bookShelfPopover = false;
    },
    // 展示书架
    showBookShelf() {
      // 隐藏目录
      this.catalogPopover = false;
      // 隐藏 书架
      this.bookShelfPopover = true;
    },
  },
};
</script>
<style scoped>
@import url("@/views/book/css/leftBar.css");
</style>
