<template>
  <el-dialog
    title="书籍信息"
    :visible="isShow"
    :show-close="false"
    :modal="false"
    :width="dialogSmallWidth"
    :fullscreen="collapseMenu"
    :class="isWebApp && !isNight ? 'status-bar-light-bg-dialog' : ''"
    @before-close="close"
  >
    <div class="book-info-container">
      <div class="book-cover">
        <div class="book-cover-bg" :style="bookCoverBgStyle"></div>
        <div class="book-cover-bg-image">
          <img
            v-lazy="getCover(BookInfo.coverUrl)"
            :key="BookInfo.name"
            alt=""
          />
        </div>
      </div>
      <div class="book-name">{{ BookInfo.name }}</div>
      <div class="book-kind" v-html="renderBookKind(BookInfo.kind)"></div>
      <div class="book-props">
        <div class="book-prop book-author">
          作者： {{ BookInfo.author || "未知" }}
        </div>
        <div class="book-prop book-origin">
          来源： {{ displayOriginName(BookInfo.origin) }}
        </div>
        <div class="book-prop book-latest">
          最新： {{ BookInfo.latestChapterTitle }}
        </div>
        <!-- <div class="book-prop book-group" v-if="!isSearchResult">
          分组： {{ displayGroupName(BookInfo.group) }}
          <el-button
            type="text"
            class="book-prop-btn"
            @click="showSetBookGroup()"
            >设置分组</el-button
          >
        </div> -->
      </div>
      <div class="book-intro" v-html="renderBookIntro(BookInfo)"></div>
    </div>
    <BookGroup
      v-if="showBookGroupManageDialog"
      v-model:isShow="showBookGroupManageDialog"
      :isSeetting="isShowBookGroupSettingDialog"
    ></BookGroup>
  </el-dialog>
</template>
<script>
// 书籍详情
import BookGroup from "./BookGroup.vue";

export default {
  name: "BookInfo",
  components: {
    BookGroup,
  },
  data() {
    return {
      showBookGroupManageDialog: false,
      isShowBookGroupSettingDialog: false,
    };
  },
  props: {
    BookInfo: {
      type: Object,
      default() {
        return {};
      },
    },
    isShow: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    collapseMenu() {
      return this.$store.state.miniInterface;
    },
    dialogSmallWidth() {
      return this.collapseMenu ? "85%" : "500px";
    },
    isNight() {
      return this.$store.getters.isNight;
    },
    bookCoverBgStyle() {
      return {
        backgroundImage: `url(${this.getCover(this.BookInfo.coverUrl, true)})`,
      };
    },
    bookSourceList() {
      return this.$store.state.bookSourceList;
    },
  },
  mounted() {},
  watch: {},
  methods: {
    close() {
      this.$emit("update:isShow", false);
    },
    displayOriginName(value) {
      if (value === "loc_book") return "本地";
      return (
        (this.bookSourceList.find((v) => v.bookSourceUrl === value) || {})
          .bookSourceName || "未知书源"
      );
    },
    displayGroupName(value) {
      const groupName = [];
      let unGroupName = "";
      this.$store.state.bookGroupList.forEach((v) => {
        if (v.groupId > 0 && (v.groupId & value) !== 0) {
          groupName.push(v.groupName);
        } else if (v.groupId === -4) {
          unGroupName = v.groupName;
        }
      });
      return groupName.join(",") || unGroupName || "未分组";
    },
    renderBookKind(value) {
      if (!value) {
        return "";
      }
      const kindList = value.split(",");
      return kindList
        .filter((v) => v)
        .map((v) => {
          return `<span>${v}</span>`;
        })
        .join("");
    },
    renderBookIntro(book) {
      const intro = (book.intro || "暂无简介").split("\n");
      return intro
        .map((v) => {
          return `<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${v.replace(
            /^\s+/g,
            ""
          )}</p>`;
        })
        .join("");
    },
    showSetBookGroup() {
      this.isShowBookGroupSettingDialog = true;
      this.showBookGroupManageDialog = true;
    },
  },
};
</script>
