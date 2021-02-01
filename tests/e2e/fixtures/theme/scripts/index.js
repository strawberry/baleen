import Vue from 'vue';
import VueRouter from 'vue-router';
import collectionTemplate from './CollectionTemplate';

Vue.use(VueRouter);

// eslint-disable-next-line no-new
new Vue({
    el: '#app',
    components: { collectionTemplate },
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
