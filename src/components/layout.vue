<template>
  <Layout class="layout" theme="dark">
    <LayoutHeader class="header">
      <div class="layout-head-panle">
        <div class="layout-head">
          <div class="logo-goroup" @click="toPath('/videoIndex')">
            <div class="logo-bg"></div>
            <span class="logo-label"> 酷我视频</span>
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
            <Input
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
            </Input>
            <div class="header-btn-group">
              <Popover>
                <template #content>
                  <div class="play-history">
                    <div class="play-history-title">播放记录</div>
                    <div class="play-history-content">
                      <template
                        v-for="item in playHistoryList"
                        :key="item.title"
                      >
                        <div class="history-item">
                          <div class="img-info">
                            <Image
                              class="img-panle"
                              :src="getImgUrl(item.imgSrc)"
                              :preview="false"
                              fallback="data:image/png;base64,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"
                            >
                            </Image>
                          </div>
                          <div class="history-item-content">
                            <div class="history-item-title">
                              {{ item.title }}
                            </div>
                            <div class="history-item-description">
                              {{ item.description }}
                            </div>
                          </div>
                        </div>
                      </template>
                    </div>
                  </div>
                </template>
                <clock-circle-outlined title="播放记录" />
              </Popover>
              <github-outlined title="查看源码" @click="openGit()" />
              <comment-outlined title="反馈" @click="openGit()" />
            </div>
          </div>
        </div>
      </div>
    </LayoutHeader>
    <LayoutContent>
      <router-view />
    </LayoutContent>
    <LayoutFooter>
      <div>1、本站提供的所有内容仅供学习、交流与参考。</div>
      <div>
        2、本站所有资源均已标明来源，如未经许可进行转载使用，请务必标明或保留文章原始出处和作者的信息。
      </div>
      <span> Copyright © 2022 zyy All Rights Reserved </span>
    </LayoutFooter>
  </Layout>
</template>
<script>
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import { getCacheImages } from "@/plugins/utils.js";
import {
  Layout,
  LayoutHeader,
  LayoutContent,
  LayoutFooter,
  Input,
  Popover,
} from "ant-design-vue";

// 图标
import {
  GithubOutlined,
  SearchOutlined,
  CommentOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons-vue";

export default defineComponent({
  components: {
    Layout,
    LayoutHeader,
    LayoutContent,
    LayoutFooter,
    Input,
    Popover,
    SearchOutlined,
    GithubOutlined,
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
      playHistoryList: [
        { title: "播放记录1", imgSrc: "", description: "这是描述" },
      ],
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
      if (this.selectedKey.join("").includes("video")) {
        this.toPath("/videoResult", params);
      } else {
        this.toPath("/bookResult", params);
      }
    },
    // 查看git源码
    openGit() {
      window.open("https://github.com/danhuaxiansheng/vue3-books");
    },
    // 获取图片缓存
    getImgUrl(src) {
      return getCacheImages(src);
    },
  },
});
</script>
<style lang="less" scoped>
@media (max-width: 1789px) {
  .layout {
    width: 1500px;
  }
}

@media (max-width: 1549px) {
  .layout {
    width: 1200px;
  }
}

@media (max-width: 1280px) {
  .layout {
    width: 990px;
  }
}

.layout {
  margin: auto;
  padding: 0 3rem 3rem 3rem;
  background-color: #fff;
  .ant-layout {
    background: #fff;
  }

  .ant-layout-header {
    z-index: 10;
    width: 100%;
    height: 68px;
    color: #666;
    font-size: 12px;
    background-size: cover;
    background-position-y: -168px;
    background-color: #fff;
    padding: 0px;

    .layout-head {
      height: 68px;
      margin: 0 auto;
    }

    .logo-goroup {
      float: left;
      display: flex;
      cursor: pointer;
      .logo-label {
        color: #ff5c38;
        margin-left: 7px;
        font-size: 20px;
        font-weight: 700;
        width: 86px;
        font-style: italic;
      }
      .logo-bg {
        margin-top: 14px;
      }
    }

    .header-side {
      float: right;
      height: 100%;
      .header-btn-group {
        display: inline-block;
        margin-left: 20px;
        .anticon {
          font-size: 26px;
          cursor: pointer;
        }
        .anticon + .anticon {
          margin-left: 20px;
        }
      }

      .head-search-btn {
        outline: 0;
        font-size: 14px;
        background-color: hsla(0, 0%, 100%, 0.18);
        line-height: 28px;
        width: 246px;
        border-color: #ff5c38;
        box-shadow: 0 4px 18px rgb(17 18 38 / 7%);
        transition: max-width 0.2s ease;
        border-radius: 20px;
        padding-left: 16px;
        height: 38px;
        :deep(.ant-input) {
          background-color: transparent;
          color: #999;
          text-shadow: none;
        }

        .search-btn-group {
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
      }
    }
  }

  .ant-layout-content {
    background-color: #fff;
  }

  .ant-layout-footer {
    background-color: #fff;
    padding: 0px;
    margin-top: 25px;
  }
}
</style>

<style lang="less">
.ant-popover-inner-content {
  border-radius: 4px;
  background: #fff;
  box-shadow: 0 28px 50px rgb(25 24 40 / 35%);
}

.play-history {
  width: 310px;

  .play-history-title {
    position: relative;
    color: #ff5c38;
    display: inline-block;
    padding: 0;
    border: none;
    outline: 0 none;
    background: 0 0;
    font-size: 14px;
    line-height: 50px;
    vertical-align: top;
    cursor: pointer;
  }

  .play-history-content {
    .history-item {
      .img-info {
        display: inline-block;
        width: 100px;
        height: 56px;
        overflow: hidden;
        border-radius: 4px;
      }

      .history-item-content {
        display: inline-block;
        .history-item-title {
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          display: block;
          height: 36px;
          overflow: hidden;
          color: #111;
          font-size: 13px;
          line-height: 18px;
          cursor: pointer;
          overflow: hidden;
        }
        .history-item-title:hover {
          color: #ff5c38;
        }
        .history-item-description {
          display: block;
          margin-top: 2px;
          font-size: 12px;
          overflow: hidden;
          color: #999;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
}
</style>
