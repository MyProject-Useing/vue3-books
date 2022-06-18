<template>
  <a-layout class="layout">
    <a-layout-header class="header">
      <div class="logo" />
      <a-menu
        class="head-menu"
        v-model:selectedKeys="selectedKey"
        theme="dark"
        mode="horizontal"
      >
        <a-menu-item key="/videoIndex" @click="toPath('/videoIndex')">
          <!-- <template #icon>
            <video-camera-outlined />
          </template> -->

          视频</a-menu-item
        >
        <a-menu-item key="/book" @click="toPath('/book')">
          <!-- <template #icon> <read-outlined /> </template> -->
          小说
        </a-menu-item>
      </a-menu>
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
            <span class="header-btn-group" @click="searchDetails">
              <search-outlined />
              <span> 搜索 </span>
            </span>
          </template>
        </a-input>
        <!-- <div>
          <search-outlined />
          <search-outlined />
        </div> -->
      </div>
    </a-layout-header>
    <a-layout-content>
      <a-layout>
        <a-layout-content>
          <router-view />
        </a-layout-content>
      </a-layout>
    </a-layout-content>
    <a-layout-footer> ©2022 Created by Z </a-layout-footer>
  </a-layout>
</template>
<script>
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";

import {
  // VideoCameraOutlined,
  // ReadOutlined,
  SearchOutlined,
} from "@ant-design/icons-vue";
export default defineComponent({
  components: { SearchOutlined },
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
      keywords: ref(""),
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
      if (this.selectedKey.includes("videoIndex")) {
        this.toPath("/searchResult", params);
      } else {
        this.toPath("/searchResult", params);
      }
    },
  },
});
</script>
<style>
.layout .logo {
  float: left;
  width: 120px;
  height: 31px;
  margin: 16px 24px 16px 0;
  background: rgba(255, 255, 255, 0.3);
}

.layout .head-menu {
  line-height: 64px;
  max-width: 400px;
  font-size: 14px;
  display: inline-block;
}
.layout .header-side {
  float: right;
  width: 50%;
}

.layout .head-search-btn {
  box-sizing: border-box;
  border: 0;
  outline: 0;
  font-size: 14px;
  background-color: hsla(0, 0%, 100%, 0.18);
  border-radius: 4px;
  line-height: 28px;
  width: 230px;
}
.layout .head-search-btn .ant-input {
  background-color: rgb(0 0 0 / 8%);
  color: hsla(0, 0%, 100%, 0.9);
}

.layout .header-btn-group {
  cursor: pointer;
  display: block;
  position: relative;
  text-align: center;
  color: #00cc4c;
}

.layout .ant-menu-dark.ant-menu-horizontal > .ant-menu-item:hover {
  background: none;
  color: #00cc4c;
}

.layout .ant-menu.ant-menu-dark .ant-menu-item {
  background: none;
  font-size: 18px;
  color: hsla(0, 0%, 93.3%, 0.88);
  font-weight: 700;
}

.layout .ant-menu.ant-menu-dark .ant-menu-item-selected,
.layout .ant-menu-submenu-popup.ant-menu-dark .ant-menu-item-selected {
  color: #00cc4c;
}

.layout .ant-menu.ant-menu-dark,
.layout .ant-menu-dark .ant-menu-sub,
.layout .ant-menu.ant-menu-dark .ant-menu-sub {
  background: none;
}

.layout .ant-layout-header {
  background-color: #14161a;
}
</style>
