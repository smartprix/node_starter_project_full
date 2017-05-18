module.exports = {
	development: {
		client: 'mysql2',
		debug: true,
		connection: {
			database: 'test',
			user: 'root',
			password: 'password'
		},
		pool: {
			min: 2,
			max: 10
		},
		migrations: {
			tableName: 'knex_migrations'
		}
	},

	staging: {
		client: 'mysql2',
		debug: false,
		connection: {
			database: 'test',
			user: 'root',
			password: 'password'
		},
		pool: {
			min: 2,
			max: 10
		},
		migrations: {
			tableName: 'knex_migrations'
		}
	},

	production: {
		client: 'mysql2',
		debug: false,
		connection: {
			database: 'test',
			user: 'root',
			password: 'password'
		},
		pool: {
			min: 10,
			max: 50,
		},
		migrations: {
			tableName: 'knex_migrations'
		}
	}
};
