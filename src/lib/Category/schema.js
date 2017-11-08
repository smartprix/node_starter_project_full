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

const category = {
	graphql: 'query',
	schema: ['admin'],
	name: 'category',
	type: 'Category',
	args: {
		id: 'ID',
		name: 'String',
		shortName: 'String',
	},
};

const categories = {
	graphql: 'query',
	schema: ['admin'],
	name: 'categories',
	type: 'CategoryConnection',
	args: {
		id: 'ID',
		name: 'String',
		shortName: 'String',
		pluralName: 'String',
		parentId: 'Int',
		search: 'String',
		status: 'String',
		paging: 'Default',
	},
};

const saveCategory = {
	graphql: 'mutation',
	schema: ['admin'],
	name: 'saveCategory',
	type: 'Category',
	args: {
		id: 'ID',
		name: 'String',
		shortName: 'String',
		pluralName: 'String',
		aliases: '[String]',
		parentId: 'ID',
		status: 'String',
	},
};

const deleteCategory = {
	graphql: 'mutation',
	schema: ['admin'],
	name: 'deleteCategory',
	type: 'DeletedItem',
	args: {
		id: 'ID',
	},
};

export {
	Category,
	category,
	categories,
	saveCategory,
	deleteCategory,
};
