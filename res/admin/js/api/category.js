import {query, mutation, toGqlArg as arg} from '../helpers';

const fields = `
	id
	name
	shortName
	pluralName
	aliases
	parentId
	status
	parent {
		id
		name
	}
	parentTree {
		id
		name
	}
`;

function getCategory(id) {
	return query(`category(id: ${id}) { ${fields} }`)
		.then(data => data.category);
}

function getCategories(search) {
	return query(`categories(${arg(search)}) {
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
		.then(data => data.categories);
}

function getCategoryChildren(id) {
	return query(`category(id: ${id}) {
		children { ${fields} }
	}`)
		.then(data => data.category && data.category.children);
}

function getCategoryChildrenTrees(id) {
	return query(`category(id: ${id}) {
		childrenTrees { id name }
	}`)
		.then(data => data.category && data.category.childrenTrees);
}

function saveCategory(category) {
	const pick = ['id', 'name', 'shortName', 'pluralName', 'aliases', 'parentId', 'status'];
	return mutation(`saveCategory(${arg(category, pick)}) { ${fields} }`)
		.then(data => data.saveCategory);
}

function deleteCategory(categoryId) {
	return mutation(`deleteCategory(id: ${categoryId}) {
		id
	}`);
}

export {
	getCategory,
	getCategories,
	getCategoryChildren,
	getCategoryChildrenTrees,
	saveCategory,
	deleteCategory,
};
