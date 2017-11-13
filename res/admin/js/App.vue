<template>
	<component :is="currentComponent"></component>
</template>

<script>
import AppLayout from './components/AppLayout.vue';

export default {
	name: 'App',

	components: {
		appLayout: AppLayout,
	},

	computed: {
		currentComponent() {
			return 'appLayout';
		},
	},
};
</script>

<style>
.form-global-error  {
	margin-bottom: 0;

	.el-form-item__error {
		padding: 8px 16px;
		position: relative;
		color: white;
		font-size: 13px;
		line-height: 18px;
		background-color: #ff4949;
		border-radius: 4px;
		margin-bottom: 22px;
	}
}

.el-form {
	.el-col {
		padding-bottom: 0;
	}
}

.CodeMirror pre {
	font-family: 'Liberation Mono','DejaVu Sans Mono',Hack,Menlo,Monaco,Consolas,monospace !important;
	line-height: 24px !important;
}

.el-table .cell {
	word-break: normal;
}

.el-select {
	width: 100%;
}

.ela-content-layout {
	flex: 1;
}

.with-tabs .ela-content-layout-foot {
	flex-basis: 44px;
	padding-bottom: 0;
}

.no-padding-in-tabs .ela-content-layout-tabs .el-tabs__content {
	padding: 0;
}
</style>
