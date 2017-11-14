function setUser(state, user) {
	state.user = user;
}

function userLogout(state) {
	state.user = null;
}

export {
	setUser,
	userLogout,
};
