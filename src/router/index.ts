import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'menu',
            component: () => import('../views/Menu.vue')
        },
        {
            path: '/outpainting/:projectName?',
            name: 'outpainting',
            component: () => import('../views/Outpainting.vue')
        },
    ]
})

export default router
