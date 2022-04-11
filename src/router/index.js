import { createRouter, createWebHistory } from "vue-router";
const routes = [
  {
    path: "/",
    name: "index",
    component: () => import("@/views/index.vue"),
  },
  {
    path: "/readBooks",
    name: "readBooks",
    component: () => import("@/views/readBooks.vue"),
  },
  {
    path: "/searchResult",
    name: "searchResult",
    component: () => import("@/views/searchResult.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
