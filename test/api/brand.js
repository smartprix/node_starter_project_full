const brand = {
	query: `query {
		brand(id: 1) {
			id
			name
			status
		}
	}`,
	expect: {
		id: '1',
		name: 'Apple',
		status: 'ACTIVE',
	},
};

const brands = {
	query: `query {
		brands(first: 5) {
			nodes {
				id
				name
				aliases
				status
			}
		}
	}`,
	expect: {
		nodes: [
			{
				id: '1',
				name: 'Apple',
				aliases: [],
				status: 'ACTIVE',
			},
			{
				id: '2',
				name: 'Samsung',
				aliases: [],
				status: 'ACTIVE',
			},
			{
				id: '3',
				name: 'Canon',
				aliases: [],
				status: 'ACTIVE',
			},
			{
				id: '4',
				name: 'Nikon',
				aliases: [],
				status: 'ACTIVE',
			},
			{
				id: '5',
				name: 'hewlett packard',
				aliases: [
					'hp',
				],
				status: 'ACTIVE',
			},
		],
	},
};

const saveBrand = {
	mutation: `mutation {
	saveBrand(name: "Tommy Hilfiger", categoryIds: [1, 2], status: "ACTIVE") {
			id
		}
	}`,
	query: id => `query {
			brand(id: ${id}) {
				name
				categories {
					id
				}
				status
			}
		}`,
	expect: {
		brand: {
			name: 'Tommy Hilfiger',
			categories: [
				{
					id: '1',
				},
				{
					id: '2',
				},
			],
			status: 'ACTIVE',
		},
	},
};

const deleteBrand = {
	mutation: `mutation {
		deleteBrand(id: 6) {
			id
		}
	}`,
	query: id => `query {
			brand(id: ${id}) {
				name
				status
			}
		}`,
	expect: {
		brand: null,
	},
};

export {
	brand,
	brands,
	saveBrand,
	deleteBrand,
};
