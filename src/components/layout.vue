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
        <a-menu-item key="/searchResult" @click="toPath('/searchResult')">
          <template #icon>
            <video-camera-outlined />
          </template>

          视频</a-menu-item
        >
        <a-menu-item key="/book" @click="toPath('/book')">
          <template #icon> <read-outlined /> </template>
          小说
        </a-menu-item>
      </a-menu>
      <div class="header-side">
        <a-input
          class="head-search-btn"
          enter-button="Search"
          placeholder="请输入小说或作者名称"
          v-model:value.trim="keywords"
          @keyup.enter.stop="searchDetails()"
          :maxLength="200"
        >
          <template #suffix>
            <span class="header-btn-group">
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
    <a-layout-content style="padding: 0 50px">
      <a-layout style="padding: 24px 0; background: #fff">
        <a-layout-content :style="{ padding: '0 24px', minHeight: '280px' }">
          <router-view />
        </a-layout-content>
      </a-layout>
    </a-layout-content>
    <a-layout-footer style="text-align: center">
      ©2022 Created by Z
    </a-layout-footer>
  </a-layout>
</template>
<script>
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";

import {
  VideoCameraOutlined,
  ReadOutlined,
  SearchOutlined,
} from "@ant-design/icons-vue";
export default defineComponent({
  components: { VideoCameraOutlined, ReadOutlined, SearchOutlined },
  name: "lay_out",
  setup() {
    const router = useRouter();
    const toPath = (path) => {
      router.push({
        path: path,
      });
    };
    return {
      keywords: ref(""),
      selectedKey: ref([router.currentRoute.value.path]),
      toPath,
    };
  },
  methods: {
    searchDetails() {},
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
</style>
