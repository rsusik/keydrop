const routes = [{
        path: '/',
        component: () => import ('layouts/MainLayout.vue')
    },
    {
        path: '/intro',
        component: () => import ('layouts/Intro.vue')
    },
    {
        path: '/demo',
        component: () => import ('layouts/Demo.vue')
    },
    {
        path: '/demo2',
        component: () => import ('layouts/Demo2.vue')
    },
    {
        path: '/feedback',
        component: () => import ('layouts/Feedback.vue')
    },
    {
        path: '/getdata',
        component: () => import ('layouts/GetData.vue')
    },
    {
        path: '/test/:mode',
        component: () => import ('layouts/Test.vue')
    },

    // Always leave this as last one,
    // but you can also remove it
    {
        path: '/:catchAll(.*)*',
        component: () =>
            import ('pages/Error404.vue')
    }
]

export default routes