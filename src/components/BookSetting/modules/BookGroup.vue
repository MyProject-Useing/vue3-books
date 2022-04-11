<template>
  <el-dialog
    :title="isSeetting ? '设置分组' : '分组管理'"
    v-model:visible="isShow"
    :width="dialogWidth"
    :top="dialogTop"
    :fullscreen="collapseMenu"
    :class="isWebApp && !isNight ? 'status-bar-light-bg-dialog' : ''"
    @opened="$refs.bookGroupTableRef.doLayout()"
    @closed="isSeetting = false"
  >
    <div class="source-container table-container">
      <el-table
        :data="showBookGroupList"
        :height="dialogContentHeight"
        @selection-change="bookGroupSelection = $event"
        ref="bookGroupTableRef"
        :key="isSeetting"
      >
        <el-table-column type="selection" width="25" fixed v-if="isSeetting">
        </el-table-column>
        <el-table-column
          property="groupName"
          label="分组名"
          min-width="100"
          fixed
        >
          <template v-slot="scope">
            <span> {{ displayBookGroupName(scope.row) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          property="show"
          label="显示"
          min-width="80"
          v-if="!isSeetting"
        >
          <template v-slot="scope">
            <el-switch
              v-model="scope.row.show"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="true"
              :inactive-value="false"
              @change="toggleBookGroupShow(scope.row, $event)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100px">
          <template v-slot="scope">
            <el-button type="text" @click="saveBookGroup(scope.row)"
              >编辑</el-button
            >
            <el-button
              type="text"
              v-if="
                !isSeetting &&
                scope.row.groupId > 0 &&
                !getShowShelfBooks(scope.row.groupId).length
              "
              @click="deleteBookGroup(scope.row)"
              style="color: #f56c6c"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button
          type="primary"
          size="medium"
          class="float-left"
          @click="saveBookGroup()"
          >添加分组</el-button
        >
        <el-button
          type="primary"
          size="medium"
          @click="setBookGroup"
          v-if="isSeetting"
          >确认</el-button
        >
        <el-button size="medium" @click="$emit('update:isShow', false)"
          >取消</el-button
        >
      </div>
    </template>
  </el-dialog>
</template>
<script>
import { cacheFirstRequest } from "@/plugins/helper";
export default {
  name: "BookSource",
  data() {
    return {
      bookGroupSelection: [],
    };
  },
  props: {},
  computed: {
    shelfBooks() {
      return this.$store.getters.shelfBooks;
    },
    isNight() {
      return this.$store.getters.isNight;
    },
    bookSourceList() {
      return this.$store.state.bookSourceList;
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
    showBookGroupList() {
      if (!this.isSeetting) {
        return this.$store.state.bookGroupList;
      }
      return this.$store.state.bookGroupList.filter((v) => v.groupId > 0);
    },
  },
  mounted() {},
  watch: {},
  methods: {
    async deleteBookGroup(row) {
      const res = await this.$confirm(`确认要删除该分组吗?`, "提示", {
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
        .post(this.api + "/deleteBookGroup", {
          groupId: row.groupId,
        })
        .then(
          (res) => {
            if (res.data.isSuccess) {
              this.$message.success("删除分组成功");
              this.loadBookGroup(true);
            }
          },
          (error) => {
            this.$message.error("删除分组失败 " + (error && error.toString()));
          }
        );
    },
    getShowShelfBooks(bookGroup) {
      // 处理特殊分组
      if (bookGroup === -1) {
        // 全部
        return this.shelfBooks;
      } else if (bookGroup === -2) {
        // 本地
        return this.shelfBooks.filter((v) => v.origin === "loc_book");
      } else if (bookGroup === -3) {
        // 音频
        return this.shelfBooks.filter((v) => v.type === 1);
      } else if (bookGroup === -4) {
        // 未分组
        return this.shelfBooks.filter((v) => v.group === 0);
      }

      return this.shelfBooks.filter((v) =>
        bookGroup === 0 ? true : v.group & bookGroup
      );
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
    async saveBookGroup(bookGroup) {
      const res = await this.$prompt(`${bookGroup ? "编辑分组" : "添加分组"}`, {
        inputValue: bookGroup ? bookGroup.groupName : "",
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputValidator(v) {
          if (!v) {
            return "分组名不能为空";
          }
          return true;
        },
      }).catch(() => {
        return false;
      });
      if (!res) {
        return;
      }
      this.axios
        .post(this.api + "/saveBookGroup", {
          ...bookGroup,
          groupName: res.value,
        })
        .then(
          (res) => {
            if (res.data.isSuccess) {
              this.$message.success(bookGroup ? "修改成功" : "添加成功");
              this.loadBookGroup(true);
            }
          },
          (error) => {
            this.$message.error(
              (bookGroup ? "修改失败" : "添加失败") +
                (error && error.toString())
            );
          }
        );
    },
    toggleBookGroupShow(bookGroup, show) {
      this.axios
        .post(this.api + "/saveBookGroup", {
          ...bookGroup,
          show,
        })
        .then(
          (res) => {
            if (res.data.isSuccess) {
              this.$message.success("修改成功");
              this.loadBookGroup(true);
            }
          },
          (error) => {
            this.$message.error("修改失败 " + (error && error.toString()));
          }
        );
    },
    displayBookGroupName(bookGroup) {
      return (
        bookGroup.groupName +
        (bookGroup.groupId < 0
          ? "(" +
            this.$store.getters.builtInBookGroupMap[bookGroup.groupId] +
            ")"
          : "")
      );
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
  },
};
</script>
