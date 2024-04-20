import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
    {
        path: "/",
        redirect: "/login",
    },
    {
        path: "/login",
        name: "login",
        component: () => import("../views/Login/index.vue"),
    },
    {
        path: "/home",
        name: "home",
        redirect: "/home/adminHome",
        component: () => import("../views/Home/index.vue"),
        children: [
            {
                path: "adminHome",
                name: "adminHome",
                component: () => import("../views/adminHome/index.vue"),
            },
            {
                path: "health",
                name: "health",
                component: () => import("../views/health/index.vue"),
                children: [
                    {
                        path: "food",
                        name: "food",
                        component: () =>
                            import("../views/health/food/index.vue"),
                    },
                    {
                        path: "articles",
                        name: "articles",
                        component: () =>
                            import("../views/health/articles/index.vue"),
                    },
                    {
                        path: "sports",
                        name: "sports",
                        component: () =>
                            import("../views/health/sports/index.vue"),
                    },
                ],
            },
            {
                path: "data",
                name: "data",
                component: () => import("../views/dataAnalysis/index.vue"),
                children: [
                    {
                        path: "blood",
                        name: "blood",
                        component: () =>
                            import("../views/dataAnalysis/blood/index.vue"),
                    },
                    {
                        path: "diet",
                        name: "diet",
                        component: () =>
                            import("../views/dataAnalysis/diet/index.vue"),
                    },
                    {
                        path: "medicine",
                        name: "medicine",
                        component: () =>
                            import("../views/dataAnalysis/medicine/index.vue"),
                    },
                    {
                        path: "sportsdata",
                        name: "sportsdata",
                        component: () =>
                            import("../views/dataAnalysis/sports/index.vue"),
                    },
                ],
            },
            {
                path: "userData",
                name: "userData",
                component: () => import("../views/userData/index.vue"),
            },
            {
                path: "notice",
                name: "notice",
                component: () => import("../views/notice/index.vue"),
            },
            {
                path: "chatWindow",
                name: "chatWindow",
                component: () => import("../views/chatWindow/index.vue"),
            },
        ],
    },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export default router;
