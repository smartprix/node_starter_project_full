/* eslint-disable arrow-body-style */

// this file is using common-js instead of import because
// it can used from places where babel is not available
const fs = require('fs');
const Knex = require('knex');
const knexfile = require('../../knexfile');
const Promise = require('bluebird');

let globalKnex;

/**
 * set knex object
 */
function setKnex(knex) {
	globalKnex = knex;
}

/**
 * get knex object
 */
function getKnex() {
	if (!globalKnex) {
		const env = process.env.NODE_ENV || 'development';
		const dbConfig = knexfile[env];
		globalKnex = Knex(dbConfig);
	}

	return globalKnex;
}

/**
 * reset postgres sequences after importing data
 * postgresql does not set sequence values automatically
 * so we have to set sequence values to max of the id manually
 */
async function resetPgSequences() {
	const knex = getKnex();

	if (knex.client.config.client !== 'pg') {
		return;
	}

	// Find queries to fix all sequences
	// taken from: https://wiki.postgresql.org/wiki/Fixing_Sequences
	const result = await knex.raw(`
		SELECT 'SELECT SETVAL(' ||
			quote_literal(quote_ident(PGT.schemaname) || '.' || quote_ident(S.relname)) ||
			', COALESCE(MAX(' ||quote_ident(C.attname)|| '), 1) ) FROM ' ||
			quote_ident(PGT.schemaname)|| '.'||quote_ident(T.relname)|| ';'
			AS query
		FROM pg_class AS S,
			pg_depend AS D,
			pg_class AS T,
			pg_attribute AS C,
			pg_tables AS PGT
		WHERE S.relkind = 'S'
			AND S.oid = D.objid
			AND D.refobjid = T.oid
			AND D.refobjid = C.attrelid
			AND D.refobjsubid = C.attnum
			AND T.relname = PGT.tablename
		ORDER BY S.relname;
	`);

	await Promise.map(result.rows, query => knex.raw(query.query));
}

/**
 * insert seed data from a folder
 * data should be in json format
 */
function seedFolder(folderPath) {
	const self = this;
	const knex = getKnex();

	return new Promise((resolve, reject) => {
		fs.readdir(folderPath, (err, tables) => {
			if (err) {
				reject(err);
				return;
			}

			tables = tables.filter(
				table => table.endsWith('.json') || table.endsWith('.json.js')
			).map((table) => {
				const type = table.endsWith('.json.js') ? 'js' : 'json';
				const name = table.endsWith('.json.js') ? table.slice(0, -8) : table.slice(0, -5);

				return {name, type};
			});

			Promise.map(tables, (tableData) => {
				return knex(tableData.name).then(() => {
					const importFileName = (tableData.type === 'json') ?
						tableData.name :
						`${tableData.name}.json`;

					// eslint-disable-next-line
					const table = require(`${folderPath}/${importFileName}`);
					return knex(tableData.name).insert(table[tableData.name]);
				});
			}).then(() => {
				// fix autoincrement on postgres
				return self.resetPgSequences();
			}).then(() => {
				resolve();
			}).catch(e => reject(e));
		});
	});
}

/**
 * create a table from schema, generally used in migrations
 */
/* async function createTable(knex, tableName, schema) {
	knex.schema.createTable(tableName, (table) => {
		_.forEach(schema, (type, columnName) => {
			type = type.toLowerCase();

			switch (type) {
				case 'string!':
					table.string(columnName).notNullable().defaultTo('');
					break;

				case 'string':
					table.string(columnName).nullable();
					break;

				case 'id':
					table.increments(columnName).primary();

				case

				default:
					throw new Error(`Unknown Type ${type}`);
			}
		});
	});
	table.increments('id').primary();
	table.string('name', 100).notNullable();
	table.string('shortName', 100).notNullable();
	table.text('link').notNullable();
	table.integer('image').notNullable().defaultTo(0);
	table.integer('imageSquare').notNullable().defaultTo(0);
	table.string('domain', 100).notNullable();
	table.jsonb('data').notNullable().defaultTo('{}');
	table.string('status', 100).notNullable();
	table.boolean('featured').defaultTo(false).notNullable();
	table.integer('rating').notNullable().defaultTo(0);
	table.float('priceBoost').defaultTo(1).notNullable();
	table.timestamp('createdAt').nullable();
	table.timestamp('updatedAt').nullable();
	table.timestamp('deletedAt').nullable();
} */

