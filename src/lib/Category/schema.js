// const Category = {
// 	graphql: 'type',
// 	schema: ['admin'],
// 	relayConnection: true,
// 	fields: {
// 		id: 'ID!',
// 		name: 'String!',
// 		shortName: 'String',
// 		pluralName: 'String',
// 		aliases: '[String]',
// 		parentId: 'ID',
// 		status: 'String!',
// 		createdAt: 'String!',
// 		updatedAt: 'String!',
// 		parent: 'Category',
// 		parentTree: {
// 			type: '[Category]',
// 			args: {
// 				depth: 'Int',
// 			},
// 		},
// 		children: '[Category]',
// 		childrenTrees: {
// 			type: '[[Category]]',
// 			args: {
// 				depth: 'Int',
// 			},
// 		},
// 	},
// };
//
// const category = {
// 	graphql: 'query',
// 	schema: ['admin'],
// 	name: 'category',
// 	type: 'Category',
// 	args: {
// 		id: 'ID',
// 		name: 'String',
// 		shortName: 'String',
// 	},
// };
//
// const categories = {
// 	graphql: 'query',
// 	schema: ['admin'],
// 	name: 'categories',
// 	type: 'CategoryConnection',
// 	args: {
// 		id: 'ID',
// 		name: 'String',
// 		shortName: 'String',
// 		pluralName: 'String',
// 		parentId: 'Int',
// 		search: 'String',
// 		status: 'String',
// 		$default: [
// 			'$paging',
// 		],
// 	},
// };
//
// const saveCategory = {
// 	graphql: 'mutation',
// 	schema: ['admin'],
// 	name: 'saveCategory',
// 	type: 'Category',
// 	args: {
// 		id: 'ID',
// 		name: 'String',
// 		shortName: 'String',
// 		pluralName: 'String',
// 		aliases: '[String]',
// 		parentId: 'ID',
// 		status: 'String',
// 	},
// };
//
// const deleteCategory = {
// 	graphql: 'mutation',
// 	schema: ['admin'],
// 	name: 'deleteCategory',
// 	type: 'DeletedItem',
// 	args: {
// 		id: 'ID',
// 	},
// };
//
// export default {
// 	Category,
// 	category,
// 	categories,
// 	saveCategory,
// 	deleteCategory,
// };

const Category = {
	graphql: 'type',
	schema: ['admin'],
	relayConnection: true,
	fields: {
		id: 'ID!',
		name: 'String!',
		shortName: 'String',
		pluralName: 'String',
		aliases: '[String]',
		parentId: 'ID',
		status: 'String!',
		createdAt: 'String!',
		updatedAt: 'String!',
		parent: 'Category',
		parentTree: {
			type: '[Category]',
			args: {
				depth: 'Int',
			},
		},
		children: '[Category]',
		childrenTrees: {
			type: '[[Category]]',
			args: {
				depth: 'Int',
			},
		},
	},
};

const getCategory = {
	graphql: 'query',
	schema: ['admin'],
	name: 'category',
	type: 'Category',
	args: {
		$default: ['id', 'name', 'shortName'],
	},
};

const getCategories = {
	graphql: 'query',
	schema: ['admin'],
	name: 'categories',
	type: 'CategoryConnection',
	args: {
		$default: [
			'$paging',
			'name',
			'shortName',
			'pluralName',
			'parentId',
			'status',
		],
		id: '[ID]',
		search: 'String',
	},
};

const saveCategory = {
	graphql: 'mutation',
	schema: ['admin'],
	type: 'Category',
	args: {
		$default: [
			'id',
			'name',
			'shortName',
			'pluralName',
			'parentId',
			'status',
		],
		aliases: '[String]',
	},
};

const deleteCategory = {
	graphql: 'mutation',
	schema: ['admin'],
	type: 'DeletedItem',
	args: {
		id: 'ID!',
	},
};

const recalculateAllSpecsScore = {
	graphql: 'mutation',
	schema: ['admin'],
	type: 'JSON',
	args: {
		categoryIds: '[ID]',
		debug: 'Boolean',
	},
};

export default {
	Category,
	getCategory,
	getCategories,
	saveCategory,
	deleteCategory,
	recalculateAllSpecsScore,
};
