const _ = require('lodash');
const config = require('./config.js');

const connection = _.merge({
	database: 'starter',
}, config.db);

const client = config.db.client || 'pg';

module.exports = {
	development: {
		client,
		debug: config.debug,
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
		client,
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
		client,
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
