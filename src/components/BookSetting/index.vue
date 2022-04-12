<template>
  <div class="navigation-inner-wrapper">
    <div class="navigation-title">通用阅读器</div>
    <div class="setting-wrapper search-setting">
      <div class="setting-title">搜索设置</div>
      <div class="setting-item">
        <el-select
          size="mini"
          v-model="searchConfig.searchType"
          class="setting-select"
          filterable
          placeholder="请选择搜索方式"
        >
          <el-option
            v-for="(item, index) in searchTypeList"
            :key="'search-type-' + index"
            :label="item.name"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
      <div class="setting-item" v-show="searchConfig.searchType === 'single'">
        <el-select
          size="mini"
          v-model="searchConfig.bookSourceUrl"
          class="setting-select"
          filterable
          placeholder="请选择搜索书源"
        >
          <el-option
            v-for="(item, index) in bookSourceList"
            :key="'source-' + index"
            :label="item.bookSourceName"
            :value="item.bookSourceUrl"
          >
          </el-option>
        </el-select>
      </div>
      <div class="setting-item" v-show="searchConfig.searchType !== 'single'">
        <el-select
          size="mini"
          v-model="searchConfig.bookSourceGroup"
          class="setting-select"
          filterable
          placeholder="请选择搜索书源分组"
        >
          <el-option
            v-for="(item, index) in bookSourceGroupList"
            :key="'source-group-' + index"
            :label="item.name + ' (' + item.count + ')'"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
      <div class="setting-item" v-show="searchConfig.searchType !== 'single'">
        <el-select
          size="mini"
          v-model="searchConfig.concurrentCount"
          class="setting-select"
          filterable
          placeholder="请选择并发线程"
        >
          <el-option
            v-for="(item, index) in concurrentList"
            :key="'source-' + index"
            :label="item"
            :value="item"
          >
          </el-option>
        </el-select>
      </div>
    </div>

    <div class="setting-wrapper">
      <div class="setting-title">书源设置</div>
      <div class="setting-item">
        <el-tag
          type="info"
          :effect="tagEffect"
          class="setting-btn"
          @click="showBookSourceManageDialog = true"
        >
          书源管理
        </el-tag>

        <el-popover
          placement="right"
          :width="popupWidth"
          trigger="click"
          :visible-arrow="false"
          v-model="popExploreVisible"
          popper-class="popper-component"
        >
          <Explore
            ref="popExplore"
            class="popup"
            :visible="popExploreVisible"
            :bookSourceList="bookSourceList"
            @showSearchList="showSearchList"
            @close="popExploreVisible = false"
          />
        </el-popover>

        <el-tag
          type="info"
          :effect="tagEffect"
          class="setting-btn"
          @click="uploadBookSource"
        >
          导入书源
        </el-tag>

        <el-tag
          type="info"
          :effect="tagEffect"
          class="setting-btn"
          @click="loadRemoteBookSource"
        >
          远程书源
        </el-tag>
        <el-tag
          type="info"
          :effect="tagEffect"
          class="setting-btn"
          @click="loadBookSource(true)"
        >
          缓存书源
        </el-tag>
        <el-tag
          type="info"
          :effect="tagEffect"
          class="setting-btn"
          @click="showFailureBookSource()"
        >
          失效书源
        </el-tag>
        <input
          ref="fileRef"
          type="file"
          @change="onSourceFileChange"
          style="display: none"
        />
      </div>
    </div>
    <div class="setting-wrapper">
      <div class="setting-title">书架设置</div>
      <div class="setting-item">
        <el-tag
          type="info"
          :effect="tagEffect"
          class="setting-btn"
          @click="showManageBookGroup"
        >
          分组管理
        </el-tag>
      </div>
    </div>
    <div class="setting-wrapper">
      <div class="setting-title">
        本地缓存
        <span class="cache-stats-total">{{ localCacheStats.total }}</span>
      </div>
      <div class="setting-item">
        <el-tag
          type="info"
          :effect="tagEffect"
          class="setting-btn"
          @click="clearCache('bookSourceList')"
        >
          清空书源缓存
          <span>{{ localCacheStats.bookSourceList }}</span>
        </el-tag>
        <el-tag
          type="info"
          :effect="tagEffect"
          class="setting-btn"
          @click="clearCache('rssSources')"
        >
          清空RSS源缓存
          <span>{{ localCacheStats.rssSources }}</span>
        </el-tag>
        <el-tag
          type="info"
          :effect="tagEffect"
          class="setting-btn"
          @click="clearCache('chapterList')"
        >
          清空章节列表缓存
          <span>{{ localCacheStats.chapterList }}</span>
        </el-tag>
        <el-tag
          type="info"
          :effect="tagEffect"
          class="setting-btn"
          @click="clearCache('chapterContent')"
        >
          清空章节内容缓存
          <span>{{ localCacheStats.chapterContent }}</span>
        </el-tag>
      </div>
    </div>

    <BookSource
      v-if="showBookSourceManageDialog"
      v-model:isShow="showBookSourceManageDialog"
      :isShowFailureBookSource="isShowFailureBookSource"
    ></BookSource>

    <ImportSource
      v-if="showImportSourceDialog"
      v-model:isShow="showImportSourceDialog"
      v-model:isImportRssSource="isImportRssSource"
    ></ImportSource>
  </div>
