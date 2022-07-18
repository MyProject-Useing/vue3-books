<template>
  <a-layout class="layout">
    <a-layout-header class="header">
      <div class="layout-head-panle">
        <div class="layout-head">
          <div class="logo-goroup">
            <div class="logo-bg"></div>
            酷我视频
          </div>
          <!-- <a-menu
            class="head-menu"
            v-model:selectedKeys="selectedKey"
            theme="dark"
            mode="horizontal"
          >
            <a-menu-item key="/videoIndex" @click="toPath('/videoIndex')">
              酷我视频</a-menu-item
            >
          </a-menu> -->
          <div class="header-side">
            <a-input
              class="head-search-btn"
              enter-button="Search"
              placeholder="请输入关键字"
              v-model:value.trim="keywords"
              @keyup.enter.stop="searchDetails"
              :maxLength="200"
            >
              <template #suffix>
                <span class="search-btn-group" @click="searchDetails">
                  <search-outlined />
                  <span> 搜索 </span>
                </span>
              </template>
            </a-input>
            <div class="header-btn-group">
              <clock-circle-outlined title="播放记录" @click="openGit()" />
              <sync-outlined title="刷新界面" @click="openGit()" />
              <github-outlined title="查看源码" @click="openGit()" />
              <comment-outlined title="反馈" @click="openGit()" />
            </div>
          </div>
        </div>
      </div>
    </a-layout-header>
    <a-layout-content>
      <router-view />
    </a-layout-content>
    <a-layout-footer>
      <div>1、本站提供的所有内容仅供学习、交流与参考。</div>
      <div>
        2、本站所有资源均已标明来源，如未经许可进行转载使用，请务必标明或保留文章原始出处和作者的信息。
      </div>
      <span> Copyright © 2022 zyy All Rights Reserved </span>
    </a-layout-footer>
  </a-layout>
</template>
<script>
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
// 图标
import {
  GithubOutlined,
  SearchOutlined,
  SyncOutlined,
  CommentOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons-vue";
export default defineComponent({
  components: {
    SearchOutlined,
    GithubOutlined,
    SyncOutlined,
    CommentOutlined,
    ClockCircleOutlined,
  },
  name: "lay_out",
  setup() {
    const router = useRouter();
    const toPath = (path, query) => {
      router.push({
        path: path,
        query,
      });
    };
    return {
      keywords: ref(router.currentRoute.value.query.keywords || ""),
      selectedKey: ref([router.currentRoute.value.path]),
      toPath,
    };
  },
  methods: {
    searchDetails() {
      const params = { keywords: this.keywords };
      if (!this.keywords) {
        return;
      }
      if (
        this.selectedKey.includes("/videoIndex") ||
        this.selectedKey.includes("/videoResult")
      ) {
        this.toPath("/videoResult", params);
      } else {
        this.toPath("/bookResult", params);
      }
    },
    // 查看git源码
    openGit() {
      window.open("https://github.com/danhuaxiansheng/vue3-books");
    },
  },
});
</script>
<style lang="less" scoped>
@media (max-width: 1549px) {
  .layout {
    width: 1200px;
  }
}
@media (max-width: 1789px) {
  .layout {
    width: 1500px;
  }
}

@media (max-width: 1280px) {
  .layout {
    width: 990px;
  }
}

.layout {
  margin: auto;
}

.layout .ant-layout-header {
  z-index: 10;
  width: 100%;
  height: 68px;
  color: #666;
  font-size: 12px;
  background-size: cover;
  background-position-y: -168px;
  background-color: #fff;
  padding: 0px;
}
.layout .ant-layout-content {
  background-color: #fff;
}

.layout .logo-goroup {
  float: left;
  display: flex;
}

.layout .ant-layout {
  background: #fff;
}

.header-btn-group {
  display: inline-block;
  margin-left: 20px;
}

.header-btn-group .anticon {
  font-size: 26px;
  cursor: pointer;
}

.header-btn-group .anticon + .anticon {
  margin-left: 20px;
}

.layout .ant-layout-footer {
  background: url("@/assets/back.jpg") no-repeat;
  background-size: cover;
  background-position-y: -168px;
  color: #fff;
}

.layout .logo-goroup span {
  color: #d9363e;
  margin-left: 7px;
  font-size: 18px;
  font-weight: 700;
  width: 70px;
}

.layout .logo-goroup .logo-bg {
  width: 38px;
  height: 40px;
  margin-top: 14px;
}

.layout .head-menu {
  line-height: 68px;
  max-width: 400px;
  font-size: 14px;
  display: inline-block;
}

.layout .header-side {
  float: right;
  height: 100%;
}

.layout .head-search-btn {
  outline: 0;
  font-size: 14px;
  background-color: hsla(0, 0%, 100%, 0.18);
  line-height: 28px;
  width: 246px;
  border-color: #ff5c38;
  box-shadow: 0 4px 18px rgb(17 18 38 / 7%);
  transition: max-width 0.2s ease;
  border-radius: 20px;
  height: 38px;
}

.layout .head-search-btn .ant-input {
  background-color: transparent;
  padding-left: 9px;
  color: #999;
  text-shadow: none;
}

.layout .search-btn-group {
  cursor: pointer;
  position: relative;
  text-align: center;
  color: #ff5c38;
  display: contents;
}

.search-btn-group .anticon-search {
  font-size: 19px;
  margin-right: 5px;
}

.layout .ant-menu-dark.ant-menu-horizontal > .ant-menu-item:hover {
  background: none;
  color: #ff5c38;
}

.layout .ant-menu.ant-menu-dark .ant-menu-item {
  background: none;
  font-size: 18px;
  color: #111;
  font-weight: 500;
  font-style: oblique;
  padding: 0px;
}

.layout .ant-menu.ant-menu-dark,
.layout .ant-menu-dark .ant-menu-sub,
.layout .ant-menu.ant-menu-dark .ant-menu-sub {
  background: none;
}

.layout-head {
  height: 68px;
  margin: 0 auto;
}
</style>
