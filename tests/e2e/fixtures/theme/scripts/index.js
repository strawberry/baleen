import Vue from 'vue';
import VueRouter from 'vue-router';
import Collection from './Collection';

Vue.use(VueRouter);
//
// eslint-disable-next-line no-new
new Vue({
    el: '#app',
    components: { Collection },
    data() {
        return {
            Math,
        };
    },
    delimiters: ['${', '}'],
    router: new VueRouter({
        mode: 'history',
    }),
});
