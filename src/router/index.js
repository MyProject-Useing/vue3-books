import { createRouter, createWebHashHistory } from "vue-router";
const routes = [
  {
    path: "/",
    name: "index",
    meta: {
      keepAlive: false,
    },
    component: () => import("@/views/home/index.vue"),
  },
  {
    path: "/readBooks",
    name: "readBooks",
    meta: {
      keepAlive: false,
    },
    component: () => import("@/views/book/modules/readBooks.vue"),
  },

  {
    path: "/book",
    name: "book",
    meta: {
      keepAlive: false,
    },
    component: () => import("@/views/book/index.vue"),
  },

  {
    path: "/searchResult",
    name: "searchResult",
    meta: {
      keepAlive: false,
    },
    component: () => import("@/views/home/modules/searchResult.vue"),
  },
  {
    path: "/playing",
    name: "playing",
    meta: {
      keepAlive: false,
    },
    component: () => import("@/views/video/modules/playing.vue"),
  },
  {
    path: "/videoiframe",
    name: "videoiframe",
    meta: {
      keepAlive: false,
    },
    component: () => import("@/views/video/modules/videoiframe.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
});

export default router;
