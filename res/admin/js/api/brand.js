import {query, mutation, toGqlArg as arg} from '../helpers';

const fields = `
	id
	name
	aliases
	status
	categories {
		id
		name
	}
	createdAt
	updatedAt
`;

function getBrand(id) {
	return query(`brand(id: ${id}) { ${fields} }`)
		.then(data => data.brand);
}

function getBrands(search) {
	return query(`brands(${arg(search)}) {
		nodes { ${fields} }
		totalCount
		pageInfo {
			startCursor
			endCursor
			hasNextPage
			hasPreviousPage
			edgeCount
		}
	}`)
		.then(data => data.brands);
}

function saveBrand(brand) {
	const pick = ['id', 'name', 'aliases', 'status', 'categoryIds'];
	return mutation(`saveBrand(${arg(brand, pick)}) { ${fields} }`)
		.then(data => data.saveBrand);
}

function deleteBrand(brandId) {
	return mutation(`deleteBrand(id: ${brandId}) {
		id
	}`);
}

export {
	getBrand,
	getBrands,
	saveBrand,
	deleteBrand,
};