</template>

<script>
import Explore from "../Explore.vue";
import BookSource from "./modules/BookSource.vue";
import ImportSource from "./modules/ImportSource.vue";

import { formatSize, cacheFirstRequest } from "../../plugins/helper";
import { getBytesLength } from "../../plugins/string.js";
export default {
  name: "BookSource",
  components: {
    Explore,
    BookSource,
    ImportSource,
  },
  data() {
    return {
      popExploreVisible: false,
      isShowFailureBookSource: false,
      showBookSourceManageDialog: false,
      // 查詢下拉選擇
      searchTypeList: [
        { name: "单源搜索", value: "single" },
        { name: "多源搜索(过滤书名/作者名)", value: "multi" },
      ],
      concurrentList: [12, 18, 24, 30, 36, 42, 48, 54, 60],
      // 缓存
      localCacheStats: {
        total: "0 Bytes",
        bookSourceList: "0 Bytes",
        rssSources: "0 Bytes",
        chapterList: "0 Bytes",
        chapterContent: "0 Bytes",
      },
      searchResult: [],
      importSourceList: [],
      webdavCurrentPath: "/",

      // 导入RSS源\导入书源
      showImportSourceDialog: false,
      isImportRssSource: false,
    };
  },
  activated() {
    this.scanLocalStorage();
  },
  props: [],
  mounted() {
    this.loadBookSource();
  },
  computed: {
    tagEffect() {
      return this.$store.getters.isNight ? "dark" : "light";
    },
    popupWidth() {
      return this.collapseMenu ? this.$store.state.windowSize.width : "600";
    },
    // 书源缓存
    bookSourceList() {
      return this.$store.state.bookSourceList;
    },
    // 查询模式设置
    searchConfig: {
      get() {
        return this.$store.state.searchConfig;
      },
      set(val) {
        this.$store.commit("setSearchConfig", val);
      },
    },
    // 获取书籍分組
    bookSourceGroupList() {
      const groupsMap = {};
      this.bookSourceList.forEach((v) => {
        if (v.bookSourceGroup) {
          groupsMap[v.bookSourceGroup] = (groupsMap[v.bookSourceGroup] | 0) + 1;
        }
      });
      const groups = [
        {
          name: "全部分组",
          value: "",
          count: this.bookSourceList.length,
        },
      ];
      for (const i in groupsMap) {
        if (Object.hasOwnProperty.call(groupsMap, i)) {
          groups.push({
            name: i,
            value: i,
            count: groupsMap[i],
          });
        }
      }
      return groups;
    },
  },
  methods: {
    scanLocalStorage() {
      this.localCacheStats = {
        total: this.analyseLocalStorage().totalBytes,
        bookSourceList: this.analyseLocalStorage("bookSourceList").totalBytes,
        rssSources: this.analyseLocalStorage("rssSources").totalBytes,
        chapterList: this.analyseLocalStorage("chapterList").totalBytes,
        chapterContent: this.analyseLocalStorage("chapterContent").totalBytes,
      };
    },
    analyseLocalStorage(match) {
      let totalBytes = 0;
      let cacheBytes = 0;
      try {
        for (const key in window.localStorage) {
          if (!match || key.indexOf(match) >= 0) {
            if (Object.hasOwnProperty.call(window.localStorage, key)) {
              const data = window.localStorage[key];
              totalBytes += getBytesLength(data);
              if (key.startsWith("localCache@")) {
                cacheBytes += getBytesLength(data);
              }
            }
          }
        }
      } catch (e) {
        //
      }
      return {
        totalBytes: formatSize(totalBytes),
        cacheBytes: formatSize(cacheBytes),
      };
    },
    clearCache(match) {
      let cacheBytes = 0;
      try {
        for (const key in window.localStorage) {
          if (!match || key.indexOf(match) >= 0) {
            if (Object.hasOwnProperty.call(window.localStorage, key)) {
              const data = window.localStorage[key];
              if (key.startsWith("localCache@")) {
                cacheBytes += getBytesLength(data);
                window.localStorage.removeItem(key);
              }
            }
          }
        }
      } catch (e) {
        //
      }

      this.scanLocalStorage();

      return {
        cacheBytes: formatSize(cacheBytes),
      };
    },
    async loadRemoteBookSource() {
      const res = await this.$prompt("请输入远程书源链接", "导入远程书源文件", {
        inputValue: "",
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      }).catch(() => {
        return false;
      });
      if (!res || !res.value) {
        return;
      }
      this.axios
        .post(this.api + "/readRemoteSourceFile", {
          url: res.value,
        })
        .then(
          (res) => {
            if (res.data.isSuccess) {
              //
              let sourceList = [];
              res.data.data.forEach((v) => {
                try {
                  const data = JSON.parse(v);
                  if (Array.isArray(data)) {
                    sourceList = sourceList.concat(data);
                  }
                } catch (error) {
                  //
                }
              });
              if (sourceList.length) {
                this.importSourceList = sourceList;
                this.showImportSourceDialog = true;
                this.isImportRssSource = false;
              } else {
                this.$message.error("远程书源文件错误");
              }
            }
          },
          (error) => {
            this.$message.error(
              "读取远程书源文件内容失败 " + (error && error.toString())
            );
          }
        );
    },
    showSearchList(data) {
      this.searchResult = data;
      // this.isSearchResult = true;
      // this.isExploreResult = true;
      // this.loadingMore = false;
    },
    onSourceFileChange(event, isRssSource) {
      const rawFile = event.target.files && event.target.files[0];
      // console.log("rawFile", rawFile);
      const reader = new FileReader();
      const sourceTypeName = isRssSource ? "RSS源" : "书源";
      reader.onload = (e) => {
        const data = e.target.result;
        try {
          this.importSourceList = JSON.parse(data);
          this.showImportSourceDialog = true;
          this.isImportRssSource = !!isRssSource;
        } catch (error) {
          this.$message.error(sourceTypeName + "文件错误");
        }
      };
      reader.onerror = () => {
        // console.log("FileReader error", e);
        // FileReader 读取出错，只能上传读取了
        let param = new FormData();
        param.append("file", rawFile);
        this.axios
          .post(this.api + "/readSourceFile", param, {
            headers: { "Content-Type": "multipart/form-data" },
          })
          .then(
            (res) => {
              if (res.data.isSuccess) {
                //
                let sourceList = [];
                res.data.data.forEach((v) => {
                  try {
                    const data = JSON.parse(v);
                    if (Array.isArray(data)) {
                      sourceList = sourceList.concat(data);
                    }
                  } catch (error) {
                    //
                  }
                });
                if (sourceList.length) {
                  this.importSourceList = sourceList;
                  this.showImportSourceDialog = true;
                  this.isImportRssSource = !!isRssSource;
                } else {
                  this.$message.error(sourceTypeName + "文件错误");
                }
              }
            },
            (error) => {
              this.$message.error(
                "读取" +
                  sourceTypeName +
                  "文件内容失败 " +
                  (error && error.toString())
              );
            }
          );
      };
      reader.readAsText(rawFile);
      if (isRssSource) {
        this.$refs.rssInputRef.value = null;
      } else {
        this.$refs.fileRef.value = null;
      }
    },
    loadBookSource(refresh) {
      return cacheFirstRequest(
        () =>
          this.axios.get(this.api + "/getSources", {
            params: {
              simple: 1,
            },
          }),
        "bookSourceList@" + "default",
        refresh,
        true
      ).then(
        (res) => {
          if (res.data.isSuccess) {
            this.$store.commit("setBookSourceList", res.data.data || []);
          }
        },
        (error) => {
          this.$message.error(
            "加载书源列表失败 " + (error && error.toString())
          );
        }
      );
    },
    uploadBookSource() {
      this.$refs.fileRef.dispatchEvent(new MouseEvent("click"));
    },
    // 导入书籍
    importLocalBook() {
      this.$refs.bookRef.dispatchEvent(new MouseEvent("click"));
    },
    // 失效书源
    showFailureBookSource() {
      this.isShowFailureBookSource = true;
      this.showBookSourceManageDialog = true;
    },
    showManageBookGroup() {
      this.loadBookGroup(true);
      this.showBookGroupManageDialog = true;
    },
    loadBookGroup(refresh) {
      return cacheFirstRequest(
        () => this.axios.get(this.api + "/getBookGroups"),
        "bookGroup@" + "default",
        refresh,
        true
      ).then(
        (res) => {
          if (res.data.isSuccess) {
            this.$store.commit("setBookGroupList", res.data.data || []);
          }
        },
        (error) => {
          this.$message.error(
            "加载分组列表失败 " + (error && error.toString())
          );
        }
      );
    },
    updateForce() {
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker
          .getRegistrations()
          .then(async function (registrations) {
            /* eslint-disable-next-line no-console */
            console.log("registrations", registrations);
            for (let i = 0; i < registrations.length; i++) {
              await registrations[i].update();
            }

            /* eslint-disable-next-line no-console */
            console.log("Try to clear home cache");
            navigator.serviceWorker.controller &&
              navigator.serviceWorker.controller.postMessage({
                type: "CLEAR_HOME_CACHE",
              });

            /* eslint-disable-next-line no-console */
            console.log("Try to skip waiting");
            navigator.serviceWorker.controller &&
              navigator.serviceWorker.controller.postMessage({
                type: "SKIP_WAITING",
              });

            setTimeout(() => {
              /* eslint-disable-next-line no-console */
              console.log("Try to reload force");
              window.location.reload(true);
            }, 50);
          });
      }
    },
  },
};
</script>

