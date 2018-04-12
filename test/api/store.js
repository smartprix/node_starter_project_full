const store = {
	query: `query {
		store(id: 1) {
			name
      		link
      		status
		}
	}`,
	expect: {
		name: 'amazon',
		link: 'http://www.amazon.in/',
		status: 'ACTIVE',
	},
};

const stores = {
	query: `query {
		stores (first: 5){
			nodes {
				name
				link
			}
		}
	}`,
	expect: {
		nodes: [
			{
				name: 'amazon',
				link: 'http://www.amazon.in/',
			},
			{
				name: 'flipkart',
				link: 'http://www.flipkart.com/',
			},
			{
				name: 'snapdeal',
				link: 'http://www.snapdeal.com/',
			},
			{
				name: 'ebay',
				link: 'http://www.ebay.in/',
			},
			{
				name: 'infibeam',
				link: 'https://www.infibeam.com/',
			},
		],
	},
};

const saveStore = {
	mutation: `mutation {
		saveStore(name: "Tata Cliq", shortName: "TC", link: "http://tatacliq.com", domain: "tatacliq.com", status: "ACTIVE") {
			id
		}
	}`,
	query: id => `query {
		store(id: ${id}) {
			name
			shortName
			link
			domain
			status
		}
	}`,
	expect: {
		store: {
			name: 'Tata Cliq',
			shortName: 'TC',
			link: 'http://tatacliq.com',
			domain: 'tatacliq.com',
			status: 'ACTIVE',
		},
	},
};

const deleteStore = {
	mutation: `mutation {
		deleteStore(id: 8) {
			id
		}
	}`,
	query: id => `query {
		store(id: ${id}) {
			id
			name
			shortName
			link
			domain
			status
		}
	}`,
	expect: {
		store: null,
	},
};

export {
	store,
	stores,
	saveStore,
	deleteStore,
};
