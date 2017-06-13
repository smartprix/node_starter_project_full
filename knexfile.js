const _ = require('lodash');
const config = require('./config.js');

const connection = _.merge({
	port: 3306,
	database: 'starter',
}, config.db);

module.exports = {
	development: {
		client: 'mysql2',
		debug: true,
		connection,
		pool: {
			min: 2,
			max: 10,
		},
		migrations: {
			tableName: 'knex_migrations',
		},
	},

	staging: {
		client: 'mysql2',
		connection,
		pool: {
			min: 2,
			max: 10,
		},
		migrations: {
			tableName: 'knex_migrations',
		},
	},

	production: {
		client: 'mysql2',
		connection,
		pool: {
			min: 10,
			max: 50,
		},
		migrations: {
			tableName: 'knex_migrations',
		},
	},
};