<style lang="sass" scoped>
.navigation-inner-wrapper {
  padding: 48px 36px 66px 36px;
  height: 100%;
  width: 300px;
  overflow-y: auto;
  box-sizing: border-box;
}

.navigation-title {
  font-size: 24px;
  font-weight: 600;
  font-family: -apple-system, 'Noto Sans', 'Helvetica Neue', Helvetica, 'Nimbus Sans L', Arial, 'Liberation Sans', 'PingFang SC', 'Hiragino Sans GB', 'Noto Sans CJK SC', 'Source Han Sans SC', 'Source Han Sans CN', 'Microsoft YaHei', 'Wenquanyi Micro Hei', 'WenQuanYi Zen Hei', 'ST Heiti', SimHei, 'WenQuanYi Zen Hei Sharp', sans-serif;

  .version-text {
    float: right;
    font-size: 14px;
    line-height: 33px;
    font-weight: 400;
    color: #b1b1b1;
    display: inline-block;
    cursor: pointer;
  }
}

.navigation-sub-title {
  font-size: 16px;
  font-weight: 500;
  font-family: -apple-system, 'Noto Sans', 'Helvetica Neue', Helvetica, 'Nimbus Sans L', Arial, 'Liberation Sans', 'PingFang SC', 'Hiragino Sans GB', 'Noto Sans CJK SC', 'Source Han Sans SC', 'Source Han Sans CN', 'Microsoft YaHei', 'Wenquanyi Micro Hei', 'WenQuanYi Zen Hei', 'ST Heiti', SimHei, 'WenQuanYi Zen Hei Sharp', sans-serif;
  margin-top: 16px;
  color: #b1b1b1;
}

