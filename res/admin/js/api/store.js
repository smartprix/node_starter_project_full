import {query, mutation, toGqlArg as arg} from '../helpers';

const fields = `
	id
	name
	shortName
	link
	domain
	status
	rating
`;

function getStore(id) {
	return query(`store(id: ${id}) { ${fields} }`).then(data => data.store);
}

function getStores(search) {
	return query(`stores(${arg(search)}) {
		nodes { ${fields} },
		totalCount,
		pageInfo {
			startCursor
			endCursor
			hasNextPage
			hasPreviousPage
			edgeCount
		}
	}`).then(data => data.stores);
}

function saveStore(store) {
	const pick = [
		'id',
		'name',
		'shortName',
		'link',
		'domain',
		'status',
		'rating',
	];
	return mutation(`saveStore(${arg(store, pick)}) { ${fields} }`)
		.then(data => data.saveStore);
}

function deleteStore(storeId) {
	return mutation(`deleteStore(id: ${storeId}) {
		id
	}`);
}

export {
	getStore,
	getStores,
	saveStore,
	deleteStore,
};