async function dropDb(env, dbSuffix = '') {
	if (process.env.NODE_ENV === 'production') {
		throw new Error("Can't use this in production. Too dangerous.");
	}

	const dbConfig = knexfile[env];
	if (!dbConfig) {
		throw new Error(`Config for environment ${env} does not exist`);
	}

	const dbName = dbConfig.connection.database;
	if (!dbName) {
		throw new Error('database name does not exist in the config');
	}

	const isPostgres = dbConfig.client === 'pg';

	// remove database name from config
	if (isPostgres) {
		// since postgres uses default database name as <user>, we need to set the database
		dbConfig.connection.database = 'postgres';
	}
	else {
		dbConfig.connection.database = undefined;
	}

	// since database may not exist, so we first create knex with no db selected
	// and then create the database using raw queries
	const knex = Knex(dbConfig);
	dbConfig.connection.database = dbName;

	if (dbConfig.client === 'pg') {
		try {
			// postgres doesn't allow dropping database while other user are connected
			// so force other users to disconnect
			await knex.raw(`ALTER DATABASE "${dbName + dbSuffix}" CONNECTION LIMIT 1`);
			await knex.raw(`
				SELECT pg_terminate_backend(pid)
				FROM pg_stat_activity
				WHERE datname = '${dbName + dbSuffix}'
			`);
		}
		catch (e) {
			// Ignore errors
		}
	}
	await knex.raw(`DROP DATABASE IF EXISTS "${dbName + dbSuffix}"`);
	await knex.destroy();
}

/**
 * Create db if not exists, else do nothing
 */
async function createDb(env, dbSuffix = '') {
	const dbConfig = knexfile[env];
	const dbName = dbConfig.connection.database;

	const isPostgres = dbConfig.client === 'pg';
	let knex;

	// since database may not exist, so we first create knex with no db selected
	// remove database name from config
	if (isPostgres) {
		// since postgres uses default database name as <user>, we need to set the database
		dbConfig.connection.database = 'postgres';
		knex = Knex(dbConfig);

		const res = await knex.raw(`SELECT 1 FROM pg_database WHERE datname = '${dbName + dbSuffix}'`);
		if (!res.rowCount) {
			await knex.raw(`CREATE DATABASE "${dbName + dbSuffix}"`);
		}
		else {
			console.log(`DB ${dbName + dbSuffix} already exists`);
		}
	}
	else {
		dbConfig.connection.database = undefined;
		knex = Knex(dbConfig);
		await knex.raw(`CREATE DATABASE IF NOT EXISTS "${dbName + dbSuffix}"`);
	}

	dbConfig.connection.database = dbName;
	await knex.destroy();
}


/**
 * Create (or recreate) the database for an environment
 */
async function recreateDb(env, dbSuffix = '') {
	await dropDb(env, dbSuffix);
	await createDb(env, dbSuffix);

	const dbConfig = knexfile[env];
	const dbName = dbConfig.connection.database;
	dbConfig.connection.database = dbName + dbSuffix;

	if (globalKnex) await globalKnex.destroy();
	globalKnex = Knex(dbConfig);

	dbConfig.connection.database = dbName;
	return globalKnex;
}

/*
 * Recreate the database for an environment and fill it with test data. Useful in development.
 */
async function refreshDb(env, dbSuffix = '') {
	const knex = await recreateDb(env, dbSuffix);

	// no need to rollback as we just recreated the database
	// await knex.migrate.rollback();

	// migrate and seed the database with test data
	await knex.migrate.latest();
	await knex.seed.run();

	return knex;
}

module.exports = {
	getKnex,
	setKnex,
	dropDb,
	createDb,
	recreateDb,
	refreshDb,
	resetPgSequences,
	seedFolder,
};
