import { createRouter, createWebHashHistory } from "vue-router";
const routes = [
  {
    path: "/",
    name: "index",
    meta: {
      keepAlive: false,
    },
    component: () => import("@/views/homeIndex/index.vue"),
  },
  {
    path: "/readBooks",
    name: "readBooks",
    meta: {
      keepAlive: false,
    },
    component: () => import("@/views/readBooks.vue"),
  },
  {
    path: "/searchResult",
    name: "searchResult",
    meta: {
      keepAlive: true,
    },
    component: () => import("@/views/searchResult.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
});

export default router;
