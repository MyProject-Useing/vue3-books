<template>
  <router-view v-slot="{ Component }">
    <keep-alive>
      <component
        :key="$route.name"
        :is="Component"
        v-if="$route.meta.keepAlive"
      />
    </keep-alive>
    <component
      :key="$route.name"
      :is="Component"
      v-if="!$route.meta.keepAlive"
    />
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

<style>
#app {
  height: 100%;
}
</style>
