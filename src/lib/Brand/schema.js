const Brand = {
	graphql: 'type',
	schema: ['admin'],
	relayConnection: true,
	fields: {
		id: 'ID!',
		name: 'String!',
		aliases: '[String]',
		status: 'String!',
		createdAt: 'String!',
		updatedAt: 'String!',
		categories: '[Category]',
	},
};

const brand = {
	graphql: 'query',
	schema: ['admin'],
	name: 'brand',
	type: 'Brand',
	args: {
		id: 'ID',
		name: 'String',
	},
};

const brands = {
	graphql: 'query',
	schema: ['admin'],
	name: 'brands',
	type: 'BrandConnection',
	args: {
		id: 'ID',
		name: 'String',
		aliases: 'String',
		search: 'String',
		status: 'String',
		$default: [
			'$paging',
		],
	},
};

const saveBrand = {
	graphql: 'mutation',
	schema: ['admin'],
	name: 'saveBrand',
	type: 'Brand',
	args: {
		id: 'ID',
		name: 'String',
		aliases: '[String]',
		categoryIds: '[ID]',
		status: 'String',
	},
};

const deleteBrand = {
	graphql: 'mutation',
	schema: ['admin'],
	name: 'deleteBrand',
	type: 'DeletedItem',
	args: {
		id: 'ID',
	},
};

export default {
	Brand,
	brand,
	brands,
	saveBrand,
	deleteBrand,
};
