import Vue from 'vue';

import Hello from './components/Hello.vue';
import App from './App.vue';

Vue.component(Hello.name, Hello);

/* eslint-disable no-new */
new Vue({
	el: '#app',
	render: h => h(App),
});
