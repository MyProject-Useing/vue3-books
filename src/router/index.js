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
        component: () => import("@/views/book/index.vue"),
      },
      {
        path: "/bookInfo",
        name: "bookInfo",
        component: () => import("@/views/book/modules/bookInfo.vue"),
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