.search-wrapper {
  .search-input {
    border-radius: 50%;
    margin-top: 24px;

    >>> .el-input__inner {
      border-radius: 50px;
      border-color: #E3E3E3;
    }
  }
}

.recent-wrapper {
  margin-top: 36px;

  .recent-title {
    font-size: 14px;
    color: #b1b1b1;
    font-family: -apple-system, 'Noto Sans', 'Helvetica Neue', Helvetica, 'Nimbus Sans L', Arial, 'Liberation Sans', 'PingFang SC', 'Hiragino Sans GB', 'Noto Sans CJK SC', 'Source Han Sans SC', 'Source Han Sans CN', 'Microsoft YaHei', 'Wenquanyi Micro Hei', 'WenQuanYi Zen Hei', 'ST Heiti', SimHei, 'WenQuanYi Zen Hei Sharp', sans-serif;
  }

  .reading-recent {
    margin: 18px 0;

    .recent-book {
      cursor: pointer;
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}

.setting-wrapper {
  margin-top: 36px;

  .setting-title {
    font-size: 14px;
    color: #b1b1b1;
    font-family: -apple-system, 'Noto Sans', 'Helvetica Neue', Helvetica, 'Nimbus Sans L', Arial, 'Liberation Sans', 'PingFang SC', 'Hiragino Sans GB', 'Noto Sans CJK SC', 'Source Han Sans SC', 'Source Han Sans CN', 'Microsoft YaHei', 'Wenquanyi Micro Hei', 'WenQuanYi Zen Hei', 'ST Heiti', SimHei, 'WenQuanYi Zen Hei Sharp', sans-serif;

    .cache-stats-total {
      float: right;
      display: inline-block;
      height: 20px;
      line-height: 20px;
    }
  }

  .no-point {
    pointer-events: none;
  }

  .setting-connect {
    cursor: pointer;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .setting-item {
    padding-top: 16px;
  }

  .setting-btn {
    margin-right: 15px;
    margin-bottom: 15px;
    cursor: pointer;
  }

  .setting-select {
    width: 100%;
  }
}

.search-setting {
  margin-top: 28px;
}

.bottom-icons {
  position: absolute;
  bottom: 30px;
  width: 188px;
  left: 36px;
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  pointer-events: none;

  .bottom-icon {
    height: 36px;
    pointer-events: all;

    img {
      width: 36px;
      height: 36px;
    }
  }

  .theme-item {
    line-height: 32px;
    width: 36px;
    height: 36px;
    border-radius: 100%;
    display: inline-block;
    cursor: pointer;
    text-align: center;
    vertical-align: middle;
    pointer-events: all;

    .el-icon-moon {
      color: #f7f7f7;
      line-height: 34px;
    }

    .el-icon-sunny {
      color: #121212;
      line-height: 34px;
    }
  }
}

.setting-wrapper:nth-last-child(1) {
  padding-bottom: 20px;
}
</style>
