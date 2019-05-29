import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../Home'
import BingoRoom from '../games/bingo/Room'
import BingoEmpty from '../games/bingo/Empty'

Vue.use(VueRouter);

const NotFound = {
    template: '<div>Page not found!</div>',
};

const router = new VueRouter({
    mode: 'history',
    routes: [
        { path: '/', component: Home },
        { path: '/bingo', component: BingoEmpty },
        { path: '/bingo/:size', component: BingoRoom },
        { path: '*', component: NotFound },
    ],
});

export default router;
