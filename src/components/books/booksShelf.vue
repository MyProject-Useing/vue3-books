<template>
  <div class="bookShelf-list">
    <div class="bookShelf-title">
      <span class="lang act">书架</span>
    </div>
    <div class="books-panle">
      <ul>
        <li
          v-for="(item, index) in cacheBookList"
          :key="index"
          @mouseover="item.isActive = true"
          @mouseout="item.isActive = false"
          class="books-item"
        >
          <a-image
            class="book-img"
            :src="getCover(item.coverUrl, true)"
            fallback="data:image/png;base64,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"
          >
          </a-image>
          <div class="img-info">
            <span
              v-show="item.isActive"
              class="delete-books"
              @click.stop="deleteBook(item)"
            >
            </span>
            <h3 class="books-name-p ellipsis">
              <span
                :title="item.name"
                @click="toDetail(item)"
                class="books-name"
              >
                {{ item.name }}
              </span>
            </h3>

            <div class="img-content ellipsis">
              阅读至第 {{ item.readIndex }} 章
            </div>

            <div class="img-bottom ellipsis">
              <div class="book-author ellipsis" :title="item.author">
                <UserOutlined /> {{ item.author || "" }}
              </div>

              <DeleteOutlined title="删除" />
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { getCover } from "@/plugins/utils.js";
import { DeleteOutlined, UserOutlined } from "@ant-design/icons-vue";
export default {
  name: "bookShelf",
  components: { DeleteOutlined, UserOutlined },
  data() {
    return {};
  },
  activated() {},
  computed: {
    cacheBookList() {
      return this.$store.state.caches.readBooksList;
    },
  },
  methods: {
    getCover(coverUrl, normal) {
      return getCover(coverUrl, normal);
    },
    // 直接阅读缓存的书籍
    toDetail(book) {
      debugger;
      // 当前正在阅读的书籍
      this.$store.commit("caches/setReadingBook", book);
      // 查询指定章节内容
      this.$emit("changeChapter", book.readIndex || 0);
      // this.$router.push({
      //   path: "/readBooks",
      //   query: { search: book.readIndex || 0 },
      // });
    },
    deleteBook(book) {
      // 删除当前书籍
      this.$store.commit("caches/deleteReadBooks", book);
    },
  },
};
</script>

<style lang="scss" scoped>
.bookShelf-list {
  height: 100%;
  width: 100%;
  position: relative;
  min-height: 212px;
  padding: 40px 0 40px 0px;
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyAgMAAABjUWAiAAAACVBMV…C/PBIMuF+vSSYSaxoVt90EO3Gu1zrMuMRGUk7Ffv3L+A931Gsb/yBoIgAAAABJRU5ErkJggg==)
    repeat;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
}

.books-panle {
  padding-left: 24px;
  position: relative;
  min-height: 212px;
}

.bookShelf-title {
  margin: 0 0 20px 24px;
}

.bookShelf-title span.act {
  border-bottom: 1px solid #ed4259;
}

.bookShelf-title span {
  font-size: 18px;
  line-height: 22px;
  margin-right: 20px;
  padding: 0 2px 4px;
  cursor: pointer;
  transition: color 0.3s;
  color: #ed4259;
}

.bookShelf-list .books-item {
  display: flex;
  float: left;
  width: 258px;
  position: relative;
  margin-bottom: 15px;
}

.books-item .books-name {
  cursor: pointer;
  color: #1a1a1a;
  margin-bottom: 8px;
  font: 16px/21px PingFangSC-Regular, HelveticaNeue-Light, Helvetica Neue Light,
    Microsoft YaHei, "sans-serif";
}

.books-item .books-name:hover {
  color: #ed4259;
}

.books-item .img-info {
  width: calc(100% - 96px);
}

.books-name-p {
  margin-bottom: 8px;
  margin-top: -3px;
}

.books-item .img-content {
  color: #666;
  font: 12px/20px PingFangSC-Regular, -apple-system, Simsun;
  height: 46px;
}

.books-item .img-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.books-item .book-author {
  color: #a6a6a6;
  display: block;
  height: 18px;
  margin-top: 2px;
  overflow: hidden;
  padding-right: 10px;
}

.books-item .img-bottom .anticon-delete {
  font-size: 15px;
  margin-right: 10px;
  color: #a6a6a6;
  cursor: pointer;
}
</style>
<style>
.books-item .book-img {
  color: #fcfcfa;
  transition: transform 0.3s ease-out;
  height: 96px;
  margin-right: 12px;
  width: 72px;
  box-shadow: 0 1px 6px rgb(0 0 0 / 35%), inset 0 0 5px #f9f2e9;
}
</style>
