<template>
  <el-dialog
    v-model:visible="showBookSourceManageDialog"
    :width="dialogWidth"
    :top="dialogTop"
    @closed="
      showSourceGroup = '';
      $emit('update:isShow', false);
    "
    :fullscreen="collapseMenu"
    :class="isWebApp && !isNight ? 'status-bar-light-bg-dialog' : ''"
  >
    <template #title>
      <div class="custom-dialog-title">
        <span class="el-dialog__title"
          >{{ isShowFailureBookSource ? "失效书源管理" : "书源管理" }}
          <span class="float-right span-btn" @click="editBookSource(false)"
            >新增</span
          >
        </span>
      </div>
    </template>

    <div class="source-container table-container">
      <div class="check-form" v-if="isShowFailureBookSource">
        <span>搜索词：</span>
        <el-input v-model="checkBookSourceConfig.keyword" size="small">
        </el-input>
        <span style="min-width: 68px">超时(ms)：</span>
        <el-input-number
          v-model="checkBookSourceConfig.timeout"
          :min="1000"
          :max="15000"
          :step="500"
          size="small"
        >
        </el-input-number>
        <span>并发数：</span>
        <el-input-number
          v-model="checkBookSourceConfig.concurrent"
          :min="3"
          :max="15"
          :step="1"
          size="small"
        >
        </el-input-number>
      </div>
      <div class="source-group-wrapper">
        <el-tag
          type="info"
          :effect="$store.getters.isNight ? 'dark' : 'light'"
          class="source-group-btn"
          :class="showSourceGroup === name ? 'selected' : ''"
          v-for="name in bookSourceShowGroup"
          :key="'sourceGroup-' + name"
          @click="setShowSourceGroup(name)"
        >
          {{ name }}
        </el-tag>
      </div>
      <el-table
        :data="bookSourceShowResultPageList"
        :height="
          dialogContentHeight - 42 - 42 - (isShowFailureBookSource ? 32 : 0)
        "
        @selection-change="manageSourceSelection = $event"
        :key="isShowFailureBookSource"
      >
        <el-table-column
          type="selection"
          width="25"
          fixed
          :selectable="isBookSourceSelectable"
        >
        </el-table-column>
        <el-table-column
          property="bookSourceName"
          label="书源名称"
          min-width="120"
          fixed
        ></el-table-column>
        <el-table-column
          property="bookSourceUrl"
          label="书源链接"
          min-width="120"
        >
          <template v-slot="scope">
            <el-link
              type="primary"
              :href="scope.row.bookSourceUrl"
              target="_blank"
              >{{ scope.row.bookSourceUrl }}</el-link
            >
          </template>
        </el-table-column>
        <el-table-column
          property="errorMsg"
          label="错误信息"
          min-width="120"
          v-if="isShowFailureBookSource"
        ></el-table-column>
        <el-table-column label="书架书籍" min-width="120">
          <template v-slot="scope">
            <pre>{{ showSourceBook(scope.row) }}</pre>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="100px"
          v-if="!isShowFailureBookSource"
        >
          <template v-slot="scope">
            <el-button type="text" @click="editBookSource(scope.row)"
              >编辑</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="source-pagination">
        <el-pagination
          v-model:current-page="bookSourcePagination.page"
          :page-sizes="[25, 50, 100, 200, 300, 400]"
          v-model:page-size="bookSourcePagination.size"
          layout="total, sizes, prev, pager, next"
          :total="bookSourceShowLength"
          :pager-count="collapseMenu ? 5 : 7"
        >
        </el-pagination>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button
          type="primary"
          class="float-left"
          size="medium"
          @click="deleteBookSourceList"
          >批量删除</el-button
        >
        <span class="check-tip"
          >已选择 {{ manageSourceSelection.length }} 个</span
        >
        <el-button
          @click="checkBookSource"
          v-if="isShowFailureBookSource"
          size="medium"
          style="margin-bottom: 5px"
          :disabled="isCheckingBookSource"
          >{{ isCheckingBookSource ? "正在" : "" }}检测书源
          {{ checkBookSourceTip }}</el-button
        >
        <el-button @click="$emit('update:isShow', false)" size="medium"
          >取消</el-button
        >
      </div></template
    >
  </el-dialog>
