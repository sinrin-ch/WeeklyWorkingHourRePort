/**
 * main.js
 * 工时周报
 * Created by Zhou.Xin.Lin on 2017/12/14.
 */

require.config({
    baseUrl: '../Scripts',
    // shim:{
    //     'vue':{
    //         exports:'vue'
    //     }
    // },
    paths: {
        'vue': './vue/2.4.4/vue',
        'app': './PageScript/WeeklyWorkingHourReport/app',
        'ELEMENT': './element-ui/1.4.6/index',
        'mock': 'mock',
        'ajax': 'ajax'
    }
});
require(['vue', 'app', 'ELEMENT'], function (Vue, App, ElementUI) {
    Vue.use(ElementUI);
    var vm = new Vue({
        el: '#app',
        render: function (h) {
            return h(App);
        }
    });
});
