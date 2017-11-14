import {query, mutation, toGqlArg as arg} from '../helpers';

const fields = `
	id
	name
	username
	email
	phone
	password
	status
	image
	dateOfBirth
	gender
	data
	createdAt
	updatedAt
`;

function login(user) {
	return query(`loginUser(${arg(user)}) {
		token
		user {
			id
			email
			firstName
			lastName
		}
	}`).then(data => data.loginUser);
}

function me() {
	return query(`me {
		id
		email
		firstName
		lastName
	}`).then(data => data.me);
}

function getUser(id) {
	return query(`user(id: ${id}) { ${fields}}`)
		.then(data => data.user);
}

function getUsers(search) {
	return query(`users(${arg(search)}) {
		nodes {
			id
			username
			name
			email
			phone
			status
			image
			dateOfBirth
			gender
			data
		}
		totalCount
		pageInfo {
			startCursor
			endCursor
			hasNextPage
			hasPreviousPage
			edgeCount
		}
	}`)
		.then(data => data.users);
}

function saveUser(user) {
	return mutation(`saveUser(${arg(user)}) { ${fields} }`)
		.then(data => data.saveUser);
}

function deleteUser(id) {
	return mutation(`deleteUser(id: ${id}) {
		id
	}`);
}

function saveUserData(userData) {
	return mutation(`saveUserData(${arg(userData)}) {id}`).then(data => (data.saveUserData));
}

function logout() {
	return query('logoutMe').then(data => data.logoutMe);
}

export {
	login,
	me,
	getUser,
	getUsers,
	saveUser,
	deleteUser,
	saveUserData,
	logout,
};
