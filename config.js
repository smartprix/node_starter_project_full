const _ = require('lodash');

module.exports = {
	debug: false,
	db: {
		host: '127.0.0.1',
		client: 'pg',
		port: 5432,
		user: 'root',
		password: 'smartprix',
		database: 'starter',
	},

	encryptionKey: 'is73SCNDSt0jVFoZAVEFX31Ry1UJYU',

	$env_development: {
		port: 3000,
	},

	$env_test: {
		db: {
			database: 'starter_admin',
		},
		port: 5000,
		wwwUrl: 'http://localhost:5000',
	},

};
