const loginUser = {
	query: `query {
		loginUser (
			username: "admin"
			password: "admin"
		) {
			user {
				username
			}
		}
	}`,
	expect: {
		user: {
			username: 'admin',
		},
	},
};

export default loginUser;
export {
	loginUser,
};
