<template>
  <el-dialog
    :title="isImportRssSource ? '导入RSS源' : '导入书源'"
    :visible="isShow"
    :width="dialogWidth"
    :top="this.collapseMenu ? '0' : '15vh'"
    :fullscreen="collapseMenu"
    :class="isWebApp && !isNight ? 'status-bar-light-bg' : ''"
  >
    <div class="source-container source-list-container">
      <el-checkbox-group
        v-model="checkedSourceIndex"
        @change="handleCheckedSourcesChange"
      >
        <el-checkbox
          v-for="(source, index) in importSourceList"
          :label="index"
          :key="index"
          class="source-checkbox"
          >{{ isImportRssSource ? source.sourceName : source.bookSourceName }}
          {{
            isImportRssSource ? source.sourceUrl : source.bookSourceUrl
          }}</el-checkbox
        >
      </el-checkbox-group>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-checkbox
          :indeterminate="isIndeterminate"
          v-model="checkAll"
          @change="handleCheckAllChange"
          border
          size="medium"
          class="float-left"
          >全选</el-checkbox
        >
        <span class="check-tip">已选择 {{ checkedSourceIndex.length }} 个</span>
        <el-button size="medium" @click="$emit('update:isShow', false)"
          >取消</el-button
        >
        <el-button size="medium" type="primary" @click="saveSourceList"
          >确定</el-button
        >
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { cacheFirstRequest } from "../../../plugins/helper";

export default {
  name: "ImportSource",
  data() {
    return {
      checkedSourceIndex: [],
      importSourceList: [],
      isIndeterminate: false,
      checkAll: false,
    };
  },
  props: {
    isImportRssSource: { type: Boolean, default: false },
    isShow: { type: Boolean, default: true },
  },
  computed: {
    dialogWidth() {
      return this.collapseMenu ? "85%" : "700px";
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
    collapseMenu() {
      return this.$store.state.miniInterface;
    },
    isNight() {
      return this.$store.getters.isNight;
    },
  },
  mounted() {},
  watch: {},
  methods: {
    handleCheckedSourcesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.importSourceList.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.importSourceList.length;
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
                // this.isImportRssSource = false;
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
    handleCheckAllChange(val) {
      this.checkedSourceIndex = val
        ? this.importSourceList.map((_v, i) => i)
        : [];
      this.isIndeterminate = false;
    },
    saveSourceList() {
      if (!this.$store.state.connected) {
        this.$message.error("后端未连接");
        return;
      }
      if (!this.checkedSourceIndex.length) {
        this.$message.error("请选择需要导入的源");
        return;
      }
      const sourceList = this.checkedSourceIndex.map(
        (v) => this.importSourceList[v]
      );
      this.axios
        .post(
          this.api +
            (this.isImportRssSource ? "/saveRssSources" : "/saveSources"),
          sourceList
        )
        .then(
          (res) => {
            if (res.data.isSuccess) {
              //
              this.$message.success(
                this.isImportRssSource ? "导入RSS源成功" : "导入书源成功"
              );
              if (this.isImportRssSource) {
                this.loadRssSources(true);
              } else {
                this.loadBookSource(true);
              }
              this.showImportSourceDialog = false;
              // this.isImportRssSource = false;
            }
          },
          (error) => {
            this.$message.error(
              (this.isImportRssSource ? "导入RSS源失败 " : "导入书源失败 ") +
                (error && error.toString())
            );
          }
        );
    },
    loadRssSources(refresh) {
      return cacheFirstRequest(
        () =>
          this.axios.get(this.api + "/getRssSources", {
            params: {
              simple: 1,
            },
          }),
        "rssSources@" + "default",
        refresh,
        true
      ).then(
        (res) => {
          const data = res.data.data || [];
          this.$store.commit("setRssSourceList", data);
        },
        (error) => {
          this.$message.error(
            "加载RSS订阅列表失败 " + (error && error.toString())
          );
        }
      );
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
  },
};
</script>

<style lang="scss" scoped></style>
