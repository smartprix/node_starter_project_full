const User = {
	graphql: 'type',
	schema: ['admin'],
	relayConnection: true,
	fields: {
		id: 'ID!',
		username: 'String!',
		email: 'String!',
		phone: 'String!',
		name: 'String!',
		password: 'String!',
		status: 'String!',
		image: 'String',
		dateOfBirth: 'String',
		gender: 'String',
		data: 'JSON',
		firstName: 'String',
		lastName: 'String',
		createdAt: 'String!',
		updatedAt: 'String!',
	},
};

const LoginInfo = {
	graphql: 'type',
	schema: ['admin'],
	fields: {
		token: 'String',
		user: 'User',
	},
};

const user = {
	graphql: 'query',
	schema: ['admin'],
	type: 'User',
	args: {
		$default: [
			'id',
			'email',
			'username',
			'phone',
		],
	},
};

const users = {
	graphql: 'query',
	schema: ['admin'],
	type: 'UserConnection',
	args: {
		$default: [
			'id',
			'email',
			'status',
			'username',
			'name',
			'$paging',
		],
		search: 'String',
		sort: 'String',
		order: 'String',
	},
};

const loginUser = {
	graphql: 'query',
	schema: ['admin'],
	type: 'LoginInfo',
	args: {
		username: 'String!',
		password: 'String!',
		rememberMe: {
			type: 'Boolean',
			default: true,
		},
		setCookies: {
			type: 'Boolean',
			default: true,
		},
	},
};

const loginUsingToken = {
	graphql: 'query',
	schema: ['admin'],
	type: 'LoginInfo',
	args: {
		$default: ['token'],
	},
};

const me = {
	graphql: 'query',
	schema: ['admin'],
	type: 'User',
};

const logoutMe = {
	graphql: 'query',
	schema: ['admin'],
	type: 'Boolean',
};

const saveUser = {
	graphql: 'mutation',
	schema: ['admin'],
	type: 'User',
	args: {
		$default: [
			'id',
			'email',
			'username',
			'phone',
			'password',
			'name',
			'status',
			'image',
			'dateOfBirth',
			'gender',
		],
	},
};

const deleteUser = {
	graphql: 'mutation',
	schema: ['admin'],
	type: 'DeletedItem',
	args: {
		id: 'ID',
	},
};

export default {
	User,
	LoginInfo,
	user,
	users,
	loginUser,
	loginUsingToken,
	logoutMe,
	me,
	saveUser,
	deleteUser,
};
