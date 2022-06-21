import { createRouter, createWebHashHistory } from "vue-router";

import layout from "@/components/layout.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: layout,
    redirect: "/videoIndex",
    children: [
      {
        path: "/videoIndex",
        name: "videoIndex",
        component: () => import("@/views/video/index.vue"),
      },

      {
        path: "/videoResult",
        name: "videoResult",
        component: () => import("@/views/video/modules/videoResult.vue"),
      },

      {
        path: "/bookIndex",
        name: "bookIndex",
        component: () => import("@/views/book/indexResult.vue"),
      },
      {
        path: "/bookResult",
        name: "bookResult",
        component: () => import("@/views/video/modules/videoResult.vue"),
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
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
});

export default router;
