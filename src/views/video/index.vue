<template>
  <div>
    <div class="qy-mod-header">
      <h2 class="qy-mod-title">
        <span class="qy-mod-text">电视剧</span>
      </h2>
    </div>
  </div>
</template>

<script>
// import { message } from "ant-design-vue";
import { isMobile } from "@/plugins/utils";
import { getMovieIndex } from "@/api/movieApi";
// 目录

export default {
  name: "bookIndex",
  // components: { catalog },
  data() {
    return {
      bookLoading: false,

      movieList: {
        tv: [],
        movie: [],
        variety: [],
      },
    };
  },
  computed: {
    // 是否为移动端
    isMobileClass() {
      let isTrue = isMobile();
      return isTrue;
    },
    tv() {
      return this.movieList.tv ?? [];
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      // 重新搜索
      this.movieList = [];
      const key = "videoIndex@key";
      const cacheResult = sessionStorage.getItem(key);
      if (cacheResult) {
        this.movieList = JSON.parse(cacheResult);
      } else {
        // 打开遮罩
        this.refreshLoading = true;
        getMovieIndex()
          .then((result) => {
            this.refreshLoading = false;
            this.movieList = result.data.data || [];
            this.movieList &&
              this.movieList.length > 0 &&
              sessionStorage.setItem(key, JSON.stringify(this.movieList));
          })
          .catch(() => {
            this.refreshLoading = false;
          });
      }
    },
  },
};
</script>

<style scoped>
@import url("./css/index.css");

.qy-mod-header .qy-mod-title .qy-mod-text {
  display: inline-block;
  font-size: 26px;
  line-height: 26px;
}
</style>
