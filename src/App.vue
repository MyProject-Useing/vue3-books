<template>
  <!-- <keep-alive>
    <router-view :key="routerKey"></router-view>
  </keep-alive> -->
  <router-view v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" />
    </keep-alive>
  </router-view>
</template>

<script>
export default {
  name: "App",
  methods: {
    routerKey() {
      return this.$route.path + Date.now();
    },
  },
};
</script>

<style></style>
