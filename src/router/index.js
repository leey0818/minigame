import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home'
import bingoRoutes from './bingo'

Vue.use(VueRouter);

const NotFound = {
    template: '<div>Page not found!</div>',
};

const router = new VueRouter({
    mode: 'history',
    routes: [
        ...bingoRoutes,
        { path: '/', component: Home },
        { path: '*', component: NotFound },
    ],
});

export default router;
