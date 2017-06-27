import Vue from 'vue';
import Store from './components/Store/Store.vue';
import Brand from './components/Brand/Brand.vue';

const componentMap = {
	store: Store,
	brand: Brand,
};

function openRightModal(component, props) {
	Vue.bus.$emit('openRightModal', {component, props});
}

function getViewModalFunction(component) {
	return (obj, opts = {}) => {
		openRightModal(component, {
			data: obj,
			fetch: opts.fetch,
		});
	};
}

const viewModalFunctions = {};
Object.keys(componentMap).forEach((name) => {
	viewModalFunctions[name] = getViewModalFunction(componentMap[name]);
});

export default viewModalFunctions;
