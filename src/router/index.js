import { createRouter, createWebHistory } from "vue-router";
const routes = [
  {
    path: "/",
    name: "index",
    meta: {
      keepAlive: false,
    },
    component: () => import("@/views/index.vue"),
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
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
