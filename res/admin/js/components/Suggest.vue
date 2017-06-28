<template>
	<el-select
		v-model="selection"
		:size="size"
		:multiple="multiple"
		filterable
		remote
		clearable
		:remote-method="remoteMethod"
		:loading="loading"
		style="width:100%">
		<el-option
			v-for="value in options"
			:key="value.id"
			:label="value[labelKey]"
			:value="value[valueKey]">
			<slot :item="item"></slot>
		</el-option>
	</el-select>
</template>

<!-- Sample Usage -->
<!--<suggest item="Categories">
	<template scope="scope">
		{{ scope.item.id }}
	</template>
</suggest>-->

<script>
const cache = {};

export default {
	name: 'Suggest',
	vModel: 'selection',
	props: {
		size: {
			type: String,
			default: 'normal',
		},
		item: {
			type: String,
			required: true,
		},
		labelKey: {
			type: String,
			default: 'name',
		},
		valueKey: {
			type: String,
			default: 'id',
		},
		multiple: {
			type: Boolean,
			default: false,
		},
		debounce: {
			type: Number,
			default: 250,
		},
		extraOptions: {
			type: Array,
			default: () => [],
		},
		value: {},
	},

	data() {
		const extraOptionsParsed = [];
		this.extraOptions.forEach((option) => {
			extraOptionsParsed.push({
				[this.labelKey]: option.value,
				[this.valueKey]: option.label || option.value,
			});
		});

		return {
			loading: false,
			options: [],
			debounceTimeout: null,
			extraOptionsParsed,
		};
	},

	created() {
		cache[this.item] = cache[this.item] || {};

		if (this.selection === '0') {
			this.selection = '';
		}

		if (Array.isArray(this.selection)) {
			this.remoteMethod(this.selection.join(':'), {debounce: false});
		}
		else {
			this.remoteMethod(this.selection || '', {debounce: false});
		}
	},

	methods: {
		remoteMethod(query, {debounce = true} = {}) {
			// this query is already in cache
			if (this.findQueryInCache(query)) return;

			// query = selected item & it's already in cache
			if (this.findSelectedItemInCache(query)) return;

			this.loading = true;
			// set cache to true so that no other component fetches the same results
			cache[this.item][query] = true;

			if (!debounce) {
				this.callAPIAndSetOptions(query);
				return;
			}

			if (this.debounceTimeout) {
				clearTimeout(this.debounceTimeout);
			}

			this.debounceTimeout = setTimeout(() => {
				this.callAPIAndSetOptions(query);
			}, this.debounce);
		},

		findQueryInCache(query) {
			const cachedResult = cache[this.item][query];

			// true means that some other component is fetching the results
			if (cachedResult === true) {
				this.loading = true;
				const cacheEvent = `suggest:cache:${this.item}:${query}`;
				this.$bus.$once(cacheEvent, () => {
					this.loading = false;
					this.setOptions(cache[this.item][query], query);
				});
				return true;
			}
			else if (cachedResult) {
				this.setOptions(cachedResult, query);
				return true;
			}

			return false;
		},

		findSelectedItemInCache(query) {
			if (!query) return false;
			if (Array.isArray(this.selection)) return false;

			// see if the query is equal to the selected option
			// and try to find this option in the cached results
			let options = this.options;
			if (options && options.length) {
				for (const option of options) {
					// this option is already present, no need to query for it
					if (option[this.valueKey] === this.selection && (
						option[this.labelKey] === query ||
							query === String(this.selection)
					)) return true;
				}
			}

			options = cache[this.item][''];
			if (options && options.length) {
				for (const option of options) {
					// this option is already present, no need to query for it
					if (option[this.valueKey] === this.selection && (
						option[this.labelKey] === query ||
							query === String(this.selection)
					)) {
						this.setOptions(options, query);
						return true;
					}
				}
			}

			return false;
		},

		callAPIAndSetOptions(query) {
			const cacheEvent = `suggest:cache:${this.item}:${query}`;
			this.$api[`get${this.item}`]({
				search: query,
			}).then((options) => {
				this.loading = false;
				cache[this.item][query] = options.nodes;
				this.$bus.$emit(cacheEvent);
				this.setOptions(options.nodes, query);
			}).catch((error) => {
				this.loading = false;
				this.$bus.$emit(cacheEvent);
				console.error(error);
			});
		},

		setOptions(options, query) {
			this.options = this.extraOptionsParsed.filter(option =>
				new RegExp(query, 'i').test(option[this.valueKey])
			).concat(options);
		},
	},
};
</script>
