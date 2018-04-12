import Vue from 'vue';
import ElementUI from 'element-ui';
import locale from 'element-ui/lib/locale/lang/en';
import 'element-ui/lib/theme-chalk/index.css';
import VueUtils from 'vutils';
import ElAdmin from 'el-admin';

import './polyfill';
import App from './App.vue';
import router from './router';
import store from './vuex';
import modalViews from './modalViews';
import * as API from './api';

Vue.config.productionTip = false;

Vue.use(ElementUI, {locale});
Vue.use(VueUtils);
Vue.use(ElAdmin);

Vue.prototype.$view = modalViews;
Vue.prototype.$api = API;
Vue.prototype.$utils = {
	setFormErrors(form, errors) {
		if (errors.global) {
			errors.globalError = errors.global;
			delete errors.global;
		}
		form.fields.forEach((field) => {
			if (errors[field.prop]) {
				field.validateMessage = errors[field.prop].message;
				field.validateState = 'error';
			}
		});
	},

	clearFormErrors(form) {
		form.fields.forEach((field) => {
			field.validateMessage = '';
			field.validateState = '';
		});
	},
};

/* eslint-disable no-new */
new Vue({
	store,
	router,
	el: '#app',
	render: h => h(App),
});
