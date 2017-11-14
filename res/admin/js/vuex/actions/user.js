import * as api from '../../api';

function login({commit}, userData) {
	return api.login(userData).then((user) => {
		commit('setUser', user && user.user);
	});
}

function me({commit}) {
	return api.me().then((user) => {
		commit('setUser', user);
	});
}

function logout({commit}) {
	return api.logout()
		.then((success) => {
			if (success) commit('userLogout');
			else throw new Error('Error while logging out');
		})
		.catch((err) => {
			throw new Error(err.userErrorMessages.global);
		});
}

export {
	login,
	me,
	logout,
};
