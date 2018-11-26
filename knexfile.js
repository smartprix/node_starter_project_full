const {cfg} = require('sm-utils');

const connection = cfg('db');
const client = cfg('db.client') || 'pg';

module.exports = {
	development: {
		client,
		debug: cfg('debug'),
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
		seeds: {
			directory: './seeds',
		},
	},

	test: {
		client,
		connection,
		pool: {
			min: 2,
			max: 10,
		},
		migrations: {
			tableName: 'knex_migrations',
		},
		seeds: {
			directory: './seeds/test',
		},
		debug: false,
	},
};