</template>
<script>
import { errorTypeList } from "../../../plugins/config";
import { LimitResquest, cacheFirstRequest } from "../../../plugins/helper";
export default {
  name: "BookSource",
  data() {
    return {
      showBookSourceManageDialog: true,
      isCheckingBookSource: false,
      bookSourcePagination: {
        page: 1,
        size: 25,
      },
      checkBookSourceTip: "",
      checkBookSourceConfig: {
        keyword: "斗罗大陆",
        timeout: 5000,
        concurrent: 5,
      },
      manageSourceSelection: [],
    };
  },
  props: ["isShowFailureBookSource"],
  computed: {
    bookSourceList() {
      return this.$store.state.bookSourceList;
    },
    bookSourceShowList() {
      return this.isShowFailureBookSource
        ? this.$store.state.failureBookSource
        : this.bookSourceList;
    },
    bookSourceShowGroup() {
      if (!this.isShowFailureBookSource) {
        const groups = new Set();
        this.bookSourceShowList.forEach((v) => {
          v.bookSourceGroup && groups.add(v.bookSourceGroup);
        });
        groups.add("未分组");
        return Array.from(groups);
      } else {
        return [].concat(errorTypeList).concat(["timeout"]);
      }
    },
    dialogWidth() {
      return this.collapseMenu ? "85%" : "700px";
    },
    collapseMenu() {
      return this.$store.state.miniInterface;
    },
    dialogContentHeight() {
      if (this.collapseMenu) {
        return this.$store.state.windowSize.height - 54 - 60 - 70;
      }
      return Math.min(
        0.7 * this.$store.state.windowSize.height - 70 - 54 - 60,
        400
      );
    },
    dialogTop() {
      return (
        (this.$store.state.windowSize.height -
          this.dialogContentHeight -
          70 -
          54 -
          60) /
          2 +
        "px"
      );
    },
    bookSourceShowLength() {
      return this.bookSourceShowResult.length;
    },
    bookSourceShowResult() {
      if (!this.showSourceGroup) {
        return this.bookSourceShowList;
      }
      if (this.isShowFailureBookSource) {
        return this.bookSourceShowList.filter((v) =>
          this.showSourceGroup
            ? v.errorMsg.indexOf(this.showSourceGroup) >= 0
            : true
        );
      } else {
        return this.bookSourceShowList.filter((v) =>
          this.showSourceGroup === "未分组"
            ? !v.bookSourceGroup
            : v.bookSourceGroup === this.showSourceGroup
        );
      }
    },
  },
  mounted() {
    if (this.isShowFailureBookSource) {
      this.getInvalidBookSources();
    }
  },
  watch: {},
  methods: {
    async deleteBookSourceList() {
      if (!this.manageSourceSelection.length) {
        this.$message.error("请选择需要删除的源");
        return;
      }
      const res = await this.$confirm("确认要删除所选择的书源吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).catch(() => {
        return false;
      });
      if (!res) {
        return;
      }
      this.axios
        .post(this.api + "/deleteSources", this.manageSourceSelection)
        .then(
          (res) => {
            if (res.data.isSuccess) {
              this.$store.commit(
                "removeFailureBookSource",
                this.manageSourceSelection
              );
              this.manageSourceSelection = [];
              this.$message.success("删除书源成功");
              this.loadBookSource(true);
            }
          },
          (error) => {
            this.$message.error("删除书源失败 " + (error && error.toString()));
          }
        );
    },
    isBookSourceSelectable(bookSource) {
      const res = [];
      (this.$store.state.shelfBooks || []).forEach((v) => {
        if (v.origin === bookSource.bookSourceUrl) {
          res.push(v.name);
        }
      });
      return !res.length;
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
    showSourceBook(bookSource) {
      const res = [];
      (this.$store.state.shelfBooks || []).forEach((v) => {
        if (v.origin === bookSource.bookSourceUrl) {
          res.push(v.name);
        }
      });
      return res.join("\n");
    },
    bookSourceShowResultPageList() {
      const start =
        (this.bookSourcePagination.page - 1) * this.bookSourcePagination.size;
      if (start > this.bookSourceShowResult.length) {
        return [];
      }
      return this.bookSourceShowResult.slice(
        start,
        Math.min(
          start + this.bookSourcePagination.size,
          this.bookSourceShowResult.length
        )
      );
    },
    // 获取失效书源
    getInvalidBookSources() {
      if (!this.$store.state.connected) {
        this.$message.error("后端未连接");
        return;
      }
      this.axios.post(this.api + "/getInvalidBookSources").then(
        (res) => {
          if (res.data.isSuccess) {
            res.data.data.forEach((v) => {
              this.$store.commit("addFailureBookSource", {
                bookSourceUrl: v.sourceUrl,
                errorMsg: v.error,
              });
            });
          }
        },
        () => {
          //
        }
      );
    },
    async checkBookSource() {
      if (!this.checkBookSourceConfig.keyword) {
        this.$message.error("请输入搜索关键词");
        return;
      }
      this.isCheckingBookSource = true;
      this.$store.commit("setFailureIncludeTimeout", true);
      const limitFunc = LimitResquest(
        this.checkBookSourceConfig.concurrent,
        (handler) => {
          this.checkBookSourceTip =
            handler.requestCount + "/" + this.bookSourceList.length;
          if (handler.isEnd()) {
            this.isCheckingBookSource = false;
            this.$store.commit("setFailureIncludeTimeout", false);
          }
        }
      );
      this.bookSourceList.forEach((v) => {
        limitFunc(() => {
          return this.axios.get(this.api + "/searchBook", {
            timeout: this.checkBookSourceConfig.timeout,
            params: {
              key: this.checkBookSourceConfig.keyword,
              bookSourceUrl: v.bookSourceUrl,
            },
            silent: true,
          });
        });
      });
    },
    editBookSource(bookSource) {
      const editHandler = (data) => {
        this.$emit(
          "showEditor",
          "编辑书源",
          JSON.stringify(data, null, 4),
          (content, close) => {
            try {
              const source = JSON.parse(content);
              if (!source.bookSourceName) {
                this.$message.error("书源名称不能为空");
                return;
              }
              if (!source.bookSourceUrl) {
                this.$message.error("书源链接不能为空");
                return;
              }
              this.axios.post(this.api + "/saveSource", source).then(
                (res) => {
                  if (res.data.isSuccess) {
                    //
                    close();
                    this.$message.success("保存书源成功");
                    this.loadBookSource(true);
                  }
                },
                (error) => {
                  this.$message.error(
                    "保存书源失败 " + (error && error.toString())
                  );
                }
              );
            } catch (e) {
              this.$message.error("书源必须是JSON格式");
            }
          }
        );
      };
      if (!bookSource) {
        editHandler({
          bookSourceComment: "",
          bookSourceGroup: "",
          bookSourceName: "新增书源",
          bookSourceType: 0,
          bookSourceUrl: "",
          bookUrlPattern: "",
          enabled: true,
          enabledExplore: true,
          exploreUrl: "",
          ruleBookInfo: {},
          ruleContent: {
            content: "",
          },
          ruleExplore: {},
          ruleSearch: {
            author: "",
            bookList: "",
            bookUrl: "",
            coverUrl: "",
            intro: "",
            kind: "",
            lastChapter: "",
            name: "",
          },
          ruleToc: {
            chapterList: "",
            chapterName: "",
            chapterUrl: "",
          },
          searchUrl: "",
        });
        return;
      }
      this.axios
        .post(this.api + "/getSource", {
          bookSourceUrl: bookSource.bookSourceUrl,
        })
        .then(
          (res) => {
            if (res.data.isSuccess) {
              //
              editHandler(res.data.data);
            }
          },
          (error) => {
            this.$message.error(
              "加载书源信息失败 " + (error && error.toString())
            );
          }
        );
    },
  },
};
</script>
