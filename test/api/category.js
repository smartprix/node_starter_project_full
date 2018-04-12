const category = {
	query: `query {
		category(id: 1) {
			name
			shortName
			pluralName
			status
		}
	}`,
	expect: {
		name: 'Electronic',
		shortName: 'Electronic',
		pluralName: 'Electronics',
		status: 'ACTIVE',
	},
};

const categories = {
	query: `query {
		categories(first: 5) {
			nodes {
				name
				shortName
				pluralName
			}
		}
	}`,
	expect: {
		nodes: [
			{
				name: 'Electronic',
				shortName: 'Electronic',
				pluralName: 'Electronics',
			},
			{
				name: 'Appliance',
				shortName: 'Appliance',
				pluralName: 'Appliances',
			},
			{
				name: 'Furniture',
				shortName: 'Furniture',
				pluralName: 'Furniture',
			},
			{
				name: 'Book',
				shortName: 'Book',
				pluralName: 'Books',
			},
			{
				name: 'mobile',
				shortName: 'Mobile',
				pluralName: 'Mobiles',
			},
		],
	},
};

const saveCategory = {
	mutation: `mutation {
	saveCategory(name: "Tool and hardware", shortName: "TnH", status: "ACTIVE") {
			id
		}
	}`,
	query: id => `query {
			category(id: ${id}) {
				name
				shortName
				pluralName
				parent {
					id
				}
				status
			}
		}`,
	expect: {
		category: {
			name: 'Tool and hardware',
			shortName: 'TnH',
			pluralName: '',
			parent: null,
			status: 'ACTIVE',
		},
	},
};

const deleteCategory = {
	mutation: `mutation {
		deleteCategory(id: 7) {
			id
		}
	}`,
	query: id => `query {
			category(id: ${id}) {
				name
				shortName
				pluralName
				status
			}
		}`,
	expect: {
		category: null,
	},
};

export {
	category,
	categories,
	saveCategory,
	deleteCategory,
};
